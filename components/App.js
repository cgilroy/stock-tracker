import MyStocks from './MyStocks'
export default (props) => {
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
