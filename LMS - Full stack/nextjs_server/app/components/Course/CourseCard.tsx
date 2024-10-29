import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { LockIcon } from "../Admin/sidebar/Icon";
import { useTheme } from "next-themes";

type Props = {
  item: any;
  isProfile?: boolean;
  progress?: any;
  user?: any;
};

const CourseCard: FC<Props> = ({ item, isProfile, progress, user }) => {
  const { theme } = useTheme();
  const fillColor = theme === "dark" ? "#fff" : "#000";

  return (
    <div
      className={` border dark:border-[#ffffff1d] border-[#00000015]  rounded-lg ${
        progress?.locked ? "dark:bg-gray-700 bg-gray-400 cursor-not-allowed rounded-lg" : null
      }`}
    >
      <Link
        href={
          !progress?.locked
            ? !isProfile
              ? `/course/${item._id}`
              : `course-access/${item._id}
            `
            : ""
        }
        style={{
          pointerEvents: progress?.locked ? "none" : "auto",
        }}
      >
        <div className="w-full min-h-[35vh] dark:bg-opacity-20 backdrop-blur  dark:shadow-[bg-slate-700] rounded-lg p-3  dark:shadow-inner">
          <Image
            src={item.thumbnail?.url}
            width={500}
            height={300}
            objectFit="contain"
            className="rounded w-full"
            alt=""
          />
          <br />
          <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff]">
            {progress?.locked ? <LockIcon /> : ""} {item.name}
          </h1>
          
              <div className="w-full flex items-center justify-between pt-2">
                {/* <Ratings rating={item.ratings} /> */}
                {/* <h5
                  className={`text-black dark:text-[#fff] ${
                    isProfile && "hidden 800px:inline"
                  }`}
                >
                  {item.purchased} Students
                </h5> */}
              </div>
          
          <div className="w-full flex items-center justify-between pt-3">
            {/* {item.price && (
              <div className="flex">
                <h3 className="text-black dark:text-[#fff]">
                  {item.price === 0 ? "Free" : "Rs. " + item.price}
                </h3>
              </div>
            )} */}
            {item.courseData && (
              <div className="flex items-center pb-3">
                <AiOutlineUnorderedList size={20} fill={fillColor} />
                <h5 className="pl-2 text-black dark:text-[#fff]">
                  {item.courseData?.length} Lectures
                </h5>
              </div>
            )}
          </div>
          <div className="text-black dark:text-[#fff]">
            {user &&
              progress &&
              "Completed : " + progress?.progressPercentage.toFixed(0) + "%"}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
