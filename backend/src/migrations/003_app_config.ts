import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "003_app_config";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // App Configs Table (Document store for dynamic app configuration modules)
  await queryInterface.createTable(
    "app_configs",
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

  await queryInterface.addIndex("app_configs", ["module_key"], { transaction });
  await queryInterface.addIndex("app_configs", ["module_key", "is_active"], { transaction });
  await queryInterface.addIndex("app_configs", ["deleted_at"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("app_configs", { transaction });
}
