import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
const ChartAndTransactions = (props) => {

  return (
    <div>
      <StocksTable stock={props.stock} transactions={props.transactions} />
      <Chartist data={props.data} />
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
      totalValue: 0
    }
    for (let j of props.transactions) {
      let transRow = (
        <tr key={j.buyDate}>
          <td>{j.buyDate}</td>
          <td>{j.buyPrice}</td>
          <td>{j.buyQty}</td>
          <td>{j.buyFee}</td>
          <td>{j.totalValue}</td>
        </tr>
      )
      transactionDataRows.push(transRow)
      totals.totQty+=j.buyQty
      totals.totFees+=j.buyFee
      totals.totalValue+=j.totalValue
    }
    let summaryTable = (
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
            <td>{totals.totQty}</td>
            <td>{totals.totFees}</td>
            <td>{totals.totalValue }</td>
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

export default ChartAndTransactions
