"use client";
import React, { useEffect, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ/FAQ";
import MyCourses from "../components/MyCourses/MyCourses";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import Protected from "../hooks/useProtected";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");

  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      <Protected>
        <Heading
          title="My Course - Elearning"
          description="Elearning is a learning management system for helping programmers."
          keywords="programming,mern"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <br />
        <MyCourses user={user} />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
