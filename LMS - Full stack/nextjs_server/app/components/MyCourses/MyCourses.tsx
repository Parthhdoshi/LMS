import React from "react";
import Tabs from "../Profile/Tabs";
const MyCourses = ({ user }: any) => {
  return (
    <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[40px]">
      <p className="text-center font-Poppins text-4xl dark:text-white text-black "> My Courses </p>
      <Tabs user={user} />
    </div>
  );
};

export default MyCourses;
