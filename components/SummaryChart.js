import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
const SummaryChart = (props) => {
  // console.log('portdata',getPortfolioData(props.data))
  return (
    <div className="summary-section">
      <h2>SUMMARY</h2>
      <Chart data={getPortfolioData(props.data)} />
      <style jsx>{`
        .summary-section {
          color: #262626;
        }
      `}</style>
    </div>
  )

}

const getPortfolioData = (allData) => {
  // allData = props.data
  var allHoldingsData = []
  for (let holding of allData) {
    var totVals = []
    // console.log(holding,'holding')
    for (let entry of holding["data"]) {
      // let totQty = 0
      var totValForEntry = 0
      for (let txn of holding["transactions"]) {
        // totQty+=txn.buyQty
        if (txn.buyDate <= entry[0]) {
          // shares owned before or on date

          // console.log(entry[0],'entrydata')
          totValForEntry+=(txn.buyQty*entry[1]["4. close"])
          // console.log(totValForEntry,'totValForEntry')
        }
      }
      totVals.push({date: entry[0], holdingValue: totValForEntry})
    }
    allHoldingsData.push(totVals)
  }
  var cumulativeHoldingsData = []
  for (let i = 0;i<=allHoldingsData[0].length-1;i++) {
    var dayTotal = 0
    var date=allHoldingsData[0][i].date
    for (let stock of allHoldingsData) {
      dayTotal+=stock[i].holdingValue
    }
    cumulativeHoldingsData.push({date: date,totalHoldings:dayTotal})
  }
  console.log(allHoldingsData,'allHoldingsData')
  console.log(cumulativeHoldingsData,'cumulative')
  return cumulativeHoldingsData
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

  const currentPrice = props.data[props.data.length-1][1]['4. close']
  // const currentPrice = 23.4

  // for (let txn of props.transactions) {
  //   let transRow = (
  //     <tr key={txn.buyDate}>
  //       <td>{txn.buyDate}</td>
  //       <td>{txn.buyPrice}</td>
  //       <td>{txn.buyQty}</td>
  //       <td>{txn.buyFee}</td>
  //       <td>{txn.totalValue}</td>
  //     </tr>
  //   )
  //   transactionDataRows.push(transRow)
  //   totals.totQty+=txn.buyQty
  //   totals.totFees+=txn.buyFee
  //   totals.totalValue+=txn.totalValue
  // }

  var totVal = 0
  for (let entry of props.data[0]["data"]) {
    let totQty = 0
    let incQty = 0 //number of shares included in value calc
    for (let txn of props.data[0]["transactions"]) {
      totQty+=txn.buyQty
      if (txn.buyDate <= entry[0]) {
        incQty+=txn.buyQty
        // shares owned before or on date
        totVal+=(txn.buyQty*entry[1]["4. close"])
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

  return (
    <div>
      {summaryTable}
    </div>
  )
}
const Chart = (props) => {
  const [activeChartRange, setActiveChartRange] = useState("THIRTYDAYS")
  const [dataRange, setDataRange] = useState(30)
  var moment = require('moment')
  const dateRanges = {
    WEEK: 7,
    THIRTYDAYS: 30,
    YEAR: 365
  }
  console.log('summarycharthere',props)

  const getDateArrayLength = (days) => {
    // console.log('days',days)
    const targetDay = moment().subtract(days, 'days').format("YYYY-MM-DD")
    console.log(targetDay,'targetDay')
    var dayIndex = 0
    const reverseData = props.data.slice().reverse()
    // console.log(allData,'alldata')

    for (let day of reverseData) {
      if (day.date < targetDay) {
        console.log(dayIndex,'dayIndex')
        setDataRange(dayIndex)
        return
      } else if (dayIndex >= reverseData.length-1) {
        setDataRange(0)
      } else {
        ++dayIndex
      }
    }
  }
  console.log(-dataRange,'dataRange')
  console.log(props.data.slice(-dataRange),'activeChartRange')
  return(
    <div className="summary-chart">
      <div className="chart-buttons">
        <div className={`chart-buttons__button ${activeChartRange === 'WEEK' ? 'chart-buttons__button-active' : ''}`} onClick={() => {getDateArrayLength(dateRanges['WEEK']);setActiveChartRange('WEEK')}}>WEEK</div>
        <div className={`chart-buttons__button ${activeChartRange === 'THIRTYDAYS' ? 'chart-buttons__button-active' : ''}`} onClick={() => {getDateArrayLength(dateRanges['THIRTYDAYS']);setActiveChartRange('THIRTYDAYS')}}>30 DAYS</div>
        <div className={`chart-buttons__button ${activeChartRange === 'YEAR' ? 'chart-buttons__button-active' : ''}`} onClick={() => {getDateArrayLength(dateRanges['YEAR']);setActiveChartRange('YEAR')}}>YEAR</div>
      </div>
      <Chartist activeRange={activeChartRange} data={props.data.slice(-dataRange)} chartType='summary' />
      <style jsx>{`
        .chart-buttons {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dfe1e5;
        }
        .chart-buttons__button {
          padding: 5px;
          border-radius: 3px;
          margin: 5px;
        }
        .chart-buttons__button-active{
          background: #eee
        }
      `}</style>
    </div>
  )
}

export default SummaryChart
