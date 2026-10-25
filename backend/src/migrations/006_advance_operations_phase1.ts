import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "006_advance_operations_phase1";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Route Paths Table (Defined logistics corridors)
  await queryInterface.createTable(
    "route_paths",
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
      route_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      route_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      origin_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      origin_latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      origin_longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      destination_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      destination_latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      destination_longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      distance_km: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      estimated_duration_mins: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      max_allowed_speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 80
      },
      buffer_radius_meters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      waypoints: {
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

  await queryInterface.addIndex("route_paths", ["route_code"], { transaction });
  await queryInterface.addIndex("route_paths", ["is_active"], { transaction });

  // 2. Route Path Allocations Table
  await queryInterface.createTable(
    "route_path_allocations",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      route_path_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "route_paths",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      vehicle_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      vehicle_plate: {
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
        defaultValue: "All Branches"
      },
      allocation_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      schedule_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "daily"
      },
      active_days: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: ["Mon", "Tue", "Wed", "Thu", "Fri"]
      },
      departure_time: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "08:00"
      },
      max_transit_hours: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 8
      },
      allow_deviation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      deviation_alert_threshold_meters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000
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

  await queryInterface.addIndex("route_path_allocations", ["route_path_id"], { transaction });
  await queryInterface.addIndex("route_path_allocations", ["vehicle_id"], { transaction });
  await queryInterface.addIndex("route_path_allocations", ["is_active"], { transaction });

  // 3. Crew Allocations Table (Driver & Cleaner roster)
  await queryInterface.createTable(
    "crew_allocations",
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
      vehicle_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      vehicle_plate: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      primary_driver_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      primary_driver_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      primary_driver_phone: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      secondary_driver_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      secondary_driver_name: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      cleaner_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      cleaner_name: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      shift_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Day Shift"
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      duty_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "on_duty"
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
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

  await queryInterface.addIndex("crew_allocations", ["vehicle_id"], { transaction });
  await queryInterface.addIndex("crew_allocations", ["primary_driver_id"], { transaction });
  await queryInterface.addIndex("crew_allocations", ["is_active"], { transaction });

  // 4. Fleet Immobilizer Audit Register
  await queryInterface.createTable(
    "immobilizer_audits",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      command: {
        type: DataTypes.STRING(50),
        allowNull: false // 'STOP_ENGINE', 'RESUME_ENGINE'
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "executed" // 'executed', 'pending', 'failed', 'cancelled'
      },
      operator_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      operator_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      relay_voltage: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      speed_at_execution: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      location_address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      response_time_ms: {
        type: DataTypes.INTEGER,
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

  await queryInterface.addIndex("immobilizer_audits", ["vehicle_id"], { transaction });
  await queryInterface.addIndex("immobilizer_audits", ["status"], { transaction });
  await queryInterface.addIndex("immobilizer_audits", ["created_at"], { transaction });

  // 5. Compliance & Statutory Reminders
  await queryInterface.createTable(
    "compliance_reminders",
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
      entity_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "vehicle" // 'vehicle', 'driver', 'depot'
      },
      entity_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      entity_identifier: {
        type: DataTypes.STRING(100),
        allowNull: false // e.g. plate number or license number
      },
      reminder_category: {
        type: DataTypes.STRING(100),
        allowNull: false // 'National Permit', 'Road Tax', 'Fitness Certificate', 'Insurance Policy', 'PUC'
      },
      document_number: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      notify_before_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
      },
      notify_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      notify_sms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      notify_push: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "active" // 'active', 'due_soon', 'overdue', 'renewed'
      },
      notes: {
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

  await queryInterface.addIndex("compliance_reminders", ["entity_type", "entity_id"], { transaction });
  await queryInterface.addIndex("compliance_reminders", ["expiry_date", "status"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("compliance_reminders", { transaction });
  await queryInterface.dropTable("immobilizer_audits", { transaction });
  await queryInterface.dropTable("crew_allocations", { transaction });
  await queryInterface.dropTable("route_path_allocations", { transaction });
  await queryInterface.dropTable("route_paths", { transaction });
}
