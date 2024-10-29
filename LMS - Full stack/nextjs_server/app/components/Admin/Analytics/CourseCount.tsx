import { styles } from "@/app/styles/style";
import {
  useUserCount,
  useUserEnrolledCourseCount,
} from "@/redux/features/analytics/useAnalyticsApi";
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
} from "recharts";

const CourseCount = () => {
  const { data: userEnrolledCount } = useUserEnrolledCourseCount();

  const tagWiseEnrollment =
    userEnrolledCount &&
    Object.entries(userEnrolledCount?.tagWiseEnrollment).map(
      ([name, active]) => ({
        name,
        active,
      })
    );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div>
      <h1 className={`${styles.title} !text-[20px] !text-center`}>
     User Count For Each Course 
      </h1>
      <ResponsiveContainer width={"100%"} height={400}>
        <BarChart data={tagWiseEnrollment}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="active" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseCount;
