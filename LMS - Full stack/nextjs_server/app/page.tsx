"use client";
import React, { FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import Maintenance from "./components/Maintance/Maintance";
import { useGetMaintenanceStatusQuery } from "@/redux/features/maintenance/maintenance";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  const { data } = useGetMaintenanceStatusQuery(undefined,{
    refetchOnMountOrArgChange: true,
  })
  const status = data && data.MaintenanceStatus[0]?.status

  return (
    <>
      {status ? (
        <Maintenance />
      ) : (
        <>
          <Heading
            title="ELearning"
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
          <Hero />
          <Courses 
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
          />
          <Reviews />
          {/* <CardApp/> */}
          {/* <FAQ /> */}
          <Footer />
        </>
      )}
    </>
  );
};

export default Page;

// import { motion, Variants } from "framer-motion";
// import Image from "next/image";

// interface Props {
//   emoji: string;
//   hueA: number;
//   hueB: number;
// }

// const cardVariants: Variants = {
//   offscreen: {
//     y: 300
//   },
//   onscreen: {
//     y: 50,
//     rotate: -10,
//     transition: {
//       type: "spring",
//       bounce: 0.4,
//       duration: 1
//     }
//   }
// };

// const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

// function Card({ emoji, hueA, hueB }: Props) {
//   const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

//   return (
//     <motion.div
//       className="card-container mb-[0px]"
//       initial="offscreen"
//       whileInView="onscreen"
//       viewport={{ once: true, amount: 0.8 }}
//     >
//       <div className="splash" style={{ background }} />
//       <motion.div className="card" variants={cardVariants}>
//         <Image src={emoji} alt="" width="600" height="600" />
//       </motion.div>
//     </motion.div>
//   );
// }



// export function CardApp() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-[150px]">
//       {food.map(([emoji, hueA, hueB]:any) => (
//         <Card emoji={emoji} hueA={hueA} hueB={hueB} key={emoji} />
//       ))}
//     </div>
//   );
// }
