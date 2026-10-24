import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "009_geofence_and_poi";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Geofences Table
  await queryInterface.createTable(
    "geofences",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM("circular", "polygon"),
        allowNull: false,
        defaultValue: "circular"
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      company: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      branch: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      center_latitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      center_longitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      radius_meters: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 500
      },
      coordinates: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null
      },
      speed_limit_kmh: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 30
      },
      assigned_vehicles_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      alert_on_enter: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      alert_on_exit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      alert_on_overstay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      max_dwell_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      description: {
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

  await queryInterface.addIndex("geofences", ["company"], {
    name: "idx_geofences_company",
    transaction
  });
  await queryInterface.addIndex("geofences", ["category"], {
    name: "idx_geofences_category",
    transaction
  });
  await queryInterface.addIndex("geofences", ["is_active"], {
    name: "idx_geofences_is_active",
    transaction
  });

  // 2. Pois Table
  await queryInterface.createTable(
    "pois",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      company: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      branch: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      geo_code: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      radius_meters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      description: {
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

  await queryInterface.addIndex("pois", ["company"], {
    name: "idx_pois_company",
    transaction
  });
  await queryInterface.addIndex("pois", ["geo_code"], {
    name: "idx_pois_geo_code",
    transaction
  });
  await queryInterface.addIndex("pois", ["category"], {
    name: "idx_pois_category",
    transaction
  });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("pois", { transaction });
  await queryInterface.dropTable("geofences", { transaction });
}
