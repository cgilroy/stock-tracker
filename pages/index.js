import App from '../components/App.js'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
const Page = (serverTransactions) => {
  console.log(serverTransactions,'serverTransactions')
  const [showModal, setShowModal] = useState(false)
  const [transactions, setTransactions] = useState(serverTransactions.transactions)
  const deleteStock = (id) => {
    var newTransactions = transactions.slice()
    newTransactions = newTransactions.filter(( obj ) => (obj.id !== id))
    console.log('deletetrans',newTransactions)
    setTransactions(newTransactions)
    fetch(`http://localhost:4000/transactions/${id}`, {
        method: 'DELETE',
        body: newTransactions
      })

  }

  const addStock = (stockData) => {
    let newTransactions = transactions.slice()
    console.log('addtrans1',newTransactions)
    newTransactions.push(stockData)
    console.log('addtrans2',newTransactions)
    setTransactions(newTransactions)
    fetch(`http://localhost:4000/transactions/`, {
        method: 'POST',
        body: newTransactions
      })

  }

  console.log(transactions,'yeahrender')
  return (
    <div>
      <Head>
        <title>Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      {showModal && <AddTransactionModal handleSubmit={() => addStock()} handleClose={() => setShowModal(false)} />}
      <App transactions={transactions} showAddTransForm={() => setShowModal(true)} deleteStock={deleteStock} />
    </div>
  )
}

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('http://localhost:4000/transactions')
  const json = await res.json()
  return { transactions: json }
}

const AddTransactionModal = ({handleClose, handleSubmit}) => {
  const [stockName, setStockName] = useState()
  const [buyDate, setBuyDate] = useState()
  const [buyQty, setBuyQty] = useState()
  const [buyFee, setBuyFee] = useState()
  const [buyPrice, setBuyPrice] = useState()
  const id = require('uuid/v1')

  const handleSubmitClick = () => {
    console.log(stockName,buyDate,buyPrice,buyFee,'testsubmit')
    let newTrans = {
      "id": id,
      "tickerSymbol": stockName,
      "buyDate": buyDate,
      "buyPrice": buyPrice,
      "buyQty": buyQty,
      "buyFee": buyFee,
      "totalValue": ((parseFloat(buyQty)*parseFloat(buyPrice))-parseFloat(buyFee)).toFixed(2)
    }
    console.log(newTrans,'newTrans')
    const optimized = JSON.stringify(newTrans)
    const test = {
      "id": 10,
      "tickerSymbol": "VCN.TO",
      "buyDate": "2018-11-25",
      "buyPrice": 14.88,
      "buyQty": 105,
      "buyFee": 0,
      "totalValue": 1562.4
    }
    handleSubmit(test)
  }

  var totalPrice = () => {
    console.log([buyPrice, buyQty],"buyPrice")
    if (buyQty && buyPrice && buyFee !== undefined) {
      return ((parseFloat(buyQty)*parseFloat(buyPrice))+parseFloat(buyFee)).toFixed(2)
    } else {
      return (0.00).toFixed(2)
    }
  }

  return (
    <div className="add-trans-modal">
      <form onSubmit={() => handleSubmitClick()} accept-charset="UTF-8">
        <label>
          Stock:
          <input type="text" value={stockName} onChange={(e) => setStockName(e.target.value)} />
        </label>
        <label>
          Date:
          <input type="date" value={buyDate} onChange={(e) => setBuyDate(e.target.value)} />
        </label>
        <label>
          Qty:
          <input type="number" min="0" value={buyQty} onChange={(e) => setBuyQty(e.target.value)} />
        </label>
        <label>
          Price:
          <input type="number" min="0" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
        </label>
        <label>
          Fees:
          <input type="number" min="0" value={buyFee} onChange={(e) => setBuyFee(e.target.value)} />
        </label>
        <label>
          Total Price:
          {totalPrice()}
        </label>
        <input type="submit" value="Submit" />
      </form>
      <style jsx>{`
        .add-trans-modal {
          width: 50%;
          height: 100%;
          max-height: 300px;
          background: white;
          border: 1px solid #eee;
          overflow-y: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      `}</style>
    </div>
  )
}

export default Page
