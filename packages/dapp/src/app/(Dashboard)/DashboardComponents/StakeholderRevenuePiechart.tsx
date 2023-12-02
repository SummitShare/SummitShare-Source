

"use client"
import React from 'react'
import { Chart } from "react-google-charts";




 const options = {
    title: "Stakeholder Revenue Share",
    colors: ["#fdba74", '#4ade80', '#2dd4bf', '#818cf8', '#f472b6'], // Custom colors for each segment
    legend: {position: 'labeled', textStyle: {color: '#6b7280', fontSize: 12, bold: true}},
    pieSliceText: "none"
  };


  interface Props {
    data: any;
  }
const StakeholderRevenuePiechart: React.FC<Props> = ({data}) => {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"320px"}
    />
  )
}

export default StakeholderRevenuePiechart