"use client";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import WelcomeScreen from "../components/Welcome/WelcomeScreen";
import { useSelector } from "react-redux";
import Protected from "../hooks/useProtected";
import UserAuth from "../hooks/userAuth";

const page = () => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state: any) => state.auth);

  return (
    <div>
      <Protected>
        <Header
          route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen}
          activeItem={6}
        />
        <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
          <Heading
            title={"All courses - Elearning"}
            description={"Elearning is a programming community."}
            keywords={
              "programming community, coding skills, expert insights, collaboration, growth"
            }
          />

          <WelcomeScreen 
          user={user} route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen} />
        </div>
        <Footer />
      </Protected>
    </div>
  );
};

export default page;
