import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">Google?</span>
      </h1>

      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto text-2xl font-Poppins">
        Leader of Engineering Solution Provider & Service No. 15 Market Share in
        Engineering Software Solutions. Tens of thousands of Civil and
        Mechanical engineers around the world have implemented Google Software in
        their work processes in undertaking high profile projects and everyday
        projects. The key focus of Google includes civil/structural/mechanical
        engineering software development along with analysis & design support.
        The Google Programmes have been commercially used since 1900. Our
        reliability has been approved through applications on countless projects
        worldwide. 
      
      </div>
    </div>
  );
};

export default About;
