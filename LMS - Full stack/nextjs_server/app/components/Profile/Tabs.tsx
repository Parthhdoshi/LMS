"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import UserAuth from "@/app/hooks/userAuth";
import { styles } from "@/app/styles/style";
import {
  useCourseEnrollByTagMutation,
  useProgressDetailsByUserMutation,
} from "@/redux/features/courses/coursesApi";
import { Button } from "@mui/material";
// import { changeStatus, getUsers } from "@/app/actions/maintanance";

const Tabs = ({ user }: any) => {
  const [activeTab, setActiveTab] = useState("bridge");

  const [
    progressDetailsByUser,
    {
      isLoading: progressDetailsLoading,
      isSuccess: progressDetailsSuccess,
      data: progressDetails,
    },
  ] = useProgressDetailsByUserMutation();
  const [
    courseEnrollByTag,
    { isLoading: enrollLoading, isSuccess: enrollSuccess, data: enrollDetails },
  ] = useCourseEnrollByTagMutation();
  const isAuthenticated = UserAuth();

  useEffect(() => {
    if (user && user._id) {
      // Trigger the API call when the page loads
      progressDetailsByUser({ userId: user._id, tag: activeTab });
    }
  }, [user, progressDetailsByUser, activeTab]);

  const handleEnrollment = async (courseType: string) => {
    // const data = await changeStatus(true)
    // // const data = await getUsers()
    // console.log(data)
    await courseEnrollByTag({ tag: courseType });
    await progressDetailsByUser({ userId: user._id, tag: courseType });
  };

  let filteredProgress: any = [];
  if (progressDetails) {
    filteredProgress = progressDetails.progress.filter(
      (progress: any) => progress?.course?.tags === activeTab
    );
  }

  return (
    <div>
      {/* Tab Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
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

      {/* Tab Content with Animation */}
      <div className="mt-4 transition-all duration-500 ease-in-out transform">
        {activeTab === "bridge" && (
          <>
            {enrollLoading || progressDetailsLoading ? (
              <div className="text-black dark:text-white text-2xl">
                Please Wait...
              </div>
            ) : (
              <div className="opacity-0 animate-fadeIn opacity-100 transition-opacity duration-500">
                {progressDetails &&
                  (filteredProgress.length === 0 ? (
                    <div className="space-y-4 w-5/5 pb-12">
                      <div className="dark:bg-gray-700 bg-white-100 text-center w-full p-6 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg shadow-sm dark:shadow-inner">
                        <p className="dark:text-white text-black font-Poppins text-3xl pb-3 font-[500]">
                          Analysis &amp; Design of{" "}
                          <span className="text-gradient">Bridge</span>
                        </p>
                        <p className="font-Poppins text-base dark:text-white text-black ">
                          Civil Engineering From culverts to the world's longest
                          suspension bridge, LMS Bridge is the foremost
                          engineering technology driving global infrastructure
                          development.
                        </p>
                        <div className="mt-8 text-center">
                          {isAuthenticated && (
                            <input
                              type="button"
                              value="Enroll Now"
                              className={`${styles.button}`}
                              onClick={() => handleEnrollment("bridge")}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                      {filteredProgress.map((item: any, index: number) => (
                        <CourseCard
                          item={item.course}
                          isProfile={true}
                          progress={filteredProgress[index]}
                          key={filteredProgress[index]?._id}
                          user={user}
                        />
                      ))}
                    </div>
                  ))}
                {/* Immediately Invoked Function Expression (IIFE) */}
              </div>
            )}
          </>
        )}
        {activeTab === "geoTech" && (
          <>
            {enrollLoading || progressDetailsLoading ? (
              <div className="text-black dark:text-white text-2xl">
                Please Wait...
              </div>
            ) : (
              <div className="opacity-0 animate-fadeIn opacity-100 transition-opacity duration-500">
                {/* Immediately Invoked Function Expression (IIFE) */}

                {progressDetails &&
                  (filteredProgress.length === 0 ? (
                    <div className="space-y-4 w-5/5 pb-12">
                      <div className="dark:bg-gray-700 bg-white-100 text-center w-full p-6 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg shadow-sm dark:shadow-inner">
                      <p className="dark:text-white text-black font-Poppins text-3xl pb-3 font-[500]">
                    Simulation of{" "}
                    <span className="text-gradient">Geo Technical</span>{" "}
                    Analysis
                  </p>
                  <p className="font-Poppins text-base dark:text-white text-black">
                    Geotechnical Engineering From shoring design to dynamic
                    analysis, LMS Geo technical software covers all
                    simulations occurring in the ground, including tunnel, slope
                    stability, infiltration, retaining wall, foundation, rock,
                    and soft ground.
                  </p>
                        <div className="mt-8 text-center">
                          {isAuthenticated && (
                            <input
                              type="button"
                              value="Enroll Now"
                              className={`${styles.button}`}
                              onClick={() => handleEnrollment("geoTech")}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                      {filteredProgress.map((item: any, index: number) => (
                        <CourseCard
                          item={item.course}
                          isProfile={true}
                          progress={filteredProgress[index]}
                          key={filteredProgress[index]?._id}
                          user={user}
                        />
                      ))}
                    </div>
                  ))}
                {/* Immediately Invoked Function Expression (IIFE) */}
              </div>
            )}
          </>
        )}
        {progressDetails && progressDetails.progress === 0 && (
          <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
            You don&apos;t have any purchased courses!
          </h1>
        )}
      </div>
    </div>
  );
};

export default Tabs;
