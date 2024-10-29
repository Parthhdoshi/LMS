import { styles } from "@/app/styles/style";
import {
  useAddQuizMutation,
  useGetAllCoursesQuery,
  useGetAllQuizQuery,
  useUpdateQuizMutation,
} from "@/redux/features/courses/coursesApi";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Radio,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CloudDownloadIcon, DeleteIcon, EditIcon } from "../sidebar/Icon";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  options: Answer[];
  questionImages ?: string
}

const Quiz = () => {
  const [course, setCourse] = useState<any>();
  const [rows, setRows] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [quizName, setQuizName] = useState<any>();
  const [quizDescription, setQuizDescription] = useState<string | null>();
  const [editData, setEditData] = useState<any>();
  const [addQuiz, { isLoading: createQuizLoading, isSuccess:createQuizSuccess }] = useAddQuizMutation();
  const [updateQuiz, { isLoading: updateQuizLoading, isSuccess: updateQuizSuccess }] = useUpdateQuizMutation();

  const handleQuizModelClose = () => {
    setEditData(null)
    setOpen(!open)
    setEditData(null)
    setQuizName(null);
    setQuizDescription(null);
    setCourse(null); 
    setQuestions([]); 
  }

  const {
    data: quizData,
    isLoading: quizLoading,
    refetch: quizRefresh,
  } = useGetAllQuizQuery({}, { refetchOnMountOrArgChange: true });

  const {
    data: courseData,
    isLoading: courseLoading,
    refetch: courseRefresh,
  } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (createQuizSuccess) {
      toast.success("Quiz Created Successfully!");
      setOpen(false);
      quizRefresh();
    }
  }, [createQuizSuccess]);

  let columns: any = [
    { field: "id", headerName: "ID", flex: 0.1 },
    { field: "quiz", headerName: "Quiz Name", flex: 0.3 },
    { field: "description", headerName: "Description", flex: 0.8 },
    { field: "course", headerName: "Course", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.1,
      renderCell: (params: any) => {
        return (
          <Tooltip title="Edit" placement="top">
            <IconButton>
              <EditIcon onClick={() => {
                handleEditClick(params.row)
                setOpen(!open)
                }} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    let tempRows: any = [];
    quizData &&
      quizData.quiz.forEach((quiz: any) => {
        tempRows.push({
          id: quiz._id,
          quiz: quiz?.title || "",
          description: quiz?.description || "",
          course: quiz?.course?.name || "",
          others : quiz
        });
      });

    setRows(tempRows);
  }, [quizData]);

  useEffect(()=>{
    if(open && !editData){
      let newErrors: any = {};
      const check = rows.map((row:any)=>( row.others.course._id.includes(course?._id) ))[0]
      if(check){
        newErrors[`course`] = "Quiz Already Exist For This Course!";
      }
      setErrors(newErrors);
    }
  },[course])

  const [questions, setQuestions] = useState<Question[]>([{
    questionText: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  }]);
  const [errors, setErrors] = useState<any>({});

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {

    let newQuestions = [...questions].map((q) => ({ ...q }));

    newQuestions[index] = {
      ...newQuestions[index],
      questionText: e.target.value,
    };
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    answerIndex: number
  ) => {
    const newQuestions = [...questions].map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    }));
  
    newQuestions[questionIndex].options[answerIndex].text = e.target.value;
  
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    const newQuestions = [...questions].map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    }));
  
    // Update the specific answer's isCorrect property
    newQuestions[questionIndex].options.forEach(
      (answer, idx) => (answer.isCorrect = idx === answerIndex)
    );
  
    // Set the updated questions array to state
    setQuestions(newQuestions);
   };

  const validateFields = () => {
    const newErrors: any = {};
    if(!course){
      newErrors[`course`] = "This is required";
    }
    if(!quizName){
      newErrors[`quizName`] = "This is required";
    }


    questions.forEach((q:any, qIndex) => {
      if (!q.questionText) {
        newErrors[`question-${qIndex}`] = "Question is required";
      }
      q.options.forEach((a:any, aIndex:any) => {
        if (!a.text) {
          newErrors[`answer-${qIndex}-${aIndex}`] = "Answer is required";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (quiz: any) => {
    setEditData(quiz);
    setQuizName(quiz.quiz);
    setQuizDescription(quiz.description);
    setCourse(quiz.others.course); 
    setQuestions(quiz.others.questions); 
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (validateFields()) {

      if(editData?.id){
        await updateQuiz({
          quizId : editData.id,
          courseId : course._id,
          title : quizName,
          description : quizDescription,
          questions
        })
        handleQuizModelClose()
      }else{
        await addQuiz({
          courseId : course._id,
          title : quizName,
          description : quizDescription,
          questions
        })
        handleQuizModelClose()
      }

    }
  };

  return (
    <>
      <div className="h-auto px-5">
        <div className="mt-[100px]">
          <Box>
            <div className="w-full flex justify-between">
              <div>
                <h1 className={`${styles.title} !text-start`}>Quiz</h1>
              </div>

              <div
                className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#264d80] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                onClick={() => setOpen(!open)}
              >
                Add New Quiz
              </div>
            </div>
          </Box>
        </div>
        <div>
          <Box m="40px 0 20px 0" height="80vh">
            <DataGrid rows={rows} columns={columns} />
          </Box>
        </div>
      </div>

      {open && (
        <Modal
          open={open}
          onClose={handleQuizModelClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[650px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none h-5/6 overflow-auto">
            <h1 className={`${styles.title}`}>Quiz Details</h1>

            <p className="text-center">Here you can add or modify Quiz.</p>
            <div className="mt-[20px]">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={courseData?.courses ? courseData.courses : []}
                getOptionLabel={(option: any) => option.name}
                value={course}
                disableClearable
                onChange={(event: any, newValue: any) => {
                  setCourse(newValue ? newValue : "");
                }}
                size="small"
                renderInput={(params) => (
                  <TextField 
                  {...params} 
                  label="Please Select Course" 
                  error={!!errors[`course`]}
                  helperText={errors[`course`]}
                  />
                )}
              />
            </div>
            <div>
              <div className="mt-[20px] w-full">
                <TextField
                  size="small"
                  label="Quiz Name"
                  fullWidth
                  multiline
                  maxRows={5}
                  value={ quizName }
                  onChange={(e: any) => {
                  setQuizName(e.target.value)
                  }}
                  error={!!errors[`quizName`]}
                  helperText={errors[`quizName`]}
                  placeholder="Enter a Quiz Title."
                />
              </div>
              <div className="mt-[20px] w-full ">
                <TextField
                  size="small"
                  label="Quiz Description"
                  fullWidth
                  multiline
                  maxRows={5}
                  value={ quizDescription }
                  onChange={(e: any) => {
                  setQuizDescription(e.target.value)
                  }}
                  placeholder="Enter a Quiz Description."
                />
              </div>

              <div className="mt-[20px] flex justify-between m-3.5 items-center">
                <div>
                  <Typography> Add Question </Typography>
                </div>
                <div>
                  <Button variant="contained" onClick={handleAddQuestion}>
                    + Add Question
                  </Button>
                </div>
              </div>

              {questions.map((question, qIdx) => (
                <div key={qIdx} className="question section mt-[20px]">
                 
                  <Divider sx={{ my: 3 }}> {`Question ${qIdx + 1}`} </Divider>

                  <div className="mt-[20px] w-full flex">
                    <TextField
                      size="small"
                      label={`Question ${qIdx + 1}`}
                      fullWidth
                      multiline
                      maxRows={5}
                      value={question.questionText}
                      onChange={(e: any) => handleQuestionChange(e, qIdx)}
                      placeholder="Enter Question."
                      error={!!errors[`question-${qIdx}`]}
                      helperText={errors[`question-${qIdx}`]}
                    />
                    { questions.length > 1 && <Button onClick={() => handleRemoveQuestion(qIdx)}>

                      <DeleteIcon />
                    
                    </Button>}
                  </div>

                  {question.options.map((answer, aIdx) => (
                    <div key={aIdx} className="mt-[20px] w-full flex">
                      <TextField
                        size="small"
                        label={`Answer ${aIdx + 1}`}
                        fullWidth
                        multiline
                        maxRows={5}
                        value={answer.text}
                        onChange={(e: any) => handleAnswerChange(e, qIdx, aIdx)}
                        error={!!errors[`answer-${qIdx}-${aIdx}`]}
                        helperText={errors[`answer-${qIdx}-${aIdx}`]}
                      />
                      <Radio
                        checked={answer.isCorrect}
                        onChange={() => handleCorrectAnswerChange(qIdx, aIdx)}
                        value={aIdx.toString()}
                        name={`radio-buttons-${qIdx}`}
                        inputProps={{ "aria-label": aIdx.toString() }}
                      />
                    </div>
                  ))}
                </div>
              ))}

            </div>
            <div className="flex w-full items-center justify-between mb-6 mt-4">
              <button
                className={`${styles.button} px-4 py-2 my-4 bg-blue-600 text-white rounded !w-[120px]`}
                onClick={handleSubmit}
              >
                {" "}
                Submit{" "}
              </button>
              <div
                className={`${styles.button} !w-[120px] h-[30px] bg-[#e04f4f]`}
                onClick={handleQuizModelClose}
              >
                Cancel
              </div>
            </div>
          </Box>
        </Modal>
      )}


    </>
  );
};

export default Quiz;
