import MyStocks from './MyStocks'
export default (props) => {
  const symbol = "HMMJ.TO"
  return(
    <div>
      <MyStocks
        transactions={props.transactions}
        deleteStock={props.deleteStock}
        showAddTransForm={props.showAddTransForm}
        contentLoaded={props.contentLoaded}
        storedPriceData={props.storedPriceData}
      />
    </div>
  )
}
