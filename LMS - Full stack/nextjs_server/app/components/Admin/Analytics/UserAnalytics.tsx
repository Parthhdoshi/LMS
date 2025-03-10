import { styles } from "@/app/styles/style";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React, { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader"

type Props = {
  isDashboard?: boolean;
}

const UserAnalytics = ({isDashboard}:Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

 const analyticsData: any = [];

  data &&
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });


  return (
    <>
      {
        isLoading ? (
            <Loader />
        ) : (
            <div className={`${!isDashboard ? "mt-[50px]" : "mt-[50px] dark:bg-[#111C43] shadow-lg pb-5 px-6 rounded-sm  "}`}>
            <div className={`${isDashboard ? "!ml-5 mb-5" : ''}`}>
            <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'}  !text-start`}>
               Users Analytics
             </h1>
             {
               !isDashboard && (
                 <p className={`${styles.label} px-5 text-black`}>
                 Last 12 months analytics data{" "}
               </p>
               )
             }
            </div>

         <div className={`w-full ${isDashboard ? 'h-[30vh]' : 'h-screen'} flex items-center justify-center`}>
           <ResponsiveContainer width={isDashboard ? '100%' : '90%'} height={!isDashboard ? "50%" : '100%'}>
             <AreaChart
               data={analyticsData}
               margin={{
                 top: 20,
                 right: 30,
                 left: 0,
                 bottom: 0,
               }}
             >
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip />
               <Area
                 type="monotone"
                 dataKey="count"
                 stroke="#4d62d9"
                 fill="#4d62d9"
               />
               <LabelList dataKey="count" position="top" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
       </div>
        )
      }
    </>
  )
}

export default UserAnalytics