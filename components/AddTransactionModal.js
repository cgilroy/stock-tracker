import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { formatMoney } from '../components/helpers.js'
const uuid = require('uuid/v1')

const AddTransactionModal = ({handleClose, handleSubmit, handleEdit, handleDelete, stock, price, fee, date, qty, isEdit, id}) => {
  var moment = require('moment')

  stock = stock || 'MSFT'
  price = price || ''
  fee = fee || ''
  date = date || moment().format("YYYY-MM-DD")
  qty = qty || ''
  isEdit = isEdit || false
  const [stockName, setStockName] = useState(stock)
  const [buyDate, setBuyDate] = useState(date)
  const [buyQty, setBuyQty] = useState(qty)
  const [buyFee, setBuyFee] = useState(fee)
  const [buyPrice, setBuyPrice] = useState(price)

  const handleSubmitClick = (event) => {
    event.preventDefault();
    const submitFee = buyFee || 0
    let newTrans = {
      "id": uuid(),
      "tickerSymbol": stockName,
      "buyDate": moment(buyDate).format("YYYY-MM-DD"),
      "buyPrice": buyPrice,
      "buyQty": buyQty,
      "buyFee": buyFee,
      "totalValue": parseFloat(((buyQty*buyPrice)+submitFee).toFixed(2))
    }
    const optimized = JSON.stringify(newTrans)
    handleSubmit(newTrans)
  }

  const handleEditClick = (event) => {
    event.preventDefault();
    const submitFee = buyFee || 0
    let newTrans = {
      "id": id,
      "tickerSymbol": stockName,
      "buyDate": moment(buyDate).format("YYYY-MM-DD"),
      "buyPrice": buyPrice,
      "buyQty": buyQty,
      "buyFee": buyFee,
      "totalValue": parseFloat(((buyQty*buyPrice)+submitFee).toFixed(2))
    }
    const optimized = JSON.stringify(newTrans)
    handleEdit(newTrans)
  }

  const handleDeleteClick = (event) => {
    handleDelete(id)
  }

  var totalPrice = () => {
    const calcQty = buyQty || 0
    const calcPrice = buyPrice || 0
    const calcFee = buyFee || 0
    const val = formatMoney((calcQty*calcPrice)+calcFee)
    return val
  }
  let formTitle = (isEdit) ? 'Edit Transaction' : 'Add New Transaction'

  return (
    <div className="modal-wrapper">
      <div className="modal-body">
        <div className="modal-body__header">
          <span className="modal-wrapper__title">{formTitle}</span>
          <span className="exit-button" onClick={() => handleClose()}>&times;</span>
        </div>
        <div className="modal-body__form">
          <form onSubmit={isEdit ? (handleEditClick) : (handleSubmitClick)} acceptCharset="UTF-8">
            <div className="horizontal-entries" style={{justifyContent:'space-evenly'}}>
              <label className="modal-input">
                <span style={{marginRight:'5px'}}>Stock</span>
                <select value={stockName} onChange={(e) => setStockName(e.target.value)} disabled={isEdit ? true : false} required>
                  <option value="MSFT">MSFT</option>
                  <option value="AAPL">AAPL</option>
                  <option value="NFLX">NFLX</option>
                </select>
              </label>
              <label className="modal-input">
                <span style={{marginRight:'5px'}}>Date</span>
                <DatePicker
                    selected={buyDate}
                    onChange={(date) => setBuyDate(date)}
                    maxDate={new Date()}
                    className='date-input'
                />
              </label>
            </div>
            <div className="horizontal-entries" style={{marginTop:"15px"}}>
              <label className="modal-input">
                Quantity
                <input type="number" min="0" placeholder="0" value={buyQty} onChange={(e) => setBuyQty(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',color:'#7c899c',padding:'0 5px'}}>&times;</span>
              <label className="modal-input">
                Price
                <input type="number" min="0" step=".01" placeholder="0.00" value={buyPrice} onChange={(e) => setBuyPrice(parseFloat(e.target.value))} required/>
              </label>
              <span style={{verticalAlign:'middle',color:'#7c899c',padding:'0 5px'}}>&#43;</span>
              <label className="modal-input">
                Fees
                <input type="number" min="0" step=".01" placeholder="0.00" value={buyFee} onChange={(e) => setBuyFee(parseFloat(e.target.value))} />
              </label>
              <span style={{verticalAlign:'middle',color:'#7c899c',padding:'0 5px'}}>&#61;</span>
              <label className="modal-input modal-input__totalPrice">
                Total
                <span className="modal-input__finalPrice">${totalPrice()}</span>
              </label>
            </div>
            <div style={{display:'flex'}}>
              <input className="input-button" id="submit-button" type="submit" value={isEdit ? "Save" : "Submit"} />
              {isEdit && <input className="input-button" id="delete-button" onClick={handleDeleteClick} type="button" value="Delete" />}
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .modal-body {
          width: 90%;
          max-width: 810px;
          background: white;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        }
        .modal-body__header {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #449bf7;
          color: white;
          padding: 10px;
          box-sizing: border-box;
        }
        .modal-body__form {
          padding: 15px;
        }
        .exit-button {
          position: absolute;
          right: 0;
          color: white;
          transition: color 0.1s linear;
          cursor: pointer;
          padding: 5px;
          font-size: 25px;
          height: 20px;
          width: 20px;
          line-height: 20px;
          text-align: center;
        }
        .exit-button:hover {
          color: #357ebd;
        }
        .modal-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #00000050;
          z-index: 999999;
        }
        .modal-input {
          display: table-cell;
          text-align: center;
        }
        .modal-input input {
          width: 100%;
          max-width: 200px;
        }
        .entry-label {
         width: 100%;
        }
        .horizontal-entries {
          width: 100%;
          display: flex;
        }
        .horizontal-entries > span {
          display: table-cell;
        }
        .modal-body select {
          width: 200px;
        }
        .modal-body .input-button {
          width: 150px;
          border: none;
          border-radius: 5px;
          align-items:center;
          display: flex;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          color: white;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          transition: all 0.3s cubic-bezier(.25,.8,.25,1);
          margin-top: 40px;
        }
        .modal-body input, .modal-body select {
          color: #7c899c;
          border: 1px solid #ccc;
          box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
          padding: 10px 16px;
          height: 40px;
          font-size: 16px;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .modal-input__finalPrice {
          padding: 10px 16px;
          height: 40px;
          font-size: 16px;
          box-sizing: border-box;
          display: inline-block;
          min-width: 150px;
        }

        #submit-button {
          background-color: #62cc83;
        }
        #submit-button:hover {
          background-color: #5cbf7b;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        #delete-button {
          background-color: #f05b4f;
          margin-left: 20px;
        }
        #delete-button:hover {
          background-color: #d24e43;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        @media only screen and (max-width: 600px) {
          .modal-body {
            width: 100%;
            height: 100%;
          }
          .horizontal-entries {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
          }
          .horizontal-entries > span {
            display: none;
          }
          .modal-input {
            width: 100%;
            display: grid;
            text-align: left;
          }
          .modal-input input, .modal-input select {
            margin-top: 6px;
            margin-bottom: 10px;
            width: 100%;
          }
          .modal-input__totalPrice {
            text-align: center;
            background: #eee;
            padding: 5px;
          }

        }

      `}</style>
    </div>
  )
}

export default AddTransactionModal