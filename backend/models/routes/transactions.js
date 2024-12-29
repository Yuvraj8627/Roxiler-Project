const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions with search and pagination
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const filter = {
    dateOfSale: { $regex: `^${month}`, $options: 'i' },
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: parseFloat(search) || { $exists: true } },
    ],
  };
  try {
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions: ' + error.message);
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  try {
    const transactions = await Transaction.find({ dateOfSale: { $regex: `^${month}`, $options: 'i' } });
    const totalSales = transactions.reduce((acc, t) => acc + t.price, 0);
    const totalSold = transactions.filter((t) => t.sold).length;
    const totalNotSold = transactions.filter((t) => !t.sold).length;
    res.json({ totalSales, totalSold, totalNotSold });
  } catch (error) {
    res.status(500).send('Error fetching statistics: ' + error.message);
  }
});

// Bar chart API
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  const ranges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  try {
    const transactions = await Transaction.find({ dateOfSale: { $regex: `^${month}`, $options: 'i' } });
    const chartData = ranges.map((range, index) => {
      const nextRange = ranges[index + 1] || Infinity;
      const count = transactions.filter((t) => t.price >= range && t.price < nextRange).length;
      return { range: `${range}-${nextRange - 1}`, count };
    });
    res.json(chartData);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data: ' + error.message);
  }
});

// Pie chart API
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  try {
    const transactions = await Transaction.find({ dateOfSale: { $regex: `^${month}`, $options: 'i' } });
    const categories = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    res.json(categories);
  } catch (error) {
    res.status(500).send('Error fetching pie chart data: ' + error.message);
  }
});

// Combined API
router.get('/combined', async (req, res) => {
  const { month } = req.query;
  try {
    const statistics = await axios.get(`=${month}`);
    const barChart = await axios.get(`http://localhost:5000/api/transactions/bar-chart?month=${month}`);
    const pieChart = await axios.get(`http://localhost:5000/api/transactions/pie-chart?month=${month}`);
    res.json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).send('Error fetching combined data: ' + error.message);
  }
});

module.exports = router;
