import { Schema, model, Document } from 'mongoose';

interface ITask extends Document {
  course: Schema.Types.ObjectId;
  title: string;
}

const taskSchema = new Schema<ITask>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: {
    type: String,
    required: true,
  },
},   { timestamps: true });

export const TaskModel = model<ITask>('Task', taskSchema);


const userQuizAssignmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  assignedQuizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
});

export const UserQuizAssignmentSchema = model('UserQuizAssignment', userQuizAssignmentSchema);