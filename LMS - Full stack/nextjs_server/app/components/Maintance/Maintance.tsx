'use client'
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

const Maintenance = () => {
  return (
    <>
        <Box
          sx={{
            position: "fixed",
            top: "0vh",
            left: "0vw",
            height: "100%",
            width: "100%",
            zIndex: 10000,
            backgroundColor: "#ffff",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              mx: "auto",
              display: "flex",
              justifyContent: "center",
              pb: 1,
            }}
          >
            <CircularProgress />
          </Box>
          <Box className="text-center" >
            <div className="text-3xl font-Poppins dark:text-black">
              The LMS academy will live soon.
            </div>
            <p className="text-xl font-Poppins dark:text-black"> Refresh the page after sometime. </p>
          </Box>
        </Box>
    </>
  );
};

export default Maintenance;
