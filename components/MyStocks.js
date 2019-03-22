import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
import ChartAndTransactions from './ChartAndTransactions.js'
const MyStocks = () => {
  const [priceHistoyArray, setPriceHistoryArray] = useState()
  const [stockSections, setStockSections] = useState()
  const [summarySection, setSummarySection] = useState()
  const purchasesArray = {
    "HMMJ.TO": [{
      buyDate: '2017-11-14',
      buyPrice: 12.7801,
      buyQty: 101,
      buyFee: 0.35,
      totalValue: 1291.14
    },
    {
      buyDate: '2019-01-05',
      buyPrice: 19.88,
      buyQty: 1,
      buyFee: 0,
      totalValue: 19.88
    }],
    "LOLA.TO": [{
      buyDate: '2018-11-07',
      buyPrice: 13,
      buyQty: 34,
      buyFee: 5,
      totalValue: 447
    },
    {
      buyDate: '2019-01-09',
      buyPrice: 50,
      buyQty: 10,
      buyFee: 3.50,
      totalValue: 503.50
    },
    {
      buyDate: '2018-02-22',
      buyPrice: 1000,
      buyQty: 4,
      buyFee: 4,
      totalValue: 3996
    }]
  };
  useEffect(
    () => {
      var priceDataPromises = []
      for (let stock in purchasesArray) {
        console.log(stock,'stock')
        let apiString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo'
        priceDataPromises.push(
          fetch(apiString).then(results => results.json()).then(json => {
            var entries = Object.entries(json["Time Series (Daily)"]);
            entries.reverse()
            console.log('stock',stock)
            return {stock: stock, transactions: purchasesArray[stock], data: entries}

          })
        )
      }
      Promise.all(priceDataPromises).then(data => {
        var stockChartsAndTransactions = data.map(stockData => {
          console.log('stockEntries',stockData.data)
          console.log('stockData',stockData)
          return (<ChartAndTransactions stock={stockData.stock} transactions={stockData.transactions} data={stockData.data} />)
        })
        setStockSections(stockChartsAndTransactions)
      })
    },
    []
  )

  return (
    <div>
      <h1>Holdings</h1>
      {stockSections}
    </div>
  )

}

const StocksTables = (props) => {
  console.log('stockstables',props.purchases)
  var allTransactions = []
  var groupTotalTransactions = []
  var totaledDataRows = []
  var transactionDataRows = []
  for (let i in props.purchases) {
    var totals = {
      totQty: 0,
      totFees: 0,
      totalValue: 0
    }
    for (let j of props.purchases[i]) {
      let transRow = (
        <tr key={j.buyDate}>
          <td>{i}</td>
          <td>{j.buyDate}</td>
          <td>{j.buyPrice}</td>
          <td>{j.buyQty}</td>
          <td>{j.buyFee}</td>
          <td>{j.totalValue}</td>
        </tr>
      )
      console.log(j.totalValue,'totalval')
      transactionDataRows.push(transRow)
      totals.totQty+=j.buyQty
      totals.totFees+=j.buyFee
      totals.totalValue+=j.totalValue
    }
    let totalRow = (
      <tr>
        <td>{i}</td>
        <td>{totals.totQty}</td>
        <td>{totals.totFees}</td>
        <td>{totals.totalValue.toFixed(2)}</td>
      </tr>
    )
    totaledDataRows.push(totalRow)
  }

  const transactionsTable = (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
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

  const summaryTable = (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Total Qty</th>
          <th>Total Fees</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        {totaledDataRows}
      </tbody>
    </table>
  )

  return (
    <div>
      <h1>Stock Summary</h1>
      {summaryTable}
      <h1>All Transactions</h1>
      {transactionsTable}
    </div>
  )
}

export default MyStocks
