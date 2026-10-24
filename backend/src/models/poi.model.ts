import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface PoiAttributes {
  id: string;
  name: string;
  company: string;
  branch?: string | null;
  geoCode: string;
  category: string;
  street: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  description?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PoiCreationAttributes
  extends Optional<
    PoiAttributes,
    | "id"
    | "branch"
    | "radiusMeters"
    | "description"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class Poi
  extends Model<PoiAttributes, PoiCreationAttributes>
  implements PoiAttributes
{
  declare id: string;
  declare name: string;
  declare company: string;
  declare branch: string | null;
  declare geoCode: string;
  declare category: string;
  declare street: string;
  declare city: string;
  declare state: string;
  declare latitude: number;
  declare longitude: number;
  declare radiusMeters: number;
  declare description: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Poi.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "id"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "name"
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "company"
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "branch"
    },
    geoCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "geo_code"
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "category"
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "street"
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "city"
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "state"
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      field: "latitude",
      get() {
        const val = this.getDataValue("latitude" as any);
        return val === null ? null : parseFloat(val as any);
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      field: "longitude",
      get() {
        const val = this.getDataValue("longitude" as any);
        return val === null ? null : parseFloat(val as any);
      }
    },
    radiusMeters: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      field: "radius_meters"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at"
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at"
    }
  },
  {
    sequelize,
    tableName: "pois",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
