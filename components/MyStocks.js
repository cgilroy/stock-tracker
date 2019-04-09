import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
import ChartAndTransactions from './ChartAndTransactions.js'
import SummaryChart from './SummaryChart.js'
import {groupBy} from 'lodash'
const MyStocks = (props) => {
  const [priceHistoyArray, setPriceHistoryArray] = useState()
  const [stockSections, setStockSections] = useState()
  const [summarySection, setSummarySection] = useState()

  const purchasesArray = groupBy(props.transactions,"tickerSymbol")
  // console.log('checkthis',purchasesArray)
  const API_KEY = process.env.REACT_APP_ALPHAVANTAGE_API_KEY;
  useEffect(
    () => {
      var priceDataPromises = []
      for (let stock in purchasesArray) {
        // let apiString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=demo'
        let apiString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+stock+'&apikey='+API_KEY
        priceDataPromises.push(
          fetch(apiString).then(results => results.json()).then(json => {
            // console.log(json,'entries')
            var entries = Object.entries(json["Time Series (Daily)"]);
            entries.reverse()
            return {stock: stock, transactions: purchasesArray[stock], data: entries}

          })
        )
      }
      Promise.all(priceDataPromises).then(data => {
        var stockChartsAndTransactions = data.map((stockData,index) => {
          return (<ChartAndTransactions key={index} showAddTransForm={props.showAddTransForm} deleteStock={props.deleteStock} stock={stockData.stock} transactions={stockData.transactions} data={stockData.data} />)
        })
        var summaryChart = (<SummaryChart data={data} />)
        // console.log(data,'datahere')
        setSummarySection(summaryChart)
        setStockSections(stockChartsAndTransactions)
      })
    },
    [props.transactions]
  )
  // console.log('rerender mystocks')
  return (
    <div>
      {summarySection}
      <h2>MY HOLDINGS</h2>
      <div className="stock-sections">
        {stockSections}
      </div>
      <style jsx>{`
        .stock-sections {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
        }
        h2 {
          color: #262626;
        }
      `}</style>
    </div>
  )

}

const StocksTables = (props) => {
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
      // console.log(j.totalValue,'totalval')
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
  // console.log(transactionsTable,'mystocksrender')
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
