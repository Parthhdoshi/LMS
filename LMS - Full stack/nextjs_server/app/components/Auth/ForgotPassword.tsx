"use client";
import { styles } from "@/app/styles/style";
import React, { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Skeleton } from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ENDPOINT } from "@/utils/endpoint";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
});

const ForgotPassword: FC<Props> = ({ setRoute }) => {
  const mutation: any = useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return axios.post(
        `auth/forgot-password`,
        { email }
      );
    },
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async ({ email }) => {
      toast.promise(mutation.mutateAsync({ email }), {
        loading: `Sending Email to ${email}!`,
        success: `Email has been sent to ${email}!`,
        error: (err) => {
          // Extract the error message from the backend response
          return `Error: ${err.response?.data?.message || err.message || "Something went wrong!, Please try again later"}`;
        },
      });
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div>
      <h1 className={`${styles.title}`}>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
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
            placeholder="login@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>

        <div className="mt-3">
          {mutation.isLoading ? (
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          ) : null}
          {mutation.isPending ? (
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          ): null}

        </div>

        <div>
          <div className="w-full mt-5">
            <input
              type="submit"
              value="Reset Password"
              className={`${styles.button}`}
            />
          </div>
        </div>
      </form>
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to sign in?{" "}
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default ForgotPassword;
