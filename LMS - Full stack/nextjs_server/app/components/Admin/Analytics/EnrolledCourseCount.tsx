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

const EnrolledCourseCount = () => {
  const { data: userEnrolledCount } = useUserEnrolledCourseCount();
  const enrollTagsWithCourseTag: any = userEnrolledCount
    ? userEnrolledCount.tagEnrollmentCounts.map(({ _id, count }: any) => ({
        name: _id,
        value: count,
      }))
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div className="mx-auto">
      <h1 className={`${styles.title} !text-[20px] !text-center`}>
        Course Count
      </h1>
      <ResponsiveContainer width={400} height={400}>
        <PieChart>
          <Pie
            data={enrollTagsWithCourseTag}
            cx={200}
            cy={200}
            label={({ name, value }) => name + ": " + value}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            onClick={(data, index) => console.log(data)}
          >
            {enrollTagsWithCourseTag.map((entry: any, index: any) => (
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

export default EnrolledCourseCount;
