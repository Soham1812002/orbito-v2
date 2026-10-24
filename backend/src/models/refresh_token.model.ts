import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface RefreshTokenAttributes {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, "id" | "revokedAt" | "userAgent" | "ipAddress" | "createdAt" | "updatedAt"> {}

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare familyId: string;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare userAgent: string | null;
  declare ipAddress: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    tokenHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "token_hash"
    },
    familyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "family_id"
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at"
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "revoked_at"
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "user_agent"
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: "ip_address"
    }
  },
  {
    sequelize,
    tableName: "refresh_tokens",
    modelName: "RefreshToken",
    timestamps: true,
    underscored: true,
    paranoid: false
  }
);
