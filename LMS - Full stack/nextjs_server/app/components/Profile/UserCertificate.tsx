"use client";
import { Button, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { IoIosCloudDownload } from "react-icons/io";
import { ENDPOINT } from "@/utils/endpoint";

const UserCertificate = ({ user }: any) => {

  const [activeTab, setActiveTab] = useState("bridge");

  const mutation: any = useMutation({
    mutationFn: ({ tag }: { tag: string }) => {
      return axios.get(
        `checkUserCourseCompletion?userId=${user._id}&tag=${tag}`
      );
    },
  });

  const handleClick = (tag: string) => {
    mutation.mutate({ tag });
  };

  const handleGenerateCertificate = async (tag:string) => {
    
    axios({
        url: `get-certificate?courseName=${activeTab}&userName=${user.name}&userEmail=${user.email}`,
        method: "GET",
        responseType: "blob" // important
    }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link:any = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `certificate.pdf`
        );
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
    });

  };
  
  useEffect(() => {
    mutation.reset();
    handleClick(activeTab);
  }, [activeTab]);

  return (
    <>
      {/* <Tabs user={user} /> */}
      <div className="mt-2 font-Poppins text-4xl dark:text-white text-black">
        Get Certificate
      </div>

      <div className="border-b border-gray-300 dark:border-gray-700 mb-2">
        <ul className="flex flex-wrap -mb-px text-lg font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              className={`inline-flex items-center justify-center p-4 border-b-2 ${
                activeTab === "bridge"
                  ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } rounded-t-lg group transition duration-300 ease-in-out`}
              onClick={() => setActiveTab("bridge")}
            >
              <svg
                className={`w-4 h-4 me-2 ${
                  activeTab === "bridge"
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                } transition duration-300 ease-in-out`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              Bridge
            </button>
          </li>

          <li className="me-2">
            <button
              className={`inline-flex items-center justify-center p-4 border-b-2 ${
                activeTab === "geoTech"
                  ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } rounded-t-lg group transition duration-300 ease-in-out`}
              onClick={() => setActiveTab("geoTech")}
            >
              <svg
                className={`w-4 h-4 me-2 ${
                  activeTab === "geoTech"
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                } transition duration-300 ease-in-out`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 18"
              >
                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
              </svg>
              Geo Tech
            </button>
          </li>
        </ul>
      </div>

      <div className="mt-3">
        {mutation.isLoading ? (
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        ) : null}
        {mutation.isPending ? (
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        ) : mutation.isError ? (
          <>
            <div className="text-xl dark:text-white text-black">
              {" "}
              {mutation.error.response.data.message}
            </div>
          </>
        ) : null}
        {mutation.isSuccess ? (
          <div className="text-xl dark:text-white text-black">You Can Download a Certificate!</div>
        ) : null}
      </div>

      {activeTab === "bridge" && (
        <>
          {mutation.isSuccess ? (
            <Button
              variant="contained"
              startIcon={<IoIosCloudDownload />}
              onClick={() => handleGenerateCertificate("bridge")}
              sx={{
                mt: 1,
              }}
            >
              Download Bridge Certificate
            </Button>
          ) : null}
        </>
      )}
      {activeTab === "geoTech" && (
        <>
          {mutation.isSuccess ? (
            <Button
              variant="contained"
              startIcon={<IoIosCloudDownload />}
              onClick={() => handleGenerateCertificate("geoTech")}
              sx={{
                mt: 1,
              }}
            >
              {" "}
              Download Geo Tech Certificate{" "}
            </Button>
          ) : null}
        </>
      )}
    </>
  );
};

export default UserCertificate;
