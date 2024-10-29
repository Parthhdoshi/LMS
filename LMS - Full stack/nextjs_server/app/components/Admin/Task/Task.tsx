"use client";
import { styles } from "@/app/styles/style";
import {
  useAddTaskMutation,
  useChangeTaskResultStatusMutation,
  useEditCourseMutation,
  useGetAllCoursesQuery,
  useGetAllTaskQuery,
  useGetAllTaskResultQuery,
  useUpdateTaskMutation,
} from "@/redux/features/courses/coursesApi";
import React, { useDeferredValue, useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import {
  Autocomplete,
  Box,
  Modal,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineMail } from "react-icons/ai";
import { CloudDownloadIcon, MoreVertIcon } from "../sidebar/Icon";

const Task = () => {
  const [exitingCourseTask, setExitingCourseTask] = useState<any>("");
  const [newOrUpdatedCourseTask, setNewOrUpdatedCourseTask] = useState("");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const { data, isLoading, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: taskResultData,
    isLoading: taskResultLoading,
    refetch: taskResultRefresh,
  } = useGetAllTaskResultQuery({}, { refetchOnMountOrArgChange: true });
  const [updateTask, { isLoading: TaskLoading }] = useUpdateTaskMutation();
  const [changeTaskResultStatus, { isLoading: TaskStatusLoading }] = useChangeTaskResultStatusMutation();

  const handleTaskSubmit = () => {
    updateTask({
      courseId: exitingCourseTask._id,
      taskTitle: newOrUpdatedCourseTask,
    });
    refetch();
  };

  const handleTaskStatusChange = async (id: any, status: any) => {
    await changeTaskResultStatus({
      taskResultId: id,
      pass: !status,
    });
    taskResultRefresh();
  };

  let columns: any = [
    { field: "id", headerName: "ID", flex: 0.1 },
    { field: "task", headerName: "Task Name", flex: 0.5 },
    { field: "user", headerName: "User", flex: 0.5 },
    { field: "course", headerName: "Course", flex: 0.5 },
    {
      field: "pass",
      headerName: "Change Status",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <Switch
              checked={params.row.pass}
              onChange={() =>
                handleTaskStatusChange(params.row.id, params.row.pass)
              }
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
            {params.row.pass ? "Passed" : "Failed"}
          </>
        );
      },
    },
    {
      field: "file",
      headerName: " ",
      flex: 0.1,
      renderCell: (params: any) => {
        return (
          <>
            <a
              onClick={() => {
                // handleDownload(params.row.file)
              }}
              href={params.row.file}
              target="_blank"
            >
              <CloudDownloadIcon className="dark:text-white text-black" />
            </a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    let tempRows: any = [];
    taskResultData &&
      taskResultData.taskResults.forEach((result: any) => {
        tempRows.push({
          id: result._id,
          task: result?.courseId?.task || "",
          user: result?.userId?.name || "",
          course: result?.courseId?.name || "",
          pass: result?.pass || "",
          file: result?.location || "",
        });
      });

    setRows(tempRows);
  }, [taskResultData]);

  return (
    <>
      {isLoading || TaskStatusLoading || TaskLoading || taskResultLoading ? (
        <Loader />
      ) : (
        <div className="h-auto px-5">
          <div className="mt-[100px]">
            <Box>
              <div className="w-full flex justify-between">
                <div>
                  <h1 className={`${styles.title} !text-start`}>Task Result</h1>
                </div>

                <div
                  className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#264d80] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                  onClick={() => setOpen(!open)}
                >
                  Add New Task
                </div>
              </div>
            </Box>
          </div>

          <Box m="40px 0 20px 0" height="80vh">
            <DataGrid rows={rows} columns={columns} />
          </Box>

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                 Task Details 
                </h1>
                
                <p className="text-center">
                  Here you can add or modify tasks.
                </p>
                <div className="mt-[20px]">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={data?.courses ? data.courses : []}
                    getOptionLabel={(option: any) => option.name}
                    onChange={(event: any, newValue: any) => {
                      setExitingCourseTask(newValue ? newValue : "");
                      setNewOrUpdatedCourseTask(
                        newValue?.task ? newValue.task : ""
                      );
                    }}
                    size="small"
                    renderInput={(params) => (
                      <TextField {...params} label="Please Select Course" />
                    )}
                  />
                </div>
                <div>
                  <div className="mt-[20px] w-full">

                    <TextField
                      size="small"
                      label="Task Name"
                      fullWidth
                      multiline
                      maxRows={5}
                      value={
                        exitingCourseTask?.task ? exitingCourseTask.task : ""
                      }
                      onChange={(e: any) => {
                        setExitingCourseTask({
                          ...exitingCourseTask,
                          task: e.target.value,
                        });
                        setNewOrUpdatedCourseTask(e.target.value);
                      }}
                      placeholder="Enter a Task Name."
                    />

                  </div>
                  <div></div>
                </div>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <button
                    className={`${styles.button} px-4 py-2 my-4 bg-blue-600 text-white rounded !w-[120px]`}
                    onClick={handleTaskSubmit}
                  >
                    {" "}
                    Submit{" "}
                  </button>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#e04f4f]`}
                    onClick={() => {
                      setExitingCourseTask("")
                      setOpen(!open)
                    }}
                  >
                    Cancel
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default Task;
