import React, { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import TransactionStatistics from "./components/TransactionStatistics";
import TransactionBarChart from "./components/TransactionBarChart";
import "./App.css";

function App() {
  const [selectedMonth, setSelectedMonth] = useState("March");

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <TransactionTable selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <TransactionStatistics selectedMonth={selectedMonth} />
      <TransactionBarChart selectedMonth={selectedMonth} />
    </div>
  );
}

export default App;
