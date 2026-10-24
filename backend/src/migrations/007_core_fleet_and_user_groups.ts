import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "007_core_fleet_and_user_groups";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Drivers Table
  await queryInterface.createTable(
    "drivers",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      license_number: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "DRV"
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 5.0
      },
      is_active: {
        type: DataTypes.BOOLEAN,
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

  // 2. Vehicles Table
  await queryInterface.createTable(
    "vehicles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      plate_number: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      make_model: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "heavy_truck"
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "stopped"
      },
      speed: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      heading: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        defaultValue: 28.6139
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        defaultValue: 77.209
      },
      ignition: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      fuel_percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      battery_percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      odometer: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      engine_temp: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 25
      },
      last_location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "Depot"
      },
      last_updated: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Just now"
      },
      device_imei: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      driver_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "drivers",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      company_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "InOrbit Logistics"
      },
      today_distance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      immobilizer_state: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "unlocked"
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

  // 3. User Groups Table
  await queryInterface.createTable(
    "user_groups",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: ""
      },
      company: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "InOrbit Fleet Logistics"
      },
      branch: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "Mumbai Central Hub"
      },
      reseller: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "Direct Enterprise"
      },
      admin_role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "VIEWER"
      },
      allow_excel_export: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      allow_operational_manage: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      is_system_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      permissions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: "[]"
      },
      is_active: {
        type: DataTypes.BOOLEAN,
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

  // 4. Alter users table with enterprise profile columns
  const userColumns = [
    { name: "phone", type: DataTypes.STRING(30), defaultValue: "+91 98201 12345" },
    { name: "company", type: DataTypes.STRING(120), defaultValue: "InOrbit Fleet Logistics" },
    { name: "branch", type: DataTypes.STRING(120), defaultValue: "Mumbai Central Hub" },
    { name: "reseller", type: DataTypes.STRING(120), defaultValue: "Direct Enterprise" },
    { name: "group_id", type: DataTypes.UUID, references: { model: "user_groups", key: "id" }, onDelete: "SET NULL" },
    { name: "allocation_group", type: DataTypes.STRING(120), defaultValue: "All India Logistics" },
    { name: "expiry_date", type: DataTypes.STRING(30), defaultValue: "2028-12-31" },
    { name: "language", type: DataTypes.STRING(10), defaultValue: "en" },
    { name: "timezone", type: DataTypes.STRING(50), defaultValue: "Asia/Kolkata" },
    { name: "date_format", type: DataTypes.STRING(20), defaultValue: "DD/MM/YYYY" },
    { name: "measurement_unit", type: DataTypes.STRING(10), defaultValue: "km" },
    { name: "features", type: DataTypes.JSONB, defaultValue: '{"liveTracking":true,"dashboardCharts":true,"routePlayback":true,"emailAlerts":true}' }
  ];

  for (const col of userColumns) {
    try {
      await queryInterface.addColumn(
        "users",
        col.name,
        {
          type: col.type,
          allowNull: true,
          defaultValue: (col as any).defaultValue,
          references: (col as any).references,
          onDelete: (col as any).onDelete
        },
        { transaction }
      );
    } catch {
      // Column may already exist in development
    }
  }
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("vehicles", { transaction });
  await queryInterface.dropTable("drivers", { transaction });
  await queryInterface.dropTable("user_groups", { transaction });
}
