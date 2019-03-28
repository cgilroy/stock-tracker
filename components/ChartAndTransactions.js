import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
const ChartAndTransactions = (props) => {
  const currentPrice = props.data[props.data.length-1][1]['4. close']
  return (
    <div className="stock-wrapper">
      <div className="stock-div">
        <h2>{props.stock}</h2>
        <h3>{currentPrice}</h3>
        <Chart data={props.data} />
        <div onClick={() => props.showAddTransForm()}>ADDtrans</div>
        <StocksTable data={props.data} stock={props.stock} deleteStock={props.deleteStock} transactions={props.transactions} />
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

  for (let txn of props.transactions) {
    let transRow = (
      <tr key={txn.buyDate}>
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
      <h2>Trades</h2>
      {transactionsTable}
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
