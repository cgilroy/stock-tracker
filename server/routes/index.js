const express = require('express')
const router = express.Router()
const Transactions = require('../models/transactionModel')

router.get('/', (req, res) => {
  console.log(res,'weares')
    Transactions.find({}, (err, transactions) => {
        res.json(transactions)
    })
})
router.use('/:id', (req, res, next) => {
    console.log(req.params.id)
    Transactions.findById(req.params.id, (err, photo) => {
        if(err)
            res.status(500).send(err)
        else
            req.photo = photo
            next()
    })
})
router
    .get('/:id', (req, res) => {
        return res.json( req.photo )
    })
module.exports = router;
