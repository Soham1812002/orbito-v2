import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "002_audit_and_system_config";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Audit Logs Table
  await queryInterface.createTable(
    "audit_logs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      user_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      user_role: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      user_initials: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      module: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      ip_address: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    { transaction }
  );

  await queryInterface.addIndex("audit_logs", ["module"], { transaction });
  await queryInterface.addIndex("audit_logs", ["status"], { transaction });
  await queryInterface.addIndex("audit_logs", ["created_at"], { transaction });

  // 2. System Configs Table (Document store for dynamic modules)
  await queryInterface.createTable(
    "system_configs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      module_key: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    { transaction }
  );

  await queryInterface.addIndex("system_configs", ["module_key"], { transaction });
  await queryInterface.addIndex("system_configs", ["is_active"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("system_configs", { transaction });
  await queryInterface.dropTable("audit_logs", { transaction });
}
