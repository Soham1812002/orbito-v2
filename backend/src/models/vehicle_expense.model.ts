import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface VehicleExpenseAttributes {
  id: string;
  companyName: string;
  branchName: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName?: string | null;
  expenseType: string;
  maintenanceType?: string | null;
  expenseDate: string;
  fuelType?: string | null;
  fuelStation?: string | null;
  fuelQuantity?: number | null;
  fuelRate?: number | null;
  expenseAmount: number;
  odometer: number;
  paymentMode: string;
  invoiceNumber?: string | null;
  description?: string | null;
  receiptUrl?: string | null;
  isReimbursable: boolean;
  attachReceiptLater: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface VehicleExpenseCreationAttributes
  extends Optional<
    VehicleExpenseAttributes,
    | "id"
    | "driverName"
    | "maintenanceType"
    | "fuelType"
    | "fuelStation"
    | "fuelQuantity"
    | "fuelRate"
    | "invoiceNumber"
    | "description"
    | "receiptUrl"
    | "isReimbursable"
    | "attachReceiptLater"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

export class VehicleExpense
  extends Model<VehicleExpenseAttributes, VehicleExpenseCreationAttributes>
  implements VehicleExpenseAttributes
{
  declare id: string;
  declare companyName: string;
  declare branchName: string;
  declare vehicleId: string;
  declare vehiclePlate: string;
  declare driverName: string | null;
  declare expenseType: string;
  declare maintenanceType: string | null;
  declare expenseDate: string;
  declare fuelType: string | null;
  declare fuelStation: string | null;
  declare fuelQuantity: number | null;
  declare fuelRate: number | null;
  declare expenseAmount: number;
  declare odometer: number;
  declare paymentMode: string;
  declare invoiceNumber: string | null;
  declare description: string | null;
  declare receiptUrl: string | null;
  declare isReimbursable: boolean;
  declare attachReceiptLater: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

VehicleExpense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "company_name"
    },
    branchName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "branch_name"
    },
    vehicleId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "vehicle_id"
    },
    vehiclePlate: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "vehicle_plate"
    },
    driverName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "driver_name"
    },
    expenseType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "expense_type"
    },
    maintenanceType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "maintenance_type"
    },
    expenseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "expense_date"
    },
    fuelType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "fuel_type"
    },
    fuelStation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: "fuel_station"
    },
    fuelQuantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "fuel_quantity"
    },
    fuelRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "fuel_rate"
    },
    expenseAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "expense_amount"
    },
    odometer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "payment_mode"
    },
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "invoice_number"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receiptUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "receipt_url"
    },
    isReimbursable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_reimbursable"
    },
    attachReceiptLater: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "attach_receipt_later"
    }
  },
  {
    sequelize,
    tableName: "vehicle_expenses",
    timestamps: true,
    paranoid: true,
    underscored: true
  }
);
