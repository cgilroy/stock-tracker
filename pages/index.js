import App from '../components/App.js'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import dateCss from 'react-datepicker/dist/react-datepicker.css'
import extraDateCss from '../components/css/datepicker.css'
import transitionCSS from '../components/css/transitions.css'
import { CSSTransition } from 'react-transition-group'
import { formatMoney } from '../components/helpers.js'
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
        <h2 style={{margin:'0',color:"white"}}>Simple Stock Tracker</h2>
        <span style={{color:'white',marginLeft:'10px'}}>A demo project by <a className="top_banner__link" href="https://cgilroy.github.io">CJ Gilroy</a></span>
        <span style={{color:'white',marginLeft:'auto'}}>Check out the project on <a className="top_banner__link" href="https://github.com/cgilroy/stock-tracker">Github</a></span>
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
          align-items: baseline;
          padding: 10px;
          box-sizing: border-box;
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

const AddTransactionModal = ({handleClose, handleSubmit, handleEdit, handleDelete, stock, price, fee, date, qty, isEdit, id}) => {
  var moment = require('moment')

  stock = stock || 'MSFT'
  price = price || ''
  fee = fee || ''
  date = date || moment().format("YYYY-MM-DD")
  qty = qty || ''
  isEdit = isEdit || false
  const [stockName, setStockName] = useState(stock)
  const [buyDate, setBuyDate] = useState(date)
  const [buyQty, setBuyQty] = useState(qty)
  const [buyFee, setBuyFee] = useState(fee)
  const [buyPrice, setBuyPrice] = useState(price)

  const handleSubmitClick = (event) => {
    event.preventDefault();
    const submitFee = buyFee || 0
    let newTrans = {
      "id": uuid(),
      "tickerSymbol": stockName,
      "buyDate": moment(buyDate).format("YYYY-MM-DD"),
      "buyPrice": buyPrice,
      "buyQty": buyQty,
      "buyFee": buyFee,
      "totalValue": parseFloat(((buyQty*buyPrice)+submitFee).toFixed(2))
    }
    const optimized = JSON.stringify(newTrans)
    handleSubmit(newTrans)
  }

  const handleEditClick = (event) => {
    event.preventDefault();
    const submitFee = buyFee || 0
    let newTrans = {
      "id": id,
      "tickerSymbol": stockName,
      "buyDate": moment(buyDate).format("YYYY-MM-DD"),
      "buyPrice": buyPrice,
      "buyQty": buyQty,
      "buyFee": buyFee,
      "totalValue": parseFloat(((buyQty*buyPrice)+submitFee).toFixed(2))
    }
    const optimized = JSON.stringify(newTrans)
    handleEdit(newTrans)
  }

  const handleDeleteClick = (event) => {
    handleDelete(id)
  }

  var totalPrice = () => {
    const calcQty = buyQty || 0
    const calcPrice = buyPrice || 0
    const calcFee = buyFee || 0
    const val = formatMoney((calcQty*calcPrice)+calcFee)
    return val
  }
  let formTitle = (isEdit) ? 'Edit Transaction' : 'Add New Transaction'

  return (
    <div className="modal-wrapper">
      <div className="modal-body">
        <div className="modal-body__header">
          <span className="modal-wrapper__title">{formTitle}</span>
          <span className="exit-button" onClick={() => handleClose()}>&times;</span>
        </div>
        <div className="modal-body__form">
          <form onSubmit={isEdit ? (handleEditClick) : (handleSubmitClick)} acceptCharset="UTF-8">
            <div className="horizontal-entries" style={{justifyContent:'space-evenly'}}>
              <label className="modal-input">
                <span style={{marginRight:'5px'}}>Stock</span>
                <select value={stockName} onChange={(e) => setStockName(e.target.value)} disabled={isEdit ? true : false} required>
                  <option value="MSFT">MSFT</option>
                  <option value="AAPL">AAPL</option>
                  <option value="NFLX">NFLX</option>
                </select>
              </label>
              <label className="modal-input">
                <span style={{marginRight:'5px'}}>Date</span>
                <DatePicker
                    selected={buyDate}
                    onChange={(date) => setBuyDate(date)}
                    maxDate={new Date()}
                    className='date-input'
                />
              </label>
            </div>
            <div className="horizontal-entries" style={{marginTop:"15px"}}>
              <label className="modal-input">
                Quantity
                <input type="number" min="0" placeholder="0" value={buyQty} onChange={(e) => setBuyQty(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',color:'#7c899c',padding:'0 5px'}}>&times;</span>
              <label className="modal-input">
                Price
                <input type="number" min="0" step=".01" placeholder="0.00" value={buyPrice} onChange={(e) => setBuyPrice(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',color:'#7c899c',padding:'0 5px'}}>&#43;</span>
              <label className="modal-input">
                Fees
                <input type="number" min="0" step=".01" placeholder="0.00" value={buyFee} onChange={(e) => setBuyFee(parseFloat(e.target.value))} />
              </label>
              <span style={{verticalAlign:'middle',color:'#7c899c',padding:'0 5px'}}>&#61;</span>
              <label className="modal-input modal-input__totalPrice">
                Total
                <span className="modal-input__finalPrice">${totalPrice()}</span>
              </label>
            </div>
            <div style={{display:'flex'}}>
              <input className="input-button" id="submit-button" type="submit" value={isEdit ? "Save" : "Submit"} />
              {isEdit && <input className="input-button" id="delete-button" onClick={handleDeleteClick} type="button" value="Delete" />}
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .modal-body {
          width: 90%;
          max-width: 810px;
          background: white;
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
        .modal-input input {
          width: 100%;
          max-width: 200px;
        }
        .entry-label {
         width: 100%;
        }
        .horizontal-entries {
          width: 100%;
          display: flex;
        }
        .horizontal-entries > span {
          display: table-cell;
        }
        .modal-body select {
          width: 200px;
        }
        .modal-body .input-button {
          width: 150px;
          border: none;
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
        .modal-body input, .modal-body select {
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
          min-width: 150px;
        }

        #submit-button {
          background-color: #62cc83;
        }
        #submit-button:hover {
          background-color: #5cbf7b;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        #delete-button {
          background-color: #f05b4f;
          margin-left: 20px;
        }
        #delete-button:hover {
          background-color: #d24e43;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        @media only screen and (max-width: 600px) {
          .modal-body {
            width: 100%;
            height: 100%;
          }
          .horizontal-entries {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
          }
          .horizontal-entries > span {
            display: none;
          }
          .modal-input {
            width: 100%;
            display: grid;
            text-align: left;
          }
          .modal-input input, .modal-input select {
            margin-top: 6px;
            margin-bottom: 10px;
            width: 100%;
          }
          .modal-input__totalPrice {
            text-align: center;
            background: #eee;
            padding: 5px;
          }

        }

      `}</style>
    </div>
  )
}

const nextLogo = (
  <svg width="80px" viewBox="0 0 207 124" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Black-Next.js" transform="translate(-247.000000, -138.000000)" fill="#000000" fillRule="nonzero">
            <g id="next-black" transform="translate(247.000000, 138.000000)">
                <g id="EXT-+-Type-something">
                    <path d="M48.9421964,32.6320058 L87.9011585,32.6320058 L87.9011585,35.7136421 L52.5134345,35.7136421 L52.5134345,58.9070103 L85.7908813,58.9070103 L85.7908813,61.9886466 L52.5134345,61.9886466 L52.5134345,87.4526941 L88.306981,87.4526941 L88.306981,90.5343303 L48.9421964,90.5343303 L48.9421964,32.6320058 Z M91.3912326,32.6320058 L95.5306221,32.6320058 L113.8738,58.0960534 L132.622801,32.6320058 L158.124498,0.286809811 L116.22757,60.7722112 L137.817329,90.5343303 L133.51561,90.5343303 L113.8738,63.4483691 L94.1508254,90.5343303 L89.9302715,90.5343303 L111.682358,60.7722112 L91.3912326,32.6320058 Z M139.359455,35.713642 L139.359455,32.6320058 L183.756439,32.6320058 L183.756439,35.7136421 L163.302983,35.7136421 L163.302983,90.5343303 L159.731745,90.5343303 L159.731745,35.7136421 L139.359455,35.713642 Z" id="EXT"></path>
                    <polygon id="Type-something" points="0.202923647 32.6320058 4.66697141 32.6320058 66.2235778 124.303087 40.785176 90.5343303 3.93649086 37.0111732 3.77416185 90.5343303 0.202923647 90.5343303"></polygon>
                </g>
                <path d="M183.396622,86.5227221 C184.134938,86.5227221 184.673474,85.9601075 184.673474,85.233037 C184.673474,84.5059658 184.134938,83.9433513 183.396622,83.9433513 C182.666993,83.9433513 182.11977,84.5059658 182.11977,85.233037 C182.11977,85.9601075 182.666993,86.5227221 183.396622,86.5227221 Z M186.905793,83.1297235 C186.905793,85.2763149 188.460599,86.678523 190.727662,86.678523 C193.142388,86.678523 194.601647,85.233037 194.601647,82.7229099 L194.601647,73.8855335 L192.655968,73.8855335 L192.655968,82.7142542 C192.655968,84.1078073 191.952397,84.8521899 190.710289,84.8521899 C189.598473,84.8521899 188.842785,84.1597409 188.816727,83.1297235 L186.905793,83.1297235 Z M197.146664,83.0172011 C197.285642,85.2503478 199.153145,86.678523 201.932686,86.678523 C204.903321,86.678523 206.762139,85.1811034 206.762139,82.792155 C206.762139,80.9138876 205.702439,79.8752151 203.131364,79.2779777 L201.750279,78.9404092 C200.117298,78.5595622 199.457158,78.0488813 199.457158,77.1573541 C199.457158,76.0321243 200.482113,75.296398 202.019547,75.296398 C203.478806,75.296398 204.48639,76.0148135 204.668797,77.1660091 L206.562359,77.1660091 C206.44944,75.0626962 204.590622,73.5825873 202.045605,73.5825873 C199.309495,73.5825873 197.48542,75.0626962 197.48542,77.2871878 C197.48542,79.1221767 198.519063,80.2127835 200.786126,80.7407758 L202.401734,81.1302779 C204.060773,81.5197807 204.790402,82.091051 204.790402,83.0431676 C204.790402,84.1510859 203.643842,84.9560573 202.08035,84.9560573 C200.403939,84.9560573 199.240006,84.2030196 199.074971,83.0172011 L197.146664,83.0172011 Z" id=".JS"></path>
            </g>
        </g>
    </g>
  </svg>
)

const reactLogo = (
  <svg width="80px" version="1.1" id="Layer_2_1_" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 viewBox="0 0 841.9 595.3" enableBackground="new 0 0 841.9 595.3">
    <g>
    	<path fill="#61DAFB" d="M666.3,296.5c0-32.5-40.7-63.3-103.1-82.4c14.4-63.6,8-114.2-20.2-130.4c-6.5-3.8-14.1-5.6-22.4-5.6v22.3
    		c4.6,0,8.3,0.9,11.4,2.6c13.6,7.8,19.5,37.5,14.9,75.7c-1.1,9.4-2.9,19.3-5.1,29.4c-19.6-4.8-41-8.5-63.5-10.9
    		c-13.5-18.5-27.5-35.3-41.6-50c32.6-30.3,63.2-46.9,84-46.9l0-22.3c0,0,0,0,0,0c-27.5,0-63.5,19.6-99.9,53.6
    		c-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7,0,51.4,16.5,84,46.6c-14,14.7-28,31.4-41.3,49.9c-22.6,2.4-44,6.1-63.6,11
    		c-2.3-10-4-19.7-5.2-29c-4.7-38.2,1.1-67.9,14.6-75.8c3-1.8,6.9-2.6,11.5-2.6l0-22.3c0,0,0,0,0,0c-8.4,0-16,1.8-22.6,5.6
    		c-28.1,16.2-34.4,66.7-19.9,130.1c-62.2,19.2-102.7,49.9-102.7,82.3c0,32.5,40.7,63.3,103.1,82.4c-14.4,63.6-8,114.2,20.2,130.4
    		c6.5,3.8,14.1,5.6,22.5,5.6c27.5,0,63.5-19.6,99.9-53.6c36.4,33.8,72.4,53.2,99.9,53.2c8.4,0,16-1.8,22.6-5.6
    		c28.1-16.2,34.4-66.7,19.9-130.1C625.8,359.7,666.3,328.9,666.3,296.5z M536.1,229.8c-3.7,12.9-8.3,26.2-13.5,39.5
    		c-4.1-8-8.4-16-13.1-24c-4.6-8-9.5-15.8-14.4-23.4C509.3,224,523,226.6,536.1,229.8z M490.3,336.3c-7.8,13.5-15.8,26.3-24.1,38.2
    		c-14.9,1.3-30,2-45.2,2c-15.1,0-30.2-0.7-45-1.9c-8.3-11.9-16.4-24.6-24.2-38c-7.6-13.1-14.5-26.4-20.8-39.8
    		c6.2-13.4,13.2-26.8,20.7-39.9c7.8-13.5,15.8-26.3,24.1-38.2c14.9-1.3,30-2,45.2-2c15.1,0,30.2,0.7,45,1.9
    		c8.3,11.9,16.4,24.6,24.2,38c7.6,13.1,14.5,26.4,20.8,39.8C504.7,309.8,497.8,323.2,490.3,336.3z M522.6,323.3
    		c5.4,13.4,10,26.8,13.8,39.8c-13.1,3.2-26.9,5.9-41.2,8c4.9-7.7,9.8-15.6,14.4-23.7C514.2,339.4,518.5,331.3,522.6,323.3z
    		 M421.2,430c-9.3-9.6-18.6-20.3-27.8-32c9,0.4,18.2,0.7,27.5,0.7c9.4,0,18.7-0.2,27.8-0.7C439.7,409.7,430.4,420.4,421.2,430z
    		 M346.8,371.1c-14.2-2.1-27.9-4.7-41-7.9c3.7-12.9,8.3-26.2,13.5-39.5c4.1,8,8.4,16,13.1,24C337.1,355.7,341.9,363.5,346.8,371.1z
    		 M420.7,163c9.3,9.6,18.6,20.3,27.8,32c-9-0.4-18.2-0.7-27.5-0.7c-9.4,0-18.7,0.2-27.8,0.7C402.2,183.3,411.5,172.6,420.7,163z
    		 M346.7,221.9c-4.9,7.7-9.8,15.6-14.4,23.7c-4.6,8-8.9,16-13,24c-5.4-13.4-10-26.8-13.8-39.8C318.6,226.7,332.4,224,346.7,221.9z
    		 M256.2,347.1c-35.4-15.1-58.3-34.9-58.3-50.6c0-15.7,22.9-35.6,58.3-50.6c8.6-3.7,18-7,27.7-10.1c5.7,19.6,13.2,40,22.5,60.9
    		c-9.2,20.8-16.6,41.1-22.2,60.6C274.3,354.2,264.9,350.8,256.2,347.1z M310,490c-13.6-7.8-19.5-37.5-14.9-75.7
    		c1.1-9.4,2.9-19.3,5.1-29.4c19.6,4.8,41,8.5,63.5,10.9c13.5,18.5,27.5,35.3,41.6,50c-32.6,30.3-63.2,46.9-84,46.9
    		C316.8,492.6,313,491.7,310,490z M547.2,413.8c4.7,38.2-1.1,67.9-14.6,75.8c-3,1.8-6.9,2.6-11.5,2.6c-20.7,0-51.4-16.5-84-46.6
    		c14-14.7,28-31.4,41.3-49.9c22.6-2.4,44-6.1,63.6-11C544.3,394.8,546.1,404.5,547.2,413.8z M585.7,347.1c-8.6,3.7-18,7-27.7,10.1
    		c-5.7-19.6-13.2-40-22.5-60.9c9.2-20.8,16.6-41.1,22.2-60.6c9.9,3.1,19.3,6.5,28.1,10.2c35.4,15.1,58.3,34.9,58.3,50.6
    		C644,312.2,621.1,332.1,585.7,347.1z"/>
    	<polygon fill="#61DAFB" points="320.8,78.4 320.8,78.4 320.8,78.4 	"/>
    	<circle fill="#61DAFB" cx="420.9" cy="296.5" r="45.7"/>
    	<polygon fill="#61DAFB" points="520.5,78.1 520.5,78.1 520.5,78.1 	"/>
    </g>
    </svg>

)

const mongoDBLogo = (
  <svg width="120" viewBox="0 0 512 146" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M476.713 60.463c-.46.092-.922 1.107-.922 1.66-.092 3.692-.184 13.474-.184 20.118 0 .185.276.554.553.554 1.384.092 4.706.184 7.567.184 3.968 0 6.275-.553 7.568-1.106 3.321-1.662 4.89-5.261 4.89-9.23 0-8.95-6.275-12.365-15.596-12.365-.646-.092-2.49-.092-3.876.185zm23.81 41.25c0-9.136-6.737-14.212-18.918-14.212-.554 0-4.43-.092-5.353.092-.277.093-.645.278-.645.555 0 6.551-.093 16.98.184 21.04.184 1.753 1.477 4.245 3.046 4.983 1.66.923 5.444 1.107 8.028 1.107 7.29 0 13.658-4.06 13.658-13.565zm-42.634-46.325c.922 0 3.69.276 10.796.276 6.737 0 12.089-.184 18.641-.184 8.028 0 19.102 2.86 19.102 14.857 0 5.906-4.153 10.613-9.597 12.92-.276.092-.276.276 0 .368 7.751 1.939 14.581 6.737 14.581 15.78 0 8.86-5.537 14.489-13.566 17.996-4.891 2.122-10.981 2.86-17.164 2.86-4.707 0-17.349-.553-24.362-.368-.738-.278.646-3.6 1.291-4.153 1.662-.093 2.953-.185 4.707-.739 2.492-.645 2.768-1.384 3.137-5.167.185-3.23.185-14.674.185-22.794 0-11.166.093-18.733 0-22.424-.092-2.86-1.107-3.784-3.137-4.338-1.57-.276-4.153-.646-6.276-.922-.462-.462 1.107-3.6 1.662-3.968zm-53.248 57.399c2.216 1.752 6.553 2.49 10.429 2.49 4.983 0 9.966-.921 14.765-5.26 4.891-4.428 8.305-11.257 8.305-22.146 0-10.429-3.968-18.919-12.089-23.901-4.614-2.862-10.52-4.06-17.349-4.06-2.03 0-3.968.092-5.167.645-.278.185-.923 1.015-.923 1.476-.185 1.846-.185 16.057-.185 24.363 0 8.582 0 20.579.185 21.963 0 1.385.645 3.507 2.03 4.43zm-20.948-57.4c1.754 0 8.49.277 11.72.277 5.815 0 9.967-.276 20.948-.276 9.228 0 16.98 2.491 22.517 7.197 6.736 5.814 10.244 13.843 10.244 23.624 0 13.935-6.368 21.964-12.736 26.578-6.366 4.706-14.672 7.474-26.484 7.474-6.275 0-17.072-.184-26.024-.277h-.092c-.461-.83.738-4.06 1.476-4.152 2.4-.277 3.046-.37 4.246-.83 1.937-.739 2.307-1.754 2.584-5.168.276-6.368.184-14.027.184-22.702 0-6.182.092-18.272-.093-22.148-.276-3.229-1.66-4.06-4.429-4.614-1.384-.276-3.23-.646-5.813-.922-.37-.647 1.291-3.507 1.752-4.06z" fill="#8E714E"/><path d="M272.033 116.385c-2.307-.277-3.968-.645-5.998-1.568-.277-.185-.739-1.107-.739-1.477-.184-3.23-.184-12.458-.184-18.64 0-4.984-.83-9.321-2.953-12.366-2.492-3.508-6.09-5.537-10.705-5.537-4.06 0-9.505 2.768-14.027 6.644-.092.092-.83.739-.738-.277 0-1.015.185-3.045.277-4.43.093-1.292-.646-1.937-.646-1.937-2.953 1.476-11.258 3.414-14.304 3.69-2.214.463-2.768 2.585-.46 3.323h.092c2.49.738 4.152 1.569 5.443 2.4.923.738.831 1.753.831 2.584.092 6.92.092 17.533-.184 23.347-.092 2.307-.738 3.137-2.4 3.506l.185-.092c-1.292.277-2.307.553-3.876.738-.554.554-.554 3.507 0 4.153 1.015 0 6.367-.277 10.798-.277 6.09 0 9.228.277 10.796.277.646-.738.831-3.507.462-4.153-1.754-.092-3.046-.276-4.245-.646-1.661-.37-2.123-1.199-2.216-3.137-.183-4.892-.183-15.227-.183-22.24 0-1.938.553-2.861 1.106-3.415 2.123-1.845 5.538-3.137 8.583-3.137 2.953 0 4.89.923 6.367 2.123 2.03 1.66 2.676 4.06 2.953 5.813.461 3.968.277 11.812.277 18.641 0 3.691-.277 4.614-1.66 5.075-.647.277-2.308.647-4.246.83-.646.647-.461 3.508 0 4.154 2.676 0 5.814-.277 10.428-.277 5.721 0 9.413.277 10.89.277.46-.554.645-3.23.276-3.969zm25.562-35.25c-4.89 0-7.936 3.783-7.936 9.688 0 5.999 2.676 12.92 10.243 12.92 1.292 0 3.692-.554 4.798-1.846 1.754-1.66 2.954-4.983 2.954-8.49 0-7.659-3.784-12.273-10.059-12.273zm-.646 40.787c-1.845 0-3.138.554-3.968 1.016-3.876 2.49-5.629 4.89-5.629 7.752 0 2.675 1.015 4.797 3.23 6.643 2.676 2.307 6.367 3.415 11.073 3.415 9.413 0 13.566-5.076 13.566-10.058 0-3.508-1.754-5.815-5.352-7.106-2.584-1.108-7.29-1.662-12.92-1.662zm.646 23.994c-5.629 0-9.69-1.2-13.196-3.876-3.415-2.584-4.891-6.46-4.891-9.136 0-.738.185-2.769 1.846-4.614 1.014-1.108 3.23-3.23 8.49-6.829.184-.092.276-.184.276-.37 0-.184-.185-.369-.369-.46-4.337-1.661-5.629-4.338-5.999-5.814v-.185c-.091-.554-.276-1.107.555-1.661.646-.461 1.569-1.015 2.583-1.66 1.569-.924 3.23-1.939 4.245-2.77.185-.184.185-.368.185-.553 0-.185-.185-.37-.37-.461-6.458-2.123-9.688-6.922-9.688-14.12 0-4.706 2.122-8.951 5.905-11.627 2.584-2.03 9.044-4.522 13.289-4.522h.277c4.337.092 6.736 1.015 10.15 2.215 1.846.646 3.6.922 6 .922 3.598 0 5.167-1.107 6.458-2.398.093.184.278.646.37 1.845.092 1.2-.277 2.953-1.2 4.245-.738 1.015-2.399 1.754-4.06 1.754h-.462c-1.661-.185-2.4-.37-2.4-.37l-.368.185c-.092.185 0 .369.092.646l.093.185c.184.83.553 3.321.553 3.968 0 7.567-3.045 10.888-6.275 13.38-3.138 2.307-6.736 3.783-10.797 4.153-.092 0-.46 0-1.292.092-.461 0-1.107.093-1.2.093h-.092c-.738.184-2.583 1.107-2.583 2.675 0 1.384.83 3.046 4.798 3.323.83.092 1.66.092 2.584.185 5.26.368 11.812.83 14.857 1.845 4.245 1.568 6.921 5.352 6.921 9.874 0 6.83-4.89 13.197-13.011 17.164-3.968 1.754-7.937 2.677-12.274 2.677zm52.6-64.32c-1.937 0-3.691.46-4.983 1.383-3.598 2.215-5.444 6.645-5.444 13.104 0 12.09 6.09 20.58 14.765 20.58 2.584 0 4.614-.739 6.367-2.215 2.676-2.216 4.061-6.645 4.061-12.828 0-11.996-5.999-20.025-14.765-20.025zm1.662 39.496c-15.688 0-21.317-11.535-21.317-22.332 0-7.567 3.045-13.381 9.135-17.534 4.338-2.676 9.506-4.152 14.12-4.152 11.996 0 20.394 8.582 20.394 20.948 0 8.397-3.322 15.041-9.69 19.102-3.045 2.03-8.305 3.968-12.643 3.968h.001zM187.411 81.595c-1.938 0-3.691.461-4.984 1.384-3.598 2.215-5.444 6.645-5.444 13.104 0 12.09 6.09 20.58 14.765 20.58 2.584 0 4.614-.739 6.368-2.215 2.675-2.216 4.06-6.645 4.06-12.828 0-11.996-5.906-20.025-14.765-20.025zm1.661 39.497c-15.688 0-21.317-11.535-21.317-22.332 0-7.567 3.045-13.381 9.135-17.534 4.338-2.676 9.506-4.152 14.12-4.152 11.997 0 20.394 8.582 20.394 20.948 0 8.397-3.322 15.041-9.69 19.102-2.953 2.03-8.213 3.968-12.642 3.968zm-105.478-.923c-.185-.276-.37-1.107-.277-2.122 0-.739.185-1.2.277-1.384 1.938-.278 2.953-.555 4.06-.831 1.846-.462 2.584-1.476 2.676-3.783.278-5.537.278-16.058.185-23.348v-.185c0-.83 0-1.846-1.015-2.584-1.477-.922-3.23-1.752-5.537-2.4-.83-.275-1.384-.737-1.292-1.29 0-.554.554-1.2 1.754-1.385 3.045-.277 10.98-2.214 14.118-3.599.185.184.462.739.462 1.477l-.092 1.014c-.093 1.016-.185 2.216-.185 3.415 0 .369.37.646.738.646.185 0 .37-.092.554-.185 5.906-4.614 11.258-6.275 14.026-6.275 4.523 0 8.03 2.123 10.706 6.552.184.278.369.37.646.37.184 0 .46-.092.553-.277 5.445-4.153 10.89-6.645 14.488-6.645 8.582 0 13.658 6.368 13.658 17.165 0 3.045 0 7.013-.092 10.613 0 3.229-.092 6.182-.092 8.305 0 .46.645 1.937 1.66 2.214 1.292.646 3.046.923 5.353 1.292h.092c.185.646-.184 3.045-.553 3.507-.554 0-1.385 0-2.307-.092a136.208 136.208 0 0 0-7.014-.185c-5.721 0-8.674.092-11.536.277-.183-.738-.276-2.953 0-3.507 1.662-.276 2.492-.554 3.508-.83 1.846-.554 2.307-1.385 2.4-3.784 0-1.753.368-16.703-.186-20.302-.553-3.691-3.322-8.028-9.413-8.028-2.307 0-5.905.923-9.412 3.598-.184.185-.37.646-.37.923v.093c.37 1.937.37 4.153.37 7.567v5.998c0 4.153-.093 8.029 0 10.981 0 2.031 1.2 2.492 2.215 2.862.554.091.922.184 1.384.276.83.185 1.661.37 2.953.646.185.37.185 1.569-.092 2.584-.093.554-.278.83-.37.923-3.137-.092-6.367-.185-11.073-.185-1.384 0-3.784.093-5.814.093-1.662 0-3.23.092-4.152.092-.093-.185-.278-.83-.278-1.846 0-.83.185-1.476.37-1.661.461-.092.83-.184 1.292-.184 1.106-.185 2.03-.37 2.952-.554 1.57-.461 2.123-1.292 2.215-3.322.277-4.614.554-17.81-.092-21.133-1.107-5.352-4.152-8.028-9.044-8.028-2.86 0-6.46 1.384-9.412 3.6-.462.368-.831 1.29-.831 2.121v5.445c0 6.644 0 14.95.092 18.549.093 1.106.461 2.399 2.584 2.86.462.092 1.2.277 2.123.37l1.66.276c.186.554.093 2.769-.276 3.507-.923 0-2.03-.092-3.323-.092-1.937-.093-4.429-.185-7.197-.185-3.23 0-5.537.092-7.383.185-1.292-.185-2.307-.185-3.414-.185z" fill="#442D22"/><path d="M35.053 142.317l-3.783-1.293s.462-19.286-6.46-20.67c-4.613-5.353.74-227.013 17.35-.739 0 0-5.722 2.86-6.737 7.752-1.108 4.799-.37 14.95-.37 14.95z" fill="#FFF"/><path d="M35.053 142.317l-3.783-1.293s.462-19.286-6.46-20.67c-4.613-5.353.74-227.013 17.35-.739 0 0-5.722 2.86-6.737 7.752-1.108 4.799-.37 14.95-.37 14.95z" fill="#A6A385"/><path d="M37.084 123.676s33.13-21.779 25.377-67.09c-7.474-32.943-25.1-43.74-27.038-47.893C33.301 5.74 31.27.573 31.27.573l1.385 91.634c0 .093-2.861 28.054 4.43 31.47" fill="#FFF"/><path d="M37.084 123.676s33.13-21.779 25.377-67.09c-7.474-32.943-25.1-43.74-27.038-47.893C33.301 5.74 31.27.573 31.27.573l1.385 91.634c0 .093-2.861 28.054 4.43 31.47" fill="#499D4A"/><path d="M29.333 124.875S-1.767 103.65.079 66.277C1.832 28.903 23.795 10.539 28.04 7.217c2.769-2.953 2.861-4.061 3.046-7.014 1.938 4.153 1.569 62.106 1.845 68.934.83 26.3-1.476 50.756-3.598 55.738z" fill="#FFF"/><path d="M29.333 124.875S-1.767 103.65.079 66.277C1.832 28.903 23.795 10.539 28.04 7.217c2.769-2.953 2.861-4.061 3.046-7.014 1.938 4.153 1.569 62.106 1.845 68.934.83 26.3-1.476 50.756-3.598 55.738z" fill="#58AA50"/></g></svg>
)

export default Page
