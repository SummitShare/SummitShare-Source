"use client";
import React from "react";
import { Chart } from "react-google-charts";

const options = {
  title: "Event Attendance",
  chartArea: { right: 0, width: "90%", height: "65%" },
  legend: { position: "none" },
  colors: ["#2dd4bf"],
  hAxis: {
    textStyle: { color: "#3f3f46" },
    gridlines: { count: -1, minValue: 0 },
  },

  vAxis: {
    title: "Attendance",
    textStyle: { color: "#3f3f46" },
    gridlines: { count: -1, minValue: 0 },
  },
  animation: {
    startup: true,
    duration: 1000,
    easing: "inAndOut",
  },
};

interface Props {
  data?: any; // to be changed to the required type
}
const EventAttendanceBarChart: React.FC<Props> = ({ data }) => {
  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
    />
  );
};

export default EventAttendanceBarChart;
