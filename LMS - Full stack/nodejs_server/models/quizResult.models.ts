import { Document, Schema, model } from 'mongoose';

// Define the structure of an answer
interface IAnswer {
  questionId: Schema.Types.ObjectId;
  selectedOption: string;
  isCorrect: boolean;
}

// Define the structure of a quiz result
export interface IQuizResult extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  quiz: Schema.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  totalQuestions: number;
  completionDate: Date;
  task: string[]; // Array of strings to store tasks
  isPassed: boolean; // Boolean to indicate pass or fail
  calculatePassOrFail: (score: number,totalQuestions: number,passingScore: number) => string;
}

// Create a Mongoose schema for the quiz result
const quizResultSchema = new Schema<IQuizResult>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Quiz.questions', required: true },
        selectedOption: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    completionDate: { type: Date, default: Date.now },
    task: { type: [String], default: [] }, // Array of strings for tasks
    isPassed: { type: Boolean, required: true }, // Pass or fail check
  },
  { timestamps: true }
);

quizResultSchema.methods.calculatePassOrFail = function (score: number,totalQuestions: number,passingScore: number): void {
  this.isPassed = ( this.score / totalQuestions ) * 100 >= passingScore;
};

export const QuizResultModel = model<IQuizResult>('QuizResult', quizResultSchema);
