const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize the database with data
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;
    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(data);
    res.status(200).send('Database initialized with seed data');
  } catch (error) {
    res.status(500).send('Error initializing database: ' + error.message);
  }
});

module.exports = router;