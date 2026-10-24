import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "004_maintenance_and_expenses";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Maintenance Reminders Table
  await queryInterface.createTable(
    "maintenance_reminders",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      company_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      branch_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      vehicle_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      vehicle_plate: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      vehicle_group: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "All groups"
      },
      reminder_type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      reminder_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      last_service_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      last_mileage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      next_service_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      next_mileage: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reminder_time: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "09:00 AM"
      },
      repeat_interval_months: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      repeat_interval_km: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      notify_before_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 7
      },
      notify_before_km: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      notify_user: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      notify_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      notify_sms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      notify_app: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Upcoming"
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

  await queryInterface.addIndex("maintenance_reminders", ["vehicle_plate"], { transaction });
  await queryInterface.addIndex("maintenance_reminders", ["status"], { transaction });
  await queryInterface.addIndex("maintenance_reminders", ["next_service_date"], { transaction });
  await queryInterface.addIndex("maintenance_reminders", ["deleted_at"], { transaction });

  // 2. Vehicle Expenses Table
  await queryInterface.createTable(
    "vehicle_expenses",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      company_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      branch_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      vehicle_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      vehicle_plate: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      driver_name: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      expense_type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      maintenance_type: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      expense_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      fuel_type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      fuel_station: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      fuel_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      fuel_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      expense_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      odometer: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payment_mode: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      invoice_number: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      receipt_url: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      is_reimbursable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      attach_receipt_later: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

  await queryInterface.addIndex("vehicle_expenses", ["vehicle_plate"], { transaction });
  await queryInterface.addIndex("vehicle_expenses", ["expense_type"], { transaction });
  await queryInterface.addIndex("vehicle_expenses", ["expense_date"], { transaction });
  await queryInterface.addIndex("vehicle_expenses", ["deleted_at"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("vehicle_expenses", { transaction });
  await queryInterface.dropTable("maintenance_reminders", { transaction });
}
