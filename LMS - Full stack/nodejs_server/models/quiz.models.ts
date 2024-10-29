import mongoose, { Document, Model, Schema } from "mongoose";

interface IOptionSchema {
    text : string
    isCorrect : boolean
}

interface IQuestionSchema {
    questionText : string
    questionImage?: string
    options : IOptionSchema[]
    type : 'single' | 'multiple'
}

interface IQuizSchema {
    title : string
    description : string
    questions : IOptionSchema
    course : object
}

const optionSchema = new Schema<IOptionSchema>({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  });
  
  const questionSchema = new Schema<IQuestionSchema>({
    questionText: { type: String, required: true },
    questionImage: { type: String, default:"" }, // URL for question image
    options: [optionSchema], // Array of options
    type: { type: String, enum: ['single', 'multiple'], default:"single" } // 'single' or 'multiple'
  });
  
  const quizSchema = new Schema<IQuizSchema>({
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    course: { type: Schema.Types.ObjectId, ref: 'Course' } // Reference to the related course
  }, { timestamps: true });
  
  // Export the Quiz model
  
  export const QuizModel = mongoose.model('Quiz', quizSchema);