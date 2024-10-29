"use client";
import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import Maintenance from "@/app/components/Maintance/Maintance";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useProgressDetailsByUserMutation } from "@/redux/features/courses/coursesApi";
import { useGetMaintenanceStatusQuery } from "@/redux/features/maintenance/maintenance";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  params: any;
};

const Page = ({ params }: Props) => {
  const id = params.id;
  const { isLoading, error, data, refetch } = useLoadUserQuery(undefined, {});
  const [
    progressDetailsByUser,
    {
      isLoading: progressDetailsLoading,
      isSuccess: progressDetailsSuccess,
      data: progressDetails,
    },
  ] = useProgressDetailsByUserMutation();

  useEffect(() => {
    if (data?.user && data?.user?._id) {
      // Trigger the API call when the page loads
      progressDetailsByUser({ userId: data.user._id, courseId:id });
    }
  }, [data?.user, progressDetailsByUser]);

  useEffect(() => {
    if (data) {
      // This is for Normal academy people

      // const isPurchased = data.user.courses.find(
      //   (item: any) => item._id === id
      // );
      // if (!isPurchased) {
      //   redirect("/");
      // }

      const courseDetails =
        progressDetails &&
        progressDetails.progress.find((item: any) => item?.course?._id === id);
      if (courseDetails?.locked) {
        redirect("/");
      }
    }
    if (error) {
      redirect("/");
    }
  }, [data && progressDetails, error]);

  const { data: statusData } = useGetMaintenanceStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const status = statusData && statusData.MaintenanceStatus[0]?.status;

  return (
    <>
      {status ? (
        <Maintenance />
      ) : (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              <CourseContent id={id} user={data?.user} progressDetails={progressDetails}/>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Page;
