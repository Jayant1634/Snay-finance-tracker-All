const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction'); // Adjust the path as needed

// Route to add a transaction
router.post('/', async (req, res) => {
  const { userId, category, amount, date } = req.body;

  const newTransaction = new Transaction({ userId, category, amount, date });

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add transaction' });
  }
});

// Route to fetch transactions for a user (optional)
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
