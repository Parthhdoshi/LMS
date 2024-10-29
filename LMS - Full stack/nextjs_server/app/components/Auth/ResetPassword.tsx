"use client";
import { styles } from "@/app/styles/style";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ENDPOINT } from "@/utils/endpoint";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

type Props = {
  setRoute?: (route: string) => void;
  tokenAndExpiry: string;
};

const schema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
  // .matches(
  //   /[!@#$%^&*(),.?":{}|<>]/,
  //   "Password must contain at least one special character"
  // )
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const ResetPassword: FC<Props> = ({ setRoute, tokenAndExpiry }) => {
  const router = useRouter();

  // The token contains token and expiry and both are concatenate with "&" but its converted to "%"
  const [token, expiry] = tokenAndExpiry.split("%26");
  const [isExpired, setIsExpired] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Date.now() > Number(expiry)) {
      setIsExpired(true);
    }
  }, [expiry]);

  const mutation: any = useMutation({
    mutationFn: ({ password }: { password: string }) => {
      return axios.post(`auth/reset-password/${token}`, { password });
    },
    onSettled: () => {
      toast("You will redirect to Home Page", { duration: 5000 });
      window.setTimeout(() => router.push("/"), 3000);
    },
  });

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async ({ password }) => {
      toast.promise(mutation.mutateAsync({ password, token }), {
        loading: `Please wait!`,
        success: `Password Has been change Successfully!`,
        error: (err) => {
          // Extract the error message from the backend response
          return `Error: ${
            err.response?.data?.message ||
            err.message ||
            "Something went wrong!, Please try again later"
          }`;
        },
      });
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div>
      <h1 className={`${styles.title}`}>Reset Password</h1>
      {isExpired ? (
        <div className=" text-center">
          <p className="dark:text-white text-black text-2xl ">
            {" "}
            Token has been expired{" "}
          </p>

          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Go back
          </span>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="w-full mt-1 relative mb-3">
              <label className={`${styles.label}`} htmlFor="password">
                Enter your New Password
              </label>
              <input
                type={!show ? "password" : "text"}
                name=""
                value={values.password}
                onChange={handleChange}
                id="password"
                placeholder="Password"
                className={`${
                  errors.password && touched.password && "border-red-500"
                } ${styles.input}`}
              />
              {errors.password && touched.password && (
                <span className="text-red-500 pt-2 block">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="w-full mt-1 relative">
              <label className={`${styles.label}`} htmlFor="email">
                Confirm New Password
              </label>
              <input
                type={!show ? "password" : "text"}
                name=""
                value={values.confirmPassword}
                onChange={handleChange}
                id="confirmPassword"
                placeholder="Confirm Password"
                className={`${
                  errors.confirmPassword &&
                  touched.confirmPassword &&
                  "border-red-500"
                } ${styles.input}`}
              />
              {!show ? (
                <AiOutlineEyeInvisible
                  className="absolute top-11 left-[92%] z-1 cursor-pointer fill-black dark:fill-white "
                  size={20}
                  onClick={() => setShow(true)}
                />
              ) : (
                <AiOutlineEye
                  className="absolute top-11 left-[92%] z-1 cursor-pointer fill-black dark:fill-white"
                  size={20}
                  onClick={() => setShow(false)}
                />
              )}
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="text-red-500 pt-2 block">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Password Must Contain </p>
              <li>
                8 Characters 
              </li>
              <li>
                1 Lowercase letter
              </li>
              <li>
                1 Uppercase letter
              </li>
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
                  {/* <p>You will redirect to home page </p>
                  <p>  or  </p> */}
            Go back to
            <span
              className="text-[#2190ff] pl-1 cursor-pointer"
              onClick={() => router.push("/")}
            >
              Home
            </span>
          </h5>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
