import StockChart from './StockChart.js'
import MyStocks from './MyStocks'
export default (props) => {
  const symbol = "HMMJ.TO"
  console.log('app props',props)
  return(<div><MyStocks transactions={props.transactions} deleteStock={props.deleteStock}/></div>)
}
