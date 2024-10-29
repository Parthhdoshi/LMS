"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import UserAuth from "@/app/hooks/userAuth";
import { EduSkill } from "../Welcome/WelcomeScreen";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
};

const Courses = ({ setRoute, route, setOpen, open }: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);
  const { user } = useSelector((state: any) => state.auth);

  // console.log(route);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  const handleRoute = () => {
    setOpen(true);
    setRoute("Login");
  };

  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        <EduSkill
          user={user}
          route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen}
        />

        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          {/* Expand Your Career <span className="text-gradient">Opportunity</span>{" "} */}
          <br />
          {/* Opportunity With  */}
          Our Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {courses &&
            courses.map((item: any, index: number) => (
              <motion.div whileHover={{ scale: 1.1 }}>
                <CourseCard item={item} key={index} />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
