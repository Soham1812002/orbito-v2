import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "001_initial_schema";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  // 1. Roles table
  await queryInterface.createTable(
    "roles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING(255),
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

  // 2. Permissions table
  await queryInterface.createTable(
    "permissions",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      entity: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(255),
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
      }
    },
    { transaction }
  );

  // 3. Users table
  await queryInterface.createTable(
    "users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      password_changed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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

  // 4. User Roles junction table
  await queryInterface.createTable(
    "user_roles",
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "roles",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    },
    { transaction }
  );

  // 5. Role Permissions junction table
  await queryInterface.createTable(
    "role_permissions",
    {
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "roles",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "permissions",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    },
    { transaction }
  );

  // 6. User Password History table
  await queryInterface.createTable(
    "user_password_history",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    { transaction }
  );

  // Add indexes
  await queryInterface.addIndex("users", ["email"], { transaction });
  await queryInterface.addIndex("roles", ["name"], { transaction });
  await queryInterface.addIndex("permissions", ["code"], { transaction });
  await queryInterface.addIndex("user_password_history", ["user_id", "created_at"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("user_password_history", { transaction });
  await queryInterface.dropTable("role_permissions", { transaction });
  await queryInterface.dropTable("user_roles", { transaction });
  await queryInterface.dropTable("users", { transaction });
  await queryInterface.dropTable("permissions", { transaction });
  await queryInterface.dropTable("roles", { transaction });
}
