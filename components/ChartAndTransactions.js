import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
const ChartAndTransactions = (props) => {

  return (
    <div>
      <StocksTable data={props.data} stock={props.stock} transactions={props.transactions} />
      <Chart data={props.data} />
    </div>
  )

}

const StocksTable = (props) => {
  var allTransactions = []
  var groupTotalTransactions = []
  var totaledDataRows = []
  var transactionDataRows = []
  var totals = {
    totQty: 0,
    totFees: 0,
    totalValue: 0,
    totDividends: 0
  }

  // const currentPrice = props.data[props.data.length-1][1]['4. close']
  const currentPrice = 23.4

  for (let txn of props.transactions) {
    let transRow = (
      <tr key={txn.buyDate}>
        <td>{txn.buyDate}</td>
        <td>{txn.buyPrice}</td>
        <td>{txn.buyQty}</td>
        <td>{txn.buyFee}</td>
        <td>{txn.totalValue}</td>
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
      console.log('notzero')
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
        </tr>
      </thead>
      <tbody>
        {transactionDataRows}
      </tbody>
    </table>
  )

  return (
    <div>
      <h2>{props.stock}</h2>
      {summaryTable}
      <h2>Trades</h2>
      {transactionsTable}
    </div>
  )
}
const Chart = (props) => {
  const [dataRange, setDataRange] = useState(7)
  var moment = require('moment')
  const dateRanges = {
    WEEK: 7,
    THIRTYDAYS: 30,
    YEAR: 365
  }
  const getDateArrayLength = (days) => {
    console.log('days',days)
    const targetDay = moment().subtract(days, 'days').format("YYYY-MM-DD")
    console.log(targetDay,'targetDay')
    var dayIndex = 0
    const allData = props.data
    console.log(allData,'alldata')
    allData.reverse()
    for (let day of allData) {
      console.log('day',day[0])
      if (day[0] < targetDay) {
        console.log(dayIndex,'dayIndex')
        setDataRange(dayIndex)
      } else {
        ++dayIndex
      }
    }
  }



  console.log('render')
  return(
    <div>
      <div>
        <div onClick={() => getDateArrayLength(dateRanges['WEEK'])}>WEEK</div>
        <div onClick={() => getDateArrayLength(dateRanges['THIRTYDAYS'])}>30 DAYS</div>
        <div onClick={() => getDateArrayLength(dateRanges['YEAR'])}>YEAR</div>
      </div>
      <Chartist data={props.data.slice(-dataRange)} />
    </div>
  )
}

export default ChartAndTransactions
