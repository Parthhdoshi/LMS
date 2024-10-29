import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMaintenanceSchema extends Document {
  status: boolean;
}

const maintenanceSchema = new Schema<IMaintenanceSchema>(
  {
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const MaintenanceModel: Model<IMaintenanceSchema> = mongoose.model(
  "maintenance",
  maintenanceSchema
);

export default MaintenanceModel;
