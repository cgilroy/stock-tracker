import StockChart from './StockChart.js'
import MyStocks from './MyStocks'
export default (props) => {
  const symbol = "HMMJ.TO"
  console.log('app props',props)
  return(
    <div>
      <MyStocks
        transactions={props.transactions}
        deleteStock={props.deleteStock}
        showAddTransForm={props.showAddTransForm}
      />

    </div>
  )
}

const AddTransactionModal = ({handleClose, handleSubmit, show}) => {
  const [showModal, setShowModal] = useState(false)
  const [stockName, setStockName] = useState()
  const [buyDate, setBuyDate] = useState()
  const [buyQty, setBuyQty] = useState()
  const [buyFee, setBuyFee] = useState()

  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className="add-trans-modal">
      <form onSubmit={handleSubmit} accept-charset="UTF-8">
        <label>
          Stock:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}
