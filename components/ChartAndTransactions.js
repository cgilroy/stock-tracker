import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
const ChartAndTransactions = (props) => {
  const currentPrice = parseFloat(props.data[props.data.length-1][1]['4. close'])
  return (
    <div className="stock-wrapper">
      <div className="stock-div">
        <div style={{display:'flex',alignItems:'center'}}>
          <h2 style={{fontWeight:'lighter'}}>{props.stock}</h2>
          <h2 style={{marginLeft:'10px'}}>${currentPrice.toFixed(2)}</h2>
        </div>
        <Chart data={props.data} />
        <StocksTable data={props.data} showAddTransForm={() => props.showAddTransForm(props.stock,currentPrice.toFixed(2))} stock={props.stock} deleteStock={props.deleteStock} transactions={props.transactions} />
      </div>
      <style jsx>{`
        .stock-div {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 8px;
          height: 500px;
          overflow-y: scroll;
          border: 1px solid #dfe1e5;
        }
        .stock-wrapper {
          width: 50%;
          padding: 10px;
          box-sizing: border-box;
          background: white;
        }
      `}</style>
    </div>
  )

}

const StocksTable = (props) => {
  var allTransactions = []
  var groupTotalTransactions = []
  var totaledDataRows = []
  var transactionDataRows = []
  const uuidv1 = require('uuid/v1')
  var totals = {
    totQty: 0,
    totFees: 0,
    totalValue: 0,
    totDividends: 0
  }

  const currentPrice = props.data[props.data.length-1][1]['4. close']
  // const currentPrice = 23.4

  for (const [index, txn] of props.transactions.entries()) {
    let transRow = (
      <tr key={index}>
        <td>{txn.buyDate}</td>
        <td>{txn.buyPrice}</td>
        <td>{txn.buyQty}</td>
        <td>{txn.buyFee}</td>
        <td>{txn.totalValue}</td>
        <td onClick={() => props.deleteStock(txn.id)}/>
      </tr>
    )
    transactionDataRows.push(transRow)
    totals.totQty+=txn.buyQty
    totals.totFees+=txn.buyFee
    totals.totalValue+=txn.totalValue
  }

  var totDiv = 0
  for (let entry of props.data) {
    if (entry[1]["7. dividend amount"] !== "0.0000") {
      // console.log('notzero')
      let totQty = 0
      let divQty = 0 //number of shares included in div calc
      for (let txn of props.transactions) {
        totQty+=txn.buyQty
        if (txn.buyDate <= entry[0]) {
          divQty+=txn.buyQty
          // shares owned before or on date of dividend payment
          totDiv+=(txn.buyQty*entry[1]["7. dividend amount"])
        }
      }
    }
  }

  const summaryData = {
    capitalGain: (currentPrice*totals.totQty - totals.totalValue),
    totalDividends: totDiv,
    totalReturn: currentPrice*totals.totQty - totals.totalValue + totDiv
  }

  const summaryTable = (
    <table>
      <thead>
        <tr>
          <th>Capital Gain</th>
          <th>Dividends</th>
          <th>Total Return</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{summaryData.capitalGain.toFixed(2)}</td>
          <td>{summaryData.totalDividends.toFixed(2)}</td>
          <td>{summaryData.totalReturn.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  )

  const transactionsTable = (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Buy Price</th>
          <th>Qty</th>
          <th>Fee</th>
          <th>Value</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {transactionDataRows}
      </tbody>
    </table>
  )

  return (
    <div>
      {summaryTable}
      <div style={{display:'flex',alignItems:'center'}}>
        <h2>Trades</h2>
        <div className='add-button' onClick={props.showAddTransForm}><span>+ Add New Trade</span></div>
      </div>
      {transactionsTable}
      <style jsx>{`
        .add-button {
          width: 150px;
          height: 30px;
          background-color: #449bf7;

           border-radius: 5px;
           align-items:center;
           display: flex;
           justify-content: center;
           cursor: pointer;
           font-size: 16px;
           color: white;
           text-align: center;
           margin-left: 10px;
           box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
           transition: all 0.3s cubic-bezier(.25,.8,.25,1);

        }

        .add-button:hover {
          background-color: #4081fb;
           box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
      `}</style>
    </div>
  )
}

const Chart = (props) => {
  const [activeChartRange, setActiveChartRange] = useState("YEAR")
  const [dataRange, setDataRange] = useState(200)
  var moment = require('moment')
  const dateRanges = {
    WEEK: 7,
    THIRTYDAYS: 30,
    YEAR: 365
  }

  const getDateArrayLength = (days) => {
    // console.log('days',days)
    const targetDay = moment().subtract(days, 'days').format("YYYY-MM-DD")
    // console.log(targetDay,'targetDay')
    var dayIndex = 0
    const reverseData = props.data.slice().reverse()
    // console.log(allData,'alldata')

    for (let day of reverseData) {
      if (day[0] < targetDay) {
        // console.log(dayIndex,'dayIndex')
        setDataRange(dayIndex)
        return
      } else if (dayIndex >= reverseData.length-1) {
        setDataRange(0)
      } else {
        ++dayIndex
      }
    }
  }
  // console.log(activeChartRange,'activeChartRange')
  return(
    <div className="chart">
      <div className="chart-buttons">
        <div className={`chart-buttons__button ${activeChartRange === 'WEEK' ? 'chart-buttons__button-active' : ''}`} onClick={() => {getDateArrayLength(dateRanges['WEEK']);setActiveChartRange('WEEK')}}>WEEK</div>
        <div className={`chart-buttons__button ${activeChartRange === 'THIRTYDAYS' ? 'chart-buttons__button-active' : ''}`} onClick={() => {getDateArrayLength(dateRanges['THIRTYDAYS']);setActiveChartRange('THIRTYDAYS')}}>30 DAYS</div>
        <div className={`chart-buttons__button ${activeChartRange === 'YEAR' ? 'chart-buttons__button-active' : ''}`} onClick={() => {getDateArrayLength(dateRanges['YEAR']);setActiveChartRange('YEAR')}}>YEAR</div>
      </div>
      <Chartist activeRange={activeChartRange} data={props.data.slice(-dataRange)} chartType='stock' />
      <style jsx>{`
        .chart-buttons{
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .chart-buttons__button {
          padding: 5px;
          margin: 5px;
        }
        .chart-buttons__button-active{
          background: #eee
        }
      `}</style>
    </div>
  )
}

export default ChartAndTransactions
