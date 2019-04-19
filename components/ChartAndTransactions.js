import { useState,useEffect } from 'react'
import Chartist from './Chartist.js'
import { formatMoney } from './helpers.js'
const ChartAndTransactions = (props) => {
  const currentPrice = parseFloat(props.data[props.data.length-1][1]['4. close'])
  return (
    <div className="stock-wrapper">
      <div className="stock-div">
        <div style={{display:'flex',alignItems:'center'}}>
          <h2 style={{fontWeight:'lighter',marginTop:'0'}}>{props.stock}</h2>
          <h2 style={{marginLeft:'10px',marginTop:'0'}}>${formatMoney(currentPrice)}</h2>
        </div>
        <Chart data={props.data} />
        <StocksTable data={props.data} showAddTransForm={props.showAddTransForm} stock={props.stock} deleteStock={props.deleteStock} transactions={props.transactions} />
      </div>
      <style jsx>{`
        .stock-div {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 8px;
          height: 500px;
          overflow-y: auto;
          border: 1px solid #dfe1e5;
          background: white;
        }
        .stock-wrapper {
          width: 50%;
          padding: 10px;
          box-sizing: border-box;
          background: none;
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
        <td>${formatMoney(txn.buyPrice)}</td>
        <td>{txn.buyQty}</td>
        <td>${formatMoney(txn.buyFee)}</td>
        <td>${formatMoney(txn.totalValue)}</td>
        <td><div className="editButton" style={{width:'20px',height:'20px',margin:'0 auto'}} onClick={() => props.showAddTransForm(props.stock,txn.buyPrice,txn.buyFee,txn.buyDate,txn.buyQty,true,txn.id)}>{editSVG}</div></td>
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
          <td>${formatMoney(summaryData.capitalGain)}</td>
          <td>${formatMoney(summaryData.totalDividends)}</td>
          <td>${formatMoney(summaryData.totalReturn)}</td>
        </tr>
      </tbody>
    </table>
  )

  const transactionsTable = (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Buy Price</th>
          <th>Qty</th>
          <th>Fee</th>
          <th>Value</th>
          <th></th>
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
        <h3 style={{fontWeight:'lighter'}}>TRADES</h3>
        <div className='add-button' onClick={() => props.showAddTransForm(props.stock,parseFloat(currentPrice).toFixed(2))}><span>+ Add New Trade</span></div>
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
        }
        .chart-buttons__button {
          padding: 5px;
          margin: 5px;
          cursor: pointer;
        }
        .chart-buttons__button-active{
          background: #eee
        }
      `}</style>
    </div>
  )
}

const editSVG = (

<svg viewBox="0 -1 401.52289 401" height="20px" width='20px' xmlns="http://www.w3.org/2000/svg"><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0"/></svg>
)

export default ChartAndTransactions
