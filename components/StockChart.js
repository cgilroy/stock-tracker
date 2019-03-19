import fetch from 'isomorphic-unfetch'
import {useState, useEffect} from 'react'
import LineChart from './LineChart.js'
import Chartist from './Chartist.js'
const StockChart = (props) => {
  const [allData, setAllData] = useState()
  const [coordinates, setCoordinates] = useState()
  const [lineChart, setLineChart] = useState()
  const API_KEY = process.env.REACT_APP_ALPHAVANTAGE_API_KEY;
  let apiString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+props.symbol+'&apikey='+API_KEY
  useEffect(() => {
      fetch(apiString).then(results => results.json()).then(json => {
        var entries = Object.entries(json["Time Series (Daily)"]);
        console.log(Object.entries(entries))
        setAllData(entries)
        entries.reverse()
        var tempCoordinates = []
        var xData = []
        var yData = []
        var xIter = 1;
        for (let dayData of entries) {
          tempCoordinates.push(
            {x:xIter,y:parseFloat(dayData[1]["4. close"])}
          )
          xData.push(dayData[0])
          yData.push(parseFloat(dayData[1]["4. close"]))
          xIter++;
        }
        // setCoordinates(tempCoordinates)
        // setLineChart(<LineChart data={tempCoordinates} />)
        setLineChart(<Chartist x={xData} y={yData} />)
      })
    },
    []
  )


  return(
    <div>
      {lineChart}
    </div>
  )
}

export default StockChart
