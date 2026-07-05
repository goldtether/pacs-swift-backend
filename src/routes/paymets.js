const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');

router.use(authMiddleware);

router.post('/create', async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // ВАЛИДАЦИЯ
    if (!data.amount || !data.debtorName || !data.debtorIban || !data.debtorBic || !data.creditorName || !data.creditorIban || !data.creditorBic) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, debtorName, debtorIban, debtorBic, creditorName, creditorIban, creditorBic'
      });
    }

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const uetr = uuidv4();

    const transaction = await Transaction.create({
      userId,
      transactionId,
      uetr,
      status: 'ACCEPTED',
      amount: data.amount,
      currency: data.currency || 'USD',
      debtorName: data.debtorName,
      debtorIban: data.debtorIban,
      debtorBic: data.debtorBic,
      creditorName: data.creditorName,
      creditorIban: data.creditorIban,
      creditorBic: data.creditorBic
    });

    res.json({
      success: true,
      transactionId,
      uetr,
      transaction
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/status/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        transactionId: req.params.transactionId,
        userId: req.user.id
      }
    });

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      });
    }

    res.json({ 
      success: true, 
      transaction 
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
