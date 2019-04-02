const mongoose = require('mongoose')
const schema = mongoose.Schema

const transactionModel = new schema({
    tickerSymbol: { type: String} ,
    buyDate: { type: String},
    buyQty: { type: Number},
    buyPrice: { type: Number },
    buyFee: { type: Number },
    totalValue: { type: Number }
})

module.exports = mongoose.model('transactions', transactionModel)
