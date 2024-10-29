"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { Box, CircularProgress, LinearProgress } from "@mui/material";

type Props = {
  setRoute: (route: string) => void;
};

const phoneRegExp =
  /^((\\+[5-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  phone: Yup.string()
    .required("Please enter your Phone!")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone No must be 10 number")
    .max(10, "Phone No must be only 10 number"),
  institute: Yup.string().required("Please enter your institute name!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess, isLoading }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      institute: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password, phone, institute }) => {
      const data = {
        name,
        email,
        password,
        phone,
        institute,
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join to LMS</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your Name
          </label>
          <input
            type="text"
            name=""
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="johndoe"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your Email
          </label>
          <input
            type="email"
            name=""
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="phone">
            Enter your Phone No
          </label>
          <input
            type="phone"
            name=""
            value={values.phone}
            onChange={handleChange}
            id="phone"
            placeholder="9876543210"
            className={`${errors.phone && touched.phone && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.phone && touched.phone && (
            <span className="text-red-500 pt-2 block">{errors.phone}</span>
          )}
        </div>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your institute name
          </label>
          <input
            type="text"
            name=""
            value={values.institute}
            onChange={handleChange}
            id="institute"
            placeholder="IIIT"
            className={`${
              errors.institute && touched.institute && "border-red-500"
            } ${styles.input}`}
          />
          {errors.institute && touched.institute && (
            <span className="text-red-500 pt-2 block">{errors.institute}</span>
          )}
        </div>
        <div className="w-full mt-3 relative mb-1">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
        { isLoading ? <div className="flex items-center justify-center"> <CircularProgress   /> </div> : 
          <input
            type="submit"
            value="Sign Up"
            className={`${styles.button} ${isLoading ? "bg-slate-500" : ""}`}
            disabled={isLoading}
          /> } 
            
        </div>
        <br />

        {/* <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5> */}
        {/* <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div> */}

        <h5 className="text-center font-Poppins text-[14px] dark:text-white text-black">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Signup;
