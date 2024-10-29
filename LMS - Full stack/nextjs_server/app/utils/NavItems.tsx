import Link from "next/link";
import React from "react";
import UserAuth from "../hooks/userAuth";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
    type : "internal"
  },
  {
    name: "Courses",
    url: "/courses",
    type : "internal"
  },
  {
    name: "About",
    url: "/about",
    type : "internal"
  },
  // {
  //   name: "Policy",
  //   url: "/policy",
  //   type : "internal"
  // },
  {
    name: "Support",
    url: "",
    type : "external"
  },
  // {
  //   name: "FAQ",
  //   url: "/faq",
  //   type : "internal"
  // },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {

  const isAuthenticated = UserAuth();

  const navItems:any = isAuthenticated
  ? [...navItemsData, { name: "My Courses", url: "/my-course" }]
  : navItemsData;


  return (
    <>
      <div className="hidden 800px:flex">
        {navItems &&
          navItems.map((i:any, index:any) => (
            <Link href={`${i.url}`} key={index} passHref target={`${i.type  === "external"  ? "_blank" : "" }`}>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } text-[18px] px-6 font-Poppins font-[400]`}
              >
                {i.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
             <div className="w-full text-center py-6">
            <Link href={"/"} passHref>
              <span
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >ELearning</span>
            </Link>
          </div>
            {navItems &&
              navItems.map((i:any, index:any) => (
                <Link href="/" passHref key={index}>
                  <span
                    className={`${
                      activeItem === index
                        ? "dark:text-[#37a39a] text-[crimson]"
                        : "dark:text-white text-black"
                    } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                  >
                    {i.name}
                  </span>
                </Link>
              ))}
          </div>
      )}
    </>
  );
};

export default NavItems;
