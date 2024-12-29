import React, { useEffect, useState } from "react";
import axios from "axios";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const TransactionBarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, [selectedMonth]);

  const fetchChartData = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/chart-data?month=${selectedMonth}`);
    setChartData(data);
  };

  return (
    <div>
      <h2>Bar Chart Stats - {selectedMonth}</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="priceRange" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TransactionBarChart;
