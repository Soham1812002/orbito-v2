import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { logger } from "../configs/logger.js";
import * as initialSchema from "./001_initial_schema.js";

interface MigrationDefinition {
  name: string;
  up: (queryInterface: QueryInterface, transaction: any) => Promise<void>;
  down?: (queryInterface: QueryInterface, transaction: any) => Promise<void>;
}

const AVAILABLE_MIGRATIONS: MigrationDefinition[] = [
  initialSchema
];

export async function ensureMetaTable(): Promise<void> {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  if (!tables.includes("sequelize_meta")) {
    await queryInterface.createTable("sequelize_meta", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      }
    });
    logger.info("Created sequelize_meta table");
  }
}

export async function getAppliedMigrations(): Promise<string[]> {
  await ensureMetaTable();
  const rows = await sequelize.query<{ name: string }>(
    "SELECT name FROM sequelize_meta ORDER BY name ASC",
    { type: QueryTypes.SELECT }
  );
  return rows.map((r) => r.name);
}

export async function checkMigrations(): Promise<{ inSync: boolean; pending: string[] }> {
  const applied = await getAppliedMigrations();
  const pending = AVAILABLE_MIGRATIONS.map((m) => m.name).filter((name) => !applied.includes(name));
  return {
    inSync: pending.length === 0,
    pending
  };
}

export async function runMigrations(): Promise<void> {
  await ensureMetaTable();
  const applied = await getAppliedMigrations();
  const pending = AVAILABLE_MIGRATIONS.filter((m) => !applied.includes(m.name));

  if (pending.length === 0) {
    logger.info("Database is up to date. No pending migrations.");
    return;
  }

  logger.info(`Found ${pending.length} pending migration(s) to apply.`);
  const queryInterface = sequelize.getQueryInterface();

  for (const migration of pending) {
    logger.info(`Applying migration: ${migration.name}...`);
    const transaction = await sequelize.transaction();
    try {
      await migration.up(queryInterface, transaction);
      await sequelize.query(
        "INSERT INTO sequelize_meta (name) VALUES (:name)",
        {
          replacements: { name: migration.name },
          type: QueryTypes.INSERT,
          transaction
        }
      );
      await transaction.commit();
      logger.info(`Migration ${migration.name} successfully applied.`);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Migration ${migration.name} failed! Rolled back transaction.`, error);
      throw error;
    }
  }
  logger.info("All migrations completed successfully.");
}

// CLI runner handler
if (process.argv[1]?.includes("runner.ts")) {
  const action = process.argv[2] || "run";
  (async () => {
    try {
      await sequelize.authenticate();
      if (action === "check") {
        const { inSync, pending } = await checkMigrations();
        if (!inSync) {
          logger.warn(`Database out of sync! Pending migrations: ${pending.join(", ")}`);
          process.exit(1);
        } else {
          logger.info("Database migration check passed: 0 pending migrations.");
          process.exit(0);
        }
      } else {
        await runMigrations();
        process.exit(0);
      }
    } catch (err) {
      logger.error("Migration command failed", err);
      process.exit(1);
    }
  })();
}
