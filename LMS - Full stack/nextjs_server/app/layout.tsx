"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import React, { FC, useEffect } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";
import { ENDPOINT } from "@/utils/endpoint";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "next-themes";
import CursorFollower from "./utils/CursorFollower";
import axios from "axios";
import { useGetMaintenanceStatusQuery } from "@/redux/features/maintenance/maintenance";
import WhatsAppHelpDesk from "./utils/WhatsAppHelpDesk";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const baseURL = ENDPOINT;
  const version = "api/v1/";

  // set base url only one time
  axios.defaults.baseURL = `${baseURL}${version}`;
  // send cookie ( token ) automatically
  axios.defaults.withCredentials = true;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <Providers>
          <NextTopLoader 
            showSpinner={false} 
          />
          <QueryClientProvider client={queryClient}>
            <SessionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <CssBaseline />
                <Custom>
                  <>{children}</>
                </Custom>
                <Toaster position="top-center" reverseOrder={false} />
              </ThemeProvider>
            </SessionProvider>
          </QueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  const { theme, setTheme } = useTheme();

  const MuiTheme = createTheme({
    palette: {
      mode: theme === "light" ? "light" : "dark",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            fontWeight: 600,
            textTransform: "none",
            // color:rgb(32 136 242)
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: theme === "light" ? "Black" : "white",
          },
        },
      },
    },
  });

  useEffect(() => {
    // socketId.on("connection", () => {
    //   console.log('connected!');
    // });
  }, []);

  return (
    <>
      <MuiThemeProvider theme={MuiTheme}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* <CursorFollower/> */}
            {children}
            <WhatsAppHelpDesk />
          </>
        )}
      </MuiThemeProvider>
    </>
  );
};
