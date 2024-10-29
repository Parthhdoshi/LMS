"use client";
import { useGetAllUsersResultsQuery, useGetCertificateMutation } from "@/redux/features/courses/coursesApi";
import { Box, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { CloudDownloadIcon } from "../sidebar/Icon";
import axios from "axios";
import { skip } from "node:test";
import toast from "react-hot-toast";

const CertificateMain = () => {

  const { data, isLoading, refetch } = useGetAllUsersResultsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [getCertificate, {  isSuccess :certificateSuccess, error }] = useGetCertificateMutation();

  const [rows, setRows] = useState<any>([]);

  const handleDownload = async (data: any) => {

    toast.promise(getCertificate({ courseName : data.course,  userName : data.user, userEmail: encodeURIComponent(data.email) }), {
      loading: `Sending Email to ${data.email}!`,
      success: `Email has been sent to ${data.email}!`,
      error: 'Error',
    });
  };

  let columns: any = [
    { field: "id", headerName: "ID", flex: 0.1 },
    { field: "user", headerName: "User", flex: 0.3 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "course", headerName: "Course", flex: 0.5 },
    { field: "percentage", headerName: "Percentage", flex: 0.3 },
    {
      field: "pass",
      headerName: "Status",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            {/* <Switch
              checked={params.row.pass}
              onChange={() =>
                handleTaskStatusChange(params.row.id, params.row.pass)
              }
              inputProps={{ "aria-label": "controlled" }}
            />{" "} */}
            {params.row.pass ? "Passed" : "Failed"}
          </>
        );
      },
    },
    {
      field: "file",
      headerName: "File",
      flex: 0.1,
      renderCell: (params: any) => {
        return (
          <>
            <a
              onClick={() => {
                handleDownload(params.row)
              }}
             
            >
              {params.row.pass ? <CloudDownloadIcon className="dark:text-white text-black cursor-pointer" /> : <></> }
            </a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    let tempRows: any = [];
    data &&
      data?.quizResults?.forEach((result: any) => {
        tempRows.push({
          id: result._id || "asd",
          user: result?.user?.name || "",
          email: result?.user?.email || "",
          course: result?.course?.name || 0,
            percentage: (((result.score / result.totalQuestions) * 100).toFixed(2) + " %") || "0",
            pass: result?.isPassed || "",
            file: result?.location || "",
        });
      });

    setRows(tempRows);
  }, [data]);
 
  return (
    <div className="mt-16">
      <div className="h-screen px-5 ">
        <Typography variant="h4" gutterBottom>
          {" "}
          Generate Certificate{" "}
        </Typography>

        <Box m="40px 0 20px 0" height="80vh">
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </div>
    </div>
  );
};

export default CertificateMain;
