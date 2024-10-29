import mongoose, { Schema, Document } from 'mongoose';

interface ILog extends Document {
  userId: mongoose.Types.ObjectId;  // Reference to User Schema
  action: string;                  // API endpoint, method (GET, POST, etc.), or page visited
  timestamp: Date;                 // Time of request
  method: string;                  // HTTP method
  payload: string;                 // Payload
  statusCode: number;              // Response status code
  userAgent: string;               // User's browser info
  ip: string;                      // User's IP address
}

const logSchema: Schema = new Schema({
  userId: { type: String, ref: 'User', required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  payload :{ type: String, required: true },
  method: { type: String, required: true },
  statusCode: { type: Number, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true }
});

const LogModel = mongoose.model<ILog>('Log', logSchema);

export default LogModel;
