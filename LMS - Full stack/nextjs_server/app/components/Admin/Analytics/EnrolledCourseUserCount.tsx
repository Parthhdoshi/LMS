import {
  useUserCount,
  useUserEnrolledCourseCount,
} from "@/redux/features/analytics/useAnalyticsApi";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";

const EnrolledCourseUserCount = () => {
  const {
    data: userEnrolledCount,
    isLoading,
    isError,
  } = useUserEnrolledCourseCount();

  const pieData = [
    {
      name: "Enrolled Users",
      value: userEnrolledCount?.usersWithEnrolledCourses,
    },
    { name: "Total Users", value: userEnrolledCount?.totalUsers },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (isLoading) return <Loader />;
  if (isError) return <div> Error </div>;

  return (
    <div className="mx-auto">
      <h1
        className={`${styles.title} !text-[20px] !text-center`}
      >
       Enroll User Count 
      </h1>
     {/* <p className="font-Poppins"> 
      It will show how many users are enrolled in any one course.
      </p>  */}
      <ResponsiveContainer  width={400}  height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx={200}
            cy={200}
            label={({ name, value }) => name + ": " + value}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrolledCourseUserCount;
