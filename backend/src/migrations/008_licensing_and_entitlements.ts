import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "008_licensing_and_entitlements";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Company Licenses Table
  await queryInterface.createTable(
    "company_licenses",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      company: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      branch: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      contact_person: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      telephone: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      license_type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      license_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      license_number: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      issuing_authority: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      license_issue_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      activation_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      expiry_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      extend_date: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "—"
      },
      added_vehicles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      max_vehicles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "ACTIVE"
      },
      status_label: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Active"
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
      },
      renewal_reminder: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "30 days before expiry"
      },
      send_renewal_notification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

  // 2. Reseller Licenses Table
  await queryInterface.createTable(
    "reseller_licenses",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      reseller: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      contact_person: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      telephone: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      license_number: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      license_model: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Tier-1 Distribution"
      },
      activation_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      expiry_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      extended_date: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "—"
      },
      allocated_clients: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      allocated_vehicles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      vehicle_quota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      payment_reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "N/A"
      },
      notification_email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: ""
      },
      renewal_reminder: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "30 days before expiry"
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
      },
      payment_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      send_expiry_notification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "ACTIVE"
      },
      status_label: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Active"
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

  // 3. Vehicle Licenses Table
  await queryInterface.createTable(
    "vehicle_licenses",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      company: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      branch: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      vehicle: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      vehicle_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "vehicles",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      registration_number: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      gps_device: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      imei: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      sim_number: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      license_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "Standard Telematics License"
      },
      license_number: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      issuing_authority: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: "Transport Authority"
      },
      license_issue_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      activation_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      expiry_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      extended_date: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "—"
      },
      assigned_user: {
        type: DataTypes.STRING(120),
        allowNull: true
      },
      license_amount: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "₹4,500/yr"
      },
      payment_reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "N/A"
      },
      renewal_reminder: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "30 days before expiry"
      },
      notification_email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: ""
      },
      payment_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      send_expiry_notification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "ACTIVE"
      },
      status_label: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Active"
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

  // 4. User Licenses Table
  await queryInterface.createTable(
    "user_licenses",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      user_email: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      user_role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "VIEWER"
      },
      company: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      branch: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      telephone: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      license_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Standard Seat License"
      },
      license_number: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      license_key: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      allocated_vehicles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      activation_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      expiry_date: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      extend_date: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "—"
      },
      license_amount: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "₹2,400/yr"
      },
      payment_status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "PAID"
      },
      payment_reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "N/A"
      },
      renewal_reminder: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "30 days before expiry"
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
      },
      send_activation_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      send_renewal_notification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "ACTIVE"
      },
      status_label: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Active"
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

  await queryInterface.addIndex("company_licenses", ["company"], { transaction });
  await queryInterface.addIndex("company_licenses", ["deleted_at"], { transaction });

  await queryInterface.addIndex("reseller_licenses", ["reseller"], { transaction });
  await queryInterface.addIndex("reseller_licenses", ["deleted_at"], { transaction });

  await queryInterface.addIndex("vehicle_licenses", ["company"], { transaction });
  await queryInterface.addIndex("vehicle_licenses", ["deleted_at"], { transaction });

  await queryInterface.addIndex("user_licenses", ["company"], { transaction });
  await queryInterface.addIndex("user_licenses", ["deleted_at"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("user_licenses", { transaction });
  await queryInterface.dropTable("vehicle_licenses", { transaction });
  await queryInterface.dropTable("reseller_licenses", { transaction });
  await queryInterface.dropTable("company_licenses", { transaction });
}
