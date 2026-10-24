import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "010_refresh_tokens";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.createTable(
    "refresh_tokens",
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      token_hash: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      family_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING(45),
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

  await queryInterface.addIndex("refresh_tokens", ["token_hash"], {
    name: "idx_refresh_tokens_hash",
    transaction
  });
  await queryInterface.addIndex("refresh_tokens", ["user_id"], {
    name: "idx_refresh_tokens_user",
    transaction
  });
  await queryInterface.addIndex("refresh_tokens", ["family_id"], {
    name: "idx_refresh_tokens_family",
    transaction
  });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("refresh_tokens", { transaction });
}
