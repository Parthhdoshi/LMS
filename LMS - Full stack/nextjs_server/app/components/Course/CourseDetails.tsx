'use client'
import { styles } from "@/app/styles/style";
// import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useApplyCouponMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import axios from "axios";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { useRouter } from "next/navigation";

type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setRoute: any;
  setOpen: any;
};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const router = useRouter()
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [applyCoupon, { isSuccess, error }] = useApplyCouponMutation();
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  // Function to handle input change
  const handleInputChange = (e: any) => {
    setCoupon(e.target.value);
  };

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const dicountPercentenge =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = async () => {
    if (user) {
      try {
        const response: any = await axios.post("http://localhost:8000/order", {
          amount: data.price,
        });

        initPayment(response.data.data);
      } catch (error) {
        toast.error("Payment Error");
      }
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  const handleEnrollNow = async () => {
    if (user) {
      router.push("/my-course")
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  const initPayment = (data: any) => {
    const options = {
      key: "rzp_test_sj6D6eDZbZkJ5e",
      amount: data.amount,
      currency: data.currency,
      name: "course",
      order_id: data.id,
      handler: async (response: any) => {
        try {
          const verifyResponse = axios.post(
            "http://localhost:8000/verify",
            response
          );

        } catch (error) {}
      },
      prefill: {
        email: "abc@gmail.com",
        contact: "9876543210",
      },
      modal: {
        escape: false, // Prevent closing the modal using the escape key
        backdropclose: true, // Allow closing the modal by clicking on the backdrop
        handleback: false, // Prevent closing the modal using the back button
        ondismiss: () => {
          // Custom action when the modal is dismissed
        },
      },
    };
    // @ts-ignore
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("You successfully enroll this course!");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const verifyCouponCode = async () => {
    const couponData = {
      courseId: data._id,
      couponCode: coupon,
    };
    await applyCoupon(couponData);
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                {/* <Ratings rating={data.ratings} /> */}
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              {/* <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5> */}
            </div>

            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            {/* course description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                {/* <Ratings rating={data?.ratings} /> */}
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            item.user.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="hidden 800px:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                          {/* <Ratings rating={item.rating} /> */}
                        </div>
                        <p className="text-black dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)} •
                        </small>
                      </div>
                      <div className="pl-2 flex 800px:hidden items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        {/* <Ratings rating={item.rating} /> */}
                      </div>
                    </div>
                    {item.commentReplies.map((i: any, index: number) => (
                      <div className="w-full flex 800px:ml-16 my-5" key={index}>
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-[#ffffff83]">
                            {format(i.createdAt)} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                {/* <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Free" : data.price + "₹"}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data.estimatedPrice}₹
                </h5> 

                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentengePrice}% Off
                </h4>
                  */}
              </div>

              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Enter to Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleEnrollNow}
                  >
                    {/*
                     Only for Internship, Direct Login button shows.
                      for Others need to show price and apply coupon input box
                    */}
                    Enroll Now
                    {/* Buy Now {data.price}₹ */}
                  </div>
                )}
              </div>

              {/* To hide this Apply coupon input bar and button  */}
              {!true ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    name="coupon"
                    id=""
                    placeholder="Discount code..."
                    className={`${styles.input} 1500px:!w-[50%] 1100px:w-[60%] ml-3 !mt-0`}
                    value={coupon}
                    onChange={handleInputChange}
                  />
                  <div
                    className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}
                    onClick={verifyCouponCode}
                  >
                    Apply
                  </div>
                </div>
              ) : (
                <></>
              )}
              <br />
              {/* <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Full lifetime access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate of completion
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                • Premium Support
              </p> */}
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {/* {stripePromise && clientSecret && ( */}
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm
                      setOpen={setOpen}
                      data={data}
                      user={user}
                      refetch={refetch}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
