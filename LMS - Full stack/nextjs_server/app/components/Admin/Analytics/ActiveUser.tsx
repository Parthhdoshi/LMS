// This Chats shows active Users
// It means we can find active number of user for times
// Ex. In last 1 Year 50 Students was active
// But last 1 month only 30 students are active

import { styles } from "@/app/styles/style";
import { useActiveUsers } from "@/redux/features/analytics/useAnalyticsApi";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const ActiveUser = () => {
  const { data: activeUsers } = useActiveUsers();

  const barData = [
    { name: "1 Day", active: activeUsers?.activeToday || "" },
    { name: "1 week", active: activeUsers?.activeInLastWeek || "" },
    { name: "2 week", active: activeUsers?.activeInLastTwoWeeks || "" },
    { name: "1 Month", active: activeUsers?.activeInLastMonth || "" },
    { name: "3 Months", active: activeUsers?.activeInLastThreeMonths || "" },
    { name: "6 Months", active: activeUsers?.activeInLastSixMonths || "" },
    { name: "1 Year", active: activeUsers?.activeInLastYear || "" },
  ];

  return (
    <div>
      <h1 className={`${styles.title} !text-[20px] !text-center`}>
       Active User 
      </h1>
      <ResponsiveContainer width={"100%"} height={400}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="active" fill="#82ca9d" label={{ position: 'top' }}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActiveUser;
