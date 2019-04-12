import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
import { formatMoney } from './helpers.js'
const SummaryChart = (props) => {
  // console.log('portdata',getPortfolioData(props.data))
  return (
    <div className="summary-section">
      <StocksTable data={getPortfolioData(props.data)} />
      <Chart data={getPortfolioData(props.data).cumulative} />
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
  var totalSpent = 0
  for (let holding of allData) {
    // console.log(holding,'holding')
      for (let txn of holding["transactions"]) {
        // totQty+=txn.buyQty
        totalSpent+=parseFloat(txn.totalValue)
    }
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
  return {cumulative: cumulativeHoldingsData, totalSpent: totalSpent}
}



const StocksTable = (props) => {
  console.log('summary we in',props)
  const currentPortfolioValue = props.data.cumulative[props.data.cumulative.length-1].totalHoldings

  const summaryData = {
    currentValue: formatMoney(currentPortfolioValue),
    totalReturn: formatMoney(currentPortfolioValue - props.data.totalSpent)
  }
  console.log(summaryData.totalReturn,'totalReturn')
  const totalReturnStyle = (parseFloat(summaryData.totalReturn) < 0) ? (
    {
      color: '#d23f31'
    }
  ) : (
    {
      color: '#0f9d58'
    }
  )

  const summaryTable = (
    <table>
      <thead>
        <tr>
          <th>Portfolio Value</th>
          <th>Capital Gain</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${summaryData.currentValue}</td>
          <td>${summaryData.totalReturn}</td>
        </tr>
      </tbody>
    </table>
  )

  return (
    <div style={{display:'flex',alignItems:'baseline'}}>
      <div className="summaryValue">
        <h2>${summaryData.currentValue}</h2>
        <span>CURRENT VALUE</span>
      </div>
      <div className="summaryValue">
        <h2 style={totalReturnStyle}>${summaryData.totalReturn}</h2>
        <span>TOTAL RETURN</span>
      </div>
      <style jsx>{`
        .summaryValue {
          display: block;
          margin-bottom: 15px;
          padding-right: 8px;
        }
        h2 {
          margin: 0;
        }
        span {
          color: #262626;
        }
      `}</style>
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
