"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

type Props = {};

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, _] = useState(6);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen">
      <Protected>
        <Heading
          title={`${user?.name} profile - Elearning`}
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Civil, Bridge, Geo Tech, Internship"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} activeItem={activeItem} />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
