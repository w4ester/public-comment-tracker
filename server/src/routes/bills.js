const express = require('express');
const { getBillsByAddress } = require('../services/billService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { address } = req.query;
    const bills = await getBillsByAddress(address);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error: error.message });
  }
});

module.exports = router;
