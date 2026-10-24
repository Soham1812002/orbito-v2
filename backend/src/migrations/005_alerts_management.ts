import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "005_alerts_management";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Alert Rules Configuration Table
  await queryInterface.createTable(
    "alert_rules",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      company_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "inOrbit Logistics"
      },
      branch_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "All Branches"
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      alert_type: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      severity: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: "warning"
      },
      vehicle_scope: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: "all"
      },
      vehicle_ids: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      schedule: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          start: "00:00",
          end: "23:59"
        }
      },
      channels: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          sms: false,
          email: true,
          push: true
        }
      },
      recipients: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
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

  await queryInterface.addIndex("alert_rules", ["name"], { transaction });
  await queryInterface.addIndex("alert_rules", ["alert_type"], { transaction });
  await queryInterface.addIndex("alert_rules", ["severity"], { transaction });
  await queryInterface.addIndex("alert_rules", ["is_active"], { transaction });

  // 2. Alert Incidents Log Table
  await queryInterface.createTable(
    "alert_logs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      rule_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "alert_rules",
          key: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      vehicle_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      plate_number: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      company_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "inOrbit Logistics"
      },
      branch_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "West Operations"
      },
      alert_type: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      alert_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      severity: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: "warning"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      trigger_value: {
        type: DataTypes.STRING(128),
        allowNull: true
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: "pending"
      },
      acknowledged_by: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      acknowledged_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      resolution_notes: {
        type: DataTypes.TEXT,
        allowNull: true
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

  await queryInterface.addIndex("alert_logs", ["vehicle_id"], { transaction });
  await queryInterface.addIndex("alert_logs", ["plate_number"], { transaction });
  await queryInterface.addIndex("alert_logs", ["alert_type"], { transaction });
  await queryInterface.addIndex("alert_logs", ["severity"], { transaction });
  await queryInterface.addIndex("alert_logs", ["status"], { transaction });
  await queryInterface.addIndex("alert_logs", ["created_at"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("alert_logs", { transaction });
  await queryInterface.dropTable("alert_rules", { transaction });
}
