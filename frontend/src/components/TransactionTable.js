import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionTable = ({ selectedMonth, setSelectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, page]);

  const fetchTransactions = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/transactions?month=${selectedMonth}&page=${page}&search=${search}`);
    setTransactions(data);
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search transaction"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.title}</td>
              <td>{tx.description}</td>
              <td>{tx.price}</td>
              <td>{tx.category}</td>
              <td>{tx.sold ? "Yes" : "No"}</td>
              <td><img src={tx.image} alt={tx.title} width="50" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
        <span>Page: {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionTable;
