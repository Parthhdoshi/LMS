import ResetPassword from "@/app/components/Auth/ResetPassword";
import { Box } from "@mui/material";
import React from "react";

const page = ({ params }: any) => {
  return (
    <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[95%] m-auto  800px:w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow-xl p-6 outline-none">
      <ResetPassword tokenAndExpiry={params.token} />
    </Box>
  );
};

export default page;
