import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
import ChartAndTransactions from './ChartAndTransactions.js'
import SummaryChart from './SummaryChart.js'
import {groupBy} from 'lodash'
const MyStocks = (props) => {
  const [priceHistoyArray, setPriceHistoryArray] = useState()
  const [stockSections, setStockSections] = useState()
  const [summarySection, setSummarySection] = useState()
  // const purchasesArray = {
  //   "HMMJ.TO": [{
  //     buyDate: '2017-11-14',
  //     buyPrice: 12.7801,
  //     buyQty: 101,
  //     buyFee: 0.35,
  //     totalValue: 1291.14
  //   },
  //   {
  //     buyDate: '2019-01-05',
  //     buyPrice: 19.88,
  //     buyQty: 1,
  //     buyFee: 0,
  //     totalValue: 19.88
  //   }],
  //   "XAW.TO": [{
  //     buyDate: '2017-11-14',
  //     buyPrice: 12.7801,
  //     buyQty: 101,
  //     buyFee: 0.35,
  //     totalValue: 1291.14
  //   },
  //   {
  //     buyDate: '2019-01-05',
  //     buyPrice: 19.88,
  //     buyQty: 1,
  //     buyFee: 0,
  //     totalValue: 19.88
  //   },
  //   {
  //     buyDate: '2018-11-25',
  //     buyPrice: 14.88,
  //     buyQty: 105,
  //     buyFee: 0,
  //     totalValue: 1562.40
  //   }],
  //   "VCN.TO": [{
  //     buyDate: '2017-11-14',
  //     buyPrice: 12.7801,
  //     buyQty: 101,
  //     buyFee: 0.35,
  //     totalValue: 1291.14
  //   },
  //   {
  //     buyDate: '2019-01-05',
  //     buyPrice: 19.88,
  //     buyQty: 1,
  //     buyFee: 0,
  //     totalValue: 19.88
  //   },
  //   {
  //     buyDate: '2018-11-25',
  //     buyPrice: 14.88,
  //     buyQty: 105,
  //     buyFee: 0,
  //     totalValue: 1562.40
  //   }]
  // };
  const purchasesArray = groupBy(props.transactions,"tickerSymbol")
  // console.log('checkthis',purchasesArray)
  const API_KEY = process.env.REACT_APP_ALPHAVANTAGE_API_KEY;
  useEffect(
    () => {
      var priceDataPromises = []
      for (let stock in purchasesArray) {
        let apiString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=demo'
        // let apiString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+stock+'&outputsize=full&apikey='+API_KEY
        priceDataPromises.push(
          fetch(apiString).then(results => results.json()).then(json => {
            var entries = Object.entries(json["Time Series (Daily)"]);
            entries.reverse()
            return {stock: stock, transactions: purchasesArray[stock], data: entries}

          })
        )
      }
      Promise.all(priceDataPromises).then(data => {
        var stockChartsAndTransactions = data.map(stockData => {
          return (<ChartAndTransactions showAddTransForm={props.showAddTransForm} deleteStock={props.deleteStock} stock={stockData.stock} transactions={stockData.transactions} data={stockData.data} />)
        })
        var summaryChart = (<SummaryChart data={data} />)
        console.log(data,'datahere')
        setSummarySection(summaryChart)
        setStockSections(stockChartsAndTransactions)
      })
    },
    [props.transactions]
  )
  console.log('rerender mystocks')
  return (
    <div>
      {summarySection}
      <h1>Holdings</h1>
      {stockSections}
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
  console.log(transactionsTable,'mystocksrender')
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
