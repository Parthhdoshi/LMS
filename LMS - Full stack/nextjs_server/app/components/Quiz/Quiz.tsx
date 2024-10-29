import React, { useState } from "react";

interface Option {
  _id: string;
  text: string;
}

interface Question {
  _id: string;
  questionText: string;
  questionImage?: string;
  options: Option[];
  type: "single" | "multiple"; // Indicates single or multiple choice
}

// Define types for the props
interface QuizComponentProps {
  questions: Question[];
  // eslint-disable-next-line no-unused-vars
  handleQuizSubmit?: (answers: Record<string, string | string[]>) => void;
  reviewCreationLoading: boolean;
  existingQuizResult: any;
}

const Quiz: React.FC<QuizComponentProps> = ({
  questions,
  handleQuizSubmit,
  reviewCreationLoading,
  existingQuizResult,
}) => {
  const currentQuestionIndexDefaultValue: number = 0;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    currentQuestionIndexDefaultValue
  );
  const [answers, setAnswers] = useState<any>([]);
  const [retry, setRetry] = useState<any>(existingQuizResult.length === 0);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleOptionChange = (questionId: string, optionId: string) => {
    setAnswers((prevAnswers: any) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer: any) => answer.questionId === questionId
      );

      if (existingAnswerIndex !== -1) {
        // Update the existing answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].selectedOption = optionId;
        return updatedAnswers;
      } else {
        // Add a new answer
        return [...prevAnswers, { questionId, selectedOption: optionId }];
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFormSubmit = () => {
    if (handleQuizSubmit) {
      handleQuizSubmit(answers);
      setRetry(false);
    }
  };

  const handleRetry = () => {
    setRetry(true);
  };


  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        {retry ? (
          <div className="w-full max-w-100 p-4 rounded-md shadow-md dark:text-white text-black">
            Question {currentQuestionIndex + 1} / {questions?.length}
            <h2 className="text-xl font-semibold mb-4 dark:text-white text-black">
              {currentQuestion?.questionText}
            </h2>
            {currentQuestion?.questionImage && (
              <img
                src={currentQuestion?.questionImage}
                alt="Question"
                className="mb-4"
              />
            )}
            <div className="mb-4">
              {currentQuestion?.options.map((option) => (
                <div key={option._id} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type={
                        currentQuestion.type === "multiple"
                          ? "checkbox"
                          : "radio"
                      }
                      name={currentQuestion._id}
                      value={option.text}
                      onChange={() =>
                        handleOptionChange(currentQuestion._id, option._id)
                      }
                      checked={answers.some(
                        (answer: any) =>
                          answer.questionId === currentQuestion._id &&
                          answer.selectedOption === option._id
                      )}
                      className="form-checkbox "
                    />
                    <span className="ml-2 dark:text-white text-black">{option.text}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                className={`${
                  reviewCreationLoading ? "cursor-no-drop" : "cursor-pointer"
                } px-4 py-2 bg-blue-600 text-white rounded-full font-bold font-Poppins`}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>

              {currentQuestionIndex < questions?.length - 1 ? (
                <button
                  className={`${
                    reviewCreationLoading ? "cursor-no-drop" : "cursor-pointer"
                  } px-4 py-2 bg-blue-600 text-white rounded-full font-bold font-Poppins `}
                  onClick={handleNext}
                  disabled={reviewCreationLoading}
                >
                  Next
                </button>
              ) : (
                <button
                  className={`${
                    reviewCreationLoading ? "cursor-no-drop" : "cursor-pointer"
                  } px-4 py-2 bg-green-500 text-white rounded-md`}
                  onClick={reviewCreationLoading ? () => {} : handleFormSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-100 p-4 rounded-md shadow-md text-center">
              <h2 className="dark:text-white text-black text-xl font-semibold mb-4">
                Your Quiz has been submitted successfully. You got{" "}
                {existingQuizResult?.[existingQuizResult.length - 1]?.score} out of{" "}
                {existingQuizResult[existingQuizResult.length - 1]?.totalQuestions}.
              </h2>
              {existingQuizResult?.[existingQuizResult.length - 1]?.score !==
              existingQuizResult[existingQuizResult.length - 1]?.totalQuestions ? (
                <h2 className="dark:text-white text-black text-lg font-semibold mb-4">
                  Are you sure you want to give one more try?
                </h2>
              ) : (
                <>
                  <h2 className="dark:text-white text-black text-lg font-semibold mb-4">
                    Congratulation! You got 100% Result.
                  </h2>

                  {/* <button
                    className={`${
                      reviewCreationLoading
                        ? "cursor-no-drop"
                        : "cursor-pointer"
                    } px-4 py-2 bg-green-700 text-white rounded-md`}
                    onClick={handleRetry}
                  >
                    Retry
                  </button> */}
                </>
              )}
              <div className="flex justify-around">
                {existingQuizResult?.[existingQuizResult.length - 1]?.score ===
                existingQuizResult[existingQuizResult.length - 1]
                  ?.totalQuestions ? (
                  <></>
                ) : (
                  <>
                    <button
                      className={`${
                        reviewCreationLoading
                          ? "cursor-no-drop"
                          : "cursor-pointer"
                      } px-4 py-2 bg-green-700 text-white rounded-md`}
                      onClick={handleRetry}
                    >
                      Retry
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <br />
      <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
    </div>
  );
};

export default Quiz;
