"use client";
import UserAuth from "@/app/hooks/userAuth";
import { styles } from "@/app/styles/style";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { motion, useAnimation, useSpring } from 'framer-motion';
import { useScroll } from 'framer-motion';
import { ENDPOINT } from "@/utils/endpoint";

function WelcomeScreen({ setOpen, route, open, setRoute, user }: any) {
  const { data: userData, refetch: refetchUser } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <div className="pt-5 text-6xl text-black dark:text-white font-Poppins font-[500]">
          <span className="text-gradient" onClick={refetchUser}>
            Hello, {user.name}{" "}
          </span>
        </div>
      </motion.div>
      <div className="mb-10">
        <EduSkill
          user={userData && userData.user}
          route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen}
          refetchUser={() => refetchUser()}
        />
      </div>
    </div>
  );
}

export default WelcomeScreen;

export const EduSkill = ({
  user,
  route,
  setRoute,
  open,
  setOpen,
  refetchUser,
}: any) => {
  const router = useRouter();
  const isAuthenticated = UserAuth();

  const mutation: any = useMutation({
    mutationFn: ({ tag }: { tag: string }) => {
      return axios.post(
        `enroll?tag=${tag}`,
        {},
        { withCredentials: true }
      );
    },
  });

  const handleEnrollment = async (tag: string) => {
    await mutation.mutate({ tag });
    router.push("/my-course");
    // refetchUser();
  };

  const handleRoute = () => {
    setOpen(true);
    setRoute("Login");
  };

  const geoTech = "geoTech";
  const bridge = "bridge";

  return (
    <>
      <div className="EduSkillBanner mt-10 dark:border-[#ffffff1d] border-[#00000015] border-2 rounded-lg p-5">
        <div className="w-full max-w-full pb-12 ">
          <Image
           src={""}
            alt="Edu Skill Banner"
            width={100000}
            height={100000}
            className="w-full h-auto object-cover" // Make image responsive
          />
        </div>
        <section className="container mx-auto p-6">
  <div className="gap-6 800px:flex">
    {/* Column 1 */}
    <div className="flex-1 flex items-stretch pb-5 800px:pb-0 ">
      <motion.div whileHover={{ scale: 1.1 }} className="w-full">
        <div className="h-full dark:bg-gray-700 bg-white-100 text-center w-full p-6 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg shadow-sm dark:shadow-inner flex flex-col">
          <p className="dark:text-white text-black font-Poppins text-3xl pb-3 font-[500]">
            Analysis &amp; Design of <span className="text-gradient">Bridge</span>
          </p>
          <br/>
          <br/>
          <p className="font-Poppins text-base dark:text-white text-black flex-grow">
            Civil Engineering From culverts to the world's longest suspension bridge, LMS Bridge is the foremost engineering technology driving global infrastructure development.
          </p>
          <div className="mt-8 text-center">
            {isAuthenticated ? (
              <>
                {user && user.enrolledTags?.includes(bridge) ? (
                  <input
                    type="button"
                    value="View Course"
                    className={`${styles.button}`}
                    onClick={() => router.push("/my-course")}
                  />
                ) : (
                  <input
                    type="button"
                    value="Enroll Now"
                    className={`${styles.button}`}
                    onClick={() => router.push("/my-course")}
                  />
                )}
              </>
            ) : (
              <input
                type="button"
                value="Login"
                className={`${styles.button}`}
                onClick={handleRoute}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>

    {/* Column 2 */}
    <div className="flex-1 flex items-stretch">
      <motion.div whileHover={{ scale: 1.1 }} className="w-full">
        <div className="h-full dark:bg-gray-700 bg-white-100 text-center w-full p-6 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg shadow-sm dark:shadow-inner flex flex-col">
          <p className="dark:text-white text-black font-Poppins text-3xl pb-3 font-[500]">
            Simulation of <span className="text-gradient">Geo Technical</span> Analysis
          </p>
          <p className="font-Poppins text-base dark:text-white text-black flex-grow">
            Geotechnical Engineering From shoring design to dynamic analysis, LMS Geo technical software covers all simulations occurring in the ground, including tunnel, slope stability, infiltration, retaining wall, foundation, rock, and soft ground.
          </p>
          <div className="mt-8 text-center">
            {isAuthenticated ? (
              <>
                {user && user.enrolledTags?.includes(geoTech) ? (
                  <input
                    type="button"
                    value="View Course"
                    className={`${styles.button}`}
                    onClick={() => router.push("/my-course")}
                  />
                ) : (
                  <input
                    type="button"
                    value="Enroll Now"
                    className={`${styles.button}`}
                    onClick={() => router.push("/my-course")}
                  />
                )}
              </>
            ) : (
              <input
                type="button"
                value="Login"
                className={`${styles.button}`}
                onClick={handleRoute}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>


      </div>
    </>
  );
};

export const ScrollingText = () => {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [shift, setShift] = useState(0);

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress)

  useEffect(() => {
      return scrollY.onChange((latest) => {
          if (latest > prevScrollY) {
              // Scrolling down
              setShift((prev) => prev - 100); // Adjust the shift value as needed
          } else if (latest < prevScrollY) {
              // Scrolling up
              setShift((prev) => prev + 100); // Adjust the shift value as needed
          }
          setPrevScrollY(latest);
      });
  }, [scrollY, prevScrollY]);

  useEffect(() => {
      controls.start({ x: (shift/100), transition: { duration: 0.5 } });
  }, [shift, controls]);

  return (
      <div className="overflow-hidden whitespace-nowrap">
        <motion.div style={{ scaleX }} />
          <motion.div
              className="inline-block text-xl font-bold"
              animate={controls}
              style={{ scaleX }}
          >
              This is the scrolling text!
          </motion.div>
      </div>
  );

}