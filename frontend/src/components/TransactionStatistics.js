import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/statistics?month=${selectedMonth}`);
    setStatistics(data);
  };

  return (
    <div>
      <h2>Statistics - {selectedMonth}</h2>
      <div>
        <p>Total Sales: {statistics.totalSales}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default TransactionStatistics;
