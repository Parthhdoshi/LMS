import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';
import { ICourse } from './course.model';

interface IProgress extends Document {
  user: IUser
  course: ICourse   ;
  completedSections: number;
  totalSections: number;
  progressPercentage: number;
  locked:Boolean
}

const progressSchema = new Schema<IProgress>({
  user: { type: String, ref: 'User', required: true },
  course: { type: String, ref: 'Course', required: true },
  completedSections: { type: Number, required: true, default: 0 },
  totalSections: { type: Number, required: true },
  progressPercentage: { type: Number, required: true, default: 0 },
  locked: { type: Boolean, required: true, default:true },
} , { timestamps: true } );

const ProgressModal = mongoose.model<IProgress>('Progress', progressSchema);

export { IProgress, ProgressModal };
