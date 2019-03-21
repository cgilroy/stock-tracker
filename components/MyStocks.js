
const MyStocks = () => {
  const purchasesArray = {
    "HMMJ.TO": [{
      buyDate: '2017-11-14',
      buyPrice: 12.7801,
      buyQty: 101,
      buyFee: 0.35,
      totalValue: 1291.14
    },
    {
      buyDate: '2019-01-05',
      buyPrice: 19.88,
      buyQty: 1,
      buyFee: 0,
      totalValue: 19.88
    }],
    "LOLA.TO": [{
      buyDate: '2018-11-07',
      buyPrice: 13,
      buyQty: 34,
      buyFee: 5,
      totalValue: 447
    },
    {
      buyDate: '2019-01-09',
      buyPrice: 50,
      buyQty: 10,
      buyFee: 3.50,
      totalValue: 503.50
    },
    {
      buyDate: '2018-02-22',
      buyPrice: 1000,
      buyQty: 4,
      buyFee: 4,
      totalValue: 3996
    }]
  };

  console.log(purchasesArray)

  return <StocksTables purchases={purchasesArray} />

}

const StocksTables = (props) => {
  console.log(props.purchases)
  var allTransactions = []
  var groupTotalTransactions = []
  var totaledDataRows = []
  var transactionDataRows = []
  for (let i in props.purchases) {
    console.log(i,'i')
    var totals = {
      totQty: 0,
      totFees: 0,
      totalValue: 0
    }
    for (let j of props.purchases[i]) {
      console.log(j,'j')
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
        <td>{totals.totalValue}</td>
      </tr>
    )
    totaledDataRows.push(totalRow)
  }
  // for (let i in props.purchases) {
  //   console.log(i,'i')
  //   var tableDataRow = []
  //   for (let j of props.purchases[i]) {
  //     console.log(j,'j')
  //     let row = (
  //       <tr key={j.buyDate}>
  //         <td>{j.buyDate}</td>
  //         <td>{j.buyPrice}</td>
  //         <td>{j.buyQty}</td>
  //         <td>{j.buyFee}</td>
  //         <td>{j.totalValue}</td>
  //       </tr>
  //     )
  //     tableDataRows.push(row)
  //   }
  // }
  return (
    <div>
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
    </div>
  )
}

export default MyStocks
