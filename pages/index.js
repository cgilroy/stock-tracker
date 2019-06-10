import App from '../components/App.js'
import AddTransactionModal from '../components/AddTransactionModal'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import '../components/css/datepicker.css'
import '../components/css/transitions.css'
import { CSSTransition } from 'react-transition-group'
import { nextLogo, mongoDBLogo, reactLogo, stocksIcon } from '../components/LogosAndIcons'

const uuid = require('uuid/v1')

const Page = (storedPriceData) => {
  const [showTransModal, setShowTransModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [transModal, setTransModal] = useState()
  const [loading, setLoading] = useState(false)

  const deleteStock = (id) => {
    var newTransactions = transactions.slice()
    newTransactions = newTransactions.filter(( obj ) => (obj.id !== id))
    setTransactions(newTransactions)
    fetch(`/api/transaction/${id}`, {
        method: 'DELETE',
        body: newTransactions
      }).then(setShowTransModal(false))

  }

  const editStock = (stockData) => {
    let newTransactions = transactions.slice()
    let replaceIndex = newTransactions.findIndex((element) => (element.id === stockData.id))
    newTransactions[replaceIndex] = stockData
    setTransactions(newTransactions)
    fetch(`/api/transaction/${stockData.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      }).then(setShowTransModal(false))

  }

  const addStock = (stockData) => {
    let newTransactions = transactions.slice()
    newTransactions.push(stockData)
    setTransactions(newTransactions)
    fetch(`/api/transaction/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      }).then(setShowTransModal(false))

  }

  const contentLoaded = () => {
    setShowLoginModal(false)
  }

  const postData = (data) => {
    let newTransactions = transactions.slice()
    let promiseArray = []
    for (let i of data) {
      newTransactions.push(i)
      promiseArray.push(fetch(`/api/transaction/`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(i)
        }))
    }
    Promise.all(promiseArray).then(() => {
      setTransactions(newTransactions)
    })
  }

  const loginClick = () => {
    const exampleTrans = (
        [
          {
            "id": uuid(),
            "tickerSymbol": "AAPL",
            "buyDate": "2018-10-05",
            "buyPrice": 224.29,
            "buyQty": 200,
            "buyFee": 17.67,
            "totalValue": 44875.67
          },
          {
            "id": uuid(),
            "tickerSymbol": "AAPL",
            "buyDate": "2017-11-14",
            "buyPrice": 174.55,
            "buyQty": 30,
            "buyFee": 0.35,
            "totalValue": 5236.85
          },
          {
            "id": uuid(),
            "tickerSymbol": "AAPL",
            "buyDate": "2015-06-21",
            "buyPrice": 126.16,
            "buyQty": 15,
            "buyFee": 15.47,
            "totalValue": 1907.87
          },
          {
            "id": uuid(),
            "tickerSymbol": "NFLX",
            "buyDate": "2019-01-05",
            "buyPrice": 298.57,
            "buyQty": 87,
            "buyFee": 12.24,
            "totalValue": 25987.83
          },
          {
            "id": uuid(),
            "tickerSymbol": "MSFT",
            "buyDate": "2018-06-22",
            "buyPrice": 100.41,
            "buyQty": 55,
            "buyFee": 7.80,
            "totalValue": 5530.35
          }
        ]
    )
    setLoading(true)
    postData(exampleTrans)

  }

  let modalBody = (!loading) ? (
    <React.Fragment>
      <h2 style={{fontWeight:'lighter',textAlign:'center',marginTop:'0'}}>Simple Stock Tracker</h2>
      <div className='login-button' onClick={() => loginClick()}><span>LOGIN</span></div>
      <span>A demo app powered by</span>
      <br/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        {nextLogo} {reactLogo} {mongoDBLogo}
      </div>
      <style jsx>{`
        .login-button {
          width: 150px;
          color: white;
          background:#7fc6a4;
          align-items:center;
          display: flex;
          padding: 10px;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          transition: all 0.3s cubic-bezier(.25,.8,.25,1);
          margin: 0 auto;
          margin-bottom: 40px;
        }
        .login-button:hover {
          background: #659e83;
        }
      `}</style>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <h2 style={{fontWeight:'lighter',textAlign:'center',marginTop:'0'}}>Generating sample data</h2>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      <style jsx>{`
        .lds-ring {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto;
        }
        .lds-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 51px;
          height: 51px;
          margin: 6px;
          border: 6px solid #7fc6a4;
          border-radius: 50%;
          animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #7fc6a4 transparent transparent transparent;
        }
        .lds-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .lds-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        .lds-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        @keyframes lds-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </React.Fragment>
  )

  const loginModal = (
    <div key="login" className="login-modal__wrapper">
      <div className="login-modal__body">
        {modalBody}
      </div>
      <span style={{position:'fixed',padding:'10px',bottom:'0',color:'white',zIndex:'99999999999999'}}>Check out the project on <a style={{color:'#7fc6a4'}} href="https://github.com/cgilroy/stock-tracker">Github</a></span>
      <style jsx>{`
        .login-modal__wrapper {
          display: flex;
          width: 100vw;
          height: 100vh;
          color: #3c4a51;
          position: fixed;
          background: #3c4a51;
          top: 0;
          align-items: center;
          justify-content: center;
        }
        .login-modal__body {
          padding: 30px;

          background: white;
        }
      `}</style>
    </div>
  )

  const handleShowModalClick = (stock,price,fee,date,qty,isEdit,id) => {
    setTransModal(<AddTransactionModal handleSubmit={addStock} handleEdit={editStock} handleDelete={deleteStock} handleClose={() => setShowTransModal(false)} stock={stock} price={price} fee={fee} date={date} qty={qty} isEdit={isEdit} id={id}/>)
    setShowTransModal(true)
  }

  return (
    <div className={`transModal-${showTransModal} loginModal-${showLoginModal}`}>
      <Head>
        <title>Simple Stock Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <div className="top_banner">
        <div style={{width: '50px',padding:'5px'}}>{stocksIcon}</div>
        <div className="top_banner__content">
          <h2 style={{margin:'0',color:"white"}}>Simple Stock Tracker</h2>
          <span style={{color:'white',marginLeft:'10px'}}>A demo project by <a className="top_banner__link" href="https://cgilroy.github.io"><span style={{whiteSpace:'nowrap'}}>CJ Gilroy</span></a></span>
          <span style={{color:'white',marginLeft:'auto'}}>Check out the project on <a className="top_banner__link" href="https://github.com/cgilroy/stock-tracker">Github</a></span>
        </div>
      </div>
      {showTransModal && transModal}
      <CSSTransition in={showLoginModal} timeout={800} classNames="login-modal-transition" unmountOnExit>
        <div>{loginModal}</div>
      </CSSTransition>

      <App transactions={transactions} showAddTransForm={handleShowModalClick} contentLoaded={contentLoaded} storedPriceData={storedPriceData}/>
      <style jsx global>{`
        * {
          font-family: sans-serif;
        }
        body {
          margin: 0;
        }
        .top_banner {
          min-height: 50px;
          background: #262626;
          display: flex;
          align-items: center;
          padding: 10px;
          box-sizing: border-box;
        }
        .top_banner__content {
          display: flex;
          align-items: baseline;
          width: 100%;
        }
        .top_banner__link {
          color: #7fc6a4;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .top_banner h2 {
            font-size: 1em;
          }
        }
        .section-header {
          background: #3c4a51;
          color: white;
          border-bottom: 2px solid #7fc6a4;
          font-weight: lighter;
          padding: 5px;
          margin: 0;
        }
        .stock-sections {
          display: flex;
          flex-wrap: wrap;
          background: #eee;
          flex-grow: 1;
        }
        table.transactions-table {

          width: 100%;
          text-align: left;
          border-collapse: collapse;
        }
        table.transactions-table td, table.transactions-table th {
          padding: 3px 2px;
        }
        table.transactions-table tbody td {
          font-size: 13px;
          border-bottom: 1px solid #AAAAAA;
        }
        table.transactions-table thead {
          background: #7FC6A4;
        }
        table.transactions-table thead th {
          font-size: 15px;
          font-weight: bold;
          color: #444444;
          text-align: left;
        }
        table.transactions-table tr {
          cursor: default;
        }
        table.transactions-table tr .editButton svg {
          fill: #babdbe;
          stroke-width: 15;
          stroke: #babdbe;
        }
        table.transactions-table tr .editButton:hover {
          cursor: pointer;
        }
        table.transactions-table tr .editButton:hover svg {
          fill: #449bf7;
          stroke: #449bf7;
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
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
  const res = await fetch(baseUrl + '/api/prices')
  const json = await res.json()
  return { storedPriceData: json }
}

export default Page
