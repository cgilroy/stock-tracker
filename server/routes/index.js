const express = require('express')
const router = express.Router()
const Transactions = require('../models/transactionModel')

router.get('/', (req, res) => {
  console.log(res,'weares')
    Transactions.find({}, (err, transactions) => {
        res.json(transactions)
    })
})
module.exports = router;
