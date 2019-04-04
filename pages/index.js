import App from '../components/App.js'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
const Page = (serverTransactions) => {
  // console.log(serverTransactions,'serverTransactions')
  const [showModal, setShowModal] = useState(false)
  const [transactions, setTransactions] = useState(serverTransactions.transactions)
  const [transModal, setTransModal] = useState()
  const deleteStock = (id) => {
    var newTransactions = transactions.slice()
    newTransactions = newTransactions.filter(( obj ) => (obj.id !== id))
    console.log('deletetrans',newTransactions)
    setTransactions(newTransactions)
    fetch(`http://localhost:3000/transaction/${id}`, {
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
    fetch(`http://localhost:3000/api/transaction/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      }).then(setShowModal(false))

  }

  const handleShowModalClick = (stock,price) => {
    setTransModal(<AddTransactionModal handleSubmit={addStock} handleClose={() => setShowModal(false)} stock={stock} price={price}/>)
    setShowModal(true)
  }

  console.log(transactions,'yeahrender')
  return (
    <div className={`modal-${showModal}`}>
      <Head>
        <title>Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      {showModal && transModal}
      <App transactions={transactions} showAddTransForm={handleShowModalClick} deleteStock={deleteStock} />
      <style jsx global>{`
        * {
          font-family: sans-serif;
        }
        body {
        }
        .ct-chart {
            position: relative;
        }

        .ct-tooltip {
            position: absolute;
            display: inline-block;
            min-width: 5em;
            padding: 8px 10px;
            background: #383838;
            color: #fff;
            text-align: center;
            pointer-events: none;
            z-index: 100;
            transition: opacity .2s linear;
        }

        .ct-tooltip:before {
            position: absolute;
            bottom: -14px;
            left: 50%;
            border: solid transparent;
            content: ' ';
            height: 0;
            width: 0;
            pointer-events: none;
            border-color: rgba(251, 249, 228, 0);
            border-top-color: #383838;
            border-width: 7px;
            margin-left: -8px;
        }

        .ct-tooltip.hide {
            display: block;
            opacity: 0;
            visibility: hidden;
        }
      `}</style>
    </div>
  )
}

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('http://localhost:3000/api/transactions')
  console.log(res,'res')
  const json = await res.json()
  return { transactions: json }
  // return (
  //   {
  //     "user": [
  //       {
  //         "name": "jeff"
  //       }
  //     ],
  //     "transactions": [
  //       {
  //         "id": 1,
  //         "tickerSymbol": "HMMJ.TO",
  //         "buyDate": "2017-11-14",
  //         "buyPrice": 12.7801,
  //         "buyQty": 101,
  //         "buyFee": 0.35,
  //         "totalValue": 1291.14
  //       },
  //       {
  //         "id": 2,
  //         "tickerSymbol": "HMMJ.TO",
  //         "buyDate": "2019-01-05",
  //         "buyPrice": 19.88,
  //         "buyQty": 1,
  //         "buyFee": 0,
  //         "totalValue": 19.88
  //       },
  //       {
  //         "id": 3,
  //         "tickerSymbol": "XAW.TO",
  //         "buyDate": "2017-11-14",
  //         "buyPrice": 12.7801,
  //         "buyQty": 101,
  //         "buyFee": 0.35,
  //         "totalValue": 1291.14
  //       },
  //       {
  //         "id": 4,
  //         "tickerSymbol": "XAW.TO",
  //         "buyDate": "2019-01-05",
  //         "buyPrice": 19.88,
  //         "buyQty": 1,
  //         "buyFee": 0,
  //         "totalValue": 19.88
  //       },
  //       {
  //         "id": 5,
  //         "tickerSymbol": "XAW.TO",
  //         "buyDate": "2018-11-25",
  //         "buyPrice": 14.88,
  //         "buyQty": 105,
  //         "buyFee": 0,
  //         "totalValue": 1562.4
  //       },
  //       {
  //         "id": 6,
  //         "tickerSymbol": "VCN.TO",
  //         "buyDate": "2017-11-14",
  //         "buyPrice": 12.7801,
  //         "buyQty": 101,
  //         "buyFee": 0.35,
  //         "totalValue": 1291.14
  //       },
  //       {
  //         "id": 8,
  //         "tickerSymbol": "VCN.TO",
  //         "buyDate": "2018-11-25",
  //         "buyPrice": 14.88,
  //         "buyQty": 105,
  //         "buyFee": 0,
  //         "totalValue": 1562.4
  //       },
  //       {
  //         "id": "928e7c80-502e-11e9-817c-d790151f8c90",
  //         "tickerSymbol": "HD",
  //         "buyDate": "2019-03-01",
  //         "buyPrice": 123,
  //         "buyQty": 25,
  //         "buyFee": 2,
  //         "totalValue": 3073
  //       }
  //     ]
  //   }
  // )
}

const AddTransactionModal = ({handleClose, handleSubmit, stock, price}) => {
  stock = stock || ''
  price = price || ''
  const [stockName, setStockName] = useState(stock)
  const [buyDate, setBuyDate] = useState()
  const [buyQty, setBuyQty] = useState()
  const [buyFee, setBuyFee] = useState()
  const [buyPrice, setBuyPrice] = useState(price)
  const id = require('uuid/v1')



  const handleSubmitClick = (event) => {
    // console.log(stockName,buyDate,buyPrice,buyFee,'testsubmit')
    event.preventDefault();
    let newTrans = {
      "id": id(),
      "tickerSymbol": stockName,
      "buyDate": buyDate,
      "buyPrice": buyPrice,
      "buyQty": buyQty,
      "buyFee": buyFee,
      "totalValue": parseFloat(((buyQty*buyPrice)-buyFee).toFixed(2))
    }

    const optimized = JSON.stringify(newTrans)
    // console.log(optimized,'// OPTIMIZE: ')
    // const test = {
    //   "tickerSymbol": "VCN.TO",
    //   "buyDate": "2018-11-25",
    //   "buyPrice": 14.88,
    //   "buyQty": 105,
    //   "buyFee": 0,
    //   "totalValue": 1562.4
    // }
    handleSubmit(newTrans)
  }

  var totalPrice = () => {
    // console.log([buyPrice, buyQty],"buyPrice")
    if (buyQty && buyPrice && buyFee !== undefined) {
      return ((parseFloat(buyQty)*parseFloat(buyPrice))+parseFloat(buyFee)).toFixed(2)
    } else {
      return (0.00).toFixed(2)
    }
  }

  return (
    <div className="modal-wrapper">
      <div className="modal-body">
        <div className="modal-body__header">
          <span className="modal-wrapper__title">Add New Transaction</span>
          <span className="exit-button" onClick={() => handleClose()}>&times;</span>
        </div>
        <div className="modal-body__form">
          <form onSubmit={handleSubmitClick} accept-charset="UTF-8">
            <div className="horizontal-entries">
              <label className="modal-input">
                <span style={{marginRight:'5px'}}>Stock</span>
                <input type="text" value={stockName} onChange={(e) => setStockName(e.target.value.toUpperCase())} required/>
              </label>
              <label>
                <span style={{marginRight:'5px'}}>Date</span>
                <input type="date" value={buyDate} onChange={(e) => setBuyDate(e.target.value)} required/>
              </label>
            </div>
            <div className="horizontal-entries" style={{marginTop:"15px"}}>
              <label className="modal-input">
                Quantity
                <input type="number" min="0" placeholder="0" value={buyQty} onChange={(e) => setBuyQty(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',display:'table-cell',color:'#7c899c',padding:'0 5px'}}>&times;</span>
              <label className="modal-input">
                Price
                <input type="number" min="0" step=".01" placeholder="0.00" value={buyPrice} onChange={(e) => setBuyPrice(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',display:'table-cell',color:'#7c899c',padding:'0 5px'}}>&#43;</span>
              <label className="modal-input">
                Fees
                <input type="number" min="0" step=".01" placeholder="0.00" value={buyFee} onChange={(e) => setBuyFee(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',display:'table-cell',color:'#7c899c',padding:'0 5px'}}>&#61;</span>
              <label className="modal-input">
                Total
                <span className="modal-input__finalPrice">{totalPrice()}</span>
              </label>
            </div>
            <input id="submit-button" type="submit" value="Submit" />
          </form>
        </div>
      </div>
      <style jsx>{`
        .modal-body {
          max-height: 300px;
          background: white;
          border-radius 8px;
          overflow-y: auto;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        }
        .modal-body__header {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #449bf7;
          color: white;
          padding: 10px;
          box-sizing: border-box;
        }
        .modal-body__form {
          padding: 15px;
        }
        .exit-button {
          position: absolute;
          right: 0;
          color: white;
          transition: color 0.1s linear;
          cursor: pointer;
          padding: 5px;
          font-size: 25px;
          height: 20px;
          width: 20px;
          line-height: 20px;
          text-align: center;
        }
        .exit-button:hover {
          color: #357ebd;
        }
        .modal-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #00000050;
          z-index: 999999;
        }
        .modal-input {
          display: table-cell;
          text-align: center;
        }
        .entry-label {
         width: 100%;
        }
        .horizontal-entries {
          width: 100%;
          display: table;
        }
        .modal-body input {
          color: #7c899c;
          border: 1px solid #ccc;
          box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
          padding: 10px 16px;
          height: 40px;
          font-size: 16px;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .modal-input__finalPrice {
          padding: 10px 16px;
          height: 40px;
          font-size: 16px;
          box-sizing: border-box;
          display: inline-block;
        }
        #submit-button {
          width: 150px;
          background-color: #62cc83;
          border-radius: 5px;
          align-items:center;
          display: flex;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          color: white;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          transition: all 0.3s cubic-bezier(.25,.8,.25,1);
          margin-top: 40px;

        }

        #submit-button:hover {
          background-color: #5cbf7b;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
      `}</style>
    </div>
  )
}

export default Page
