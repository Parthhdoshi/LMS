import { Schema, model, Document } from 'mongoose';

export interface ITaskResult extends Document {
  courseId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  location: string;
  key: string;  
  pass: boolean;
}

const taskResultSchema = new Schema<ITaskResult>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  key: { type: String, required: true },
  pass: { type: Boolean, default: false },
}, { timestamps: true });

export const TaskResult = model<ITaskResult>('TaskResult', taskResultSchema);
