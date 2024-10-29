"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import UserCertificate from "./UserCertificate";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import {
  useGetUsersAllCoursesQuery,
  useProgressDetailsByUserMutation,
} from "@/redux/features/courses/coursesApi";

type Props = {
  user: any;
  activeItem : number
};

const Profile: FC<Props> = ({ activeItem, user }) => {

  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);

  const [activeTab, setActiveTab] = useState('profile');

  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

  const [progressDetailsByUser, { isLoading: createQuizLoading, isSuccess:createQuizSuccess, data : progressDetails }] = useProgressDetailsByUserMutation();

  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const [active, setActive] = useState(1);

  function clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // console.log("All cookies cleared!");
  }

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
    // await clearAllCookies()
    // window.location.href="/"
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
    }
  }, [data]);

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff2c] border-[#00000014] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}

      {active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
          {/* <Tabs/> */}
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard
                  item={item}
                  isProfile={true}
                  progress={progressDetails && progressDetails?.progress[index]}
                  key={progressDetails && progressDetails?.progress[index]?._id}
                  user={user}
                />
              ))}
          </div>
          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
              You don&apos;t have any purchased courses!
            </h1>
          )}
        </div>
      )}
      {active === 5 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
          <UserCertificate user={user}/>
        </div>
      )}
    </div>
  );
};

export default Profile;
