import App from '../components/App.js'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
const Page = (serverTransactions) => {
  console.log(serverTransactions,'serverTransactions')
  const [transactions, setTransactions] = useState(serverTransactions.transactions)
  const deleteStock = (id) => {
    var newTransactions = transactions.slice()
    newTransactions = newTransactions.filter(( obj ) => (obj.id !== id))
    console.log('deletetrans',newTransactions)
    setTransactions(newTransactions)
    fetch(`http://localhost:4000/transactions/${id}`, {
        method: 'DELETE',
        body: newTransactions
      })

  }
  console.log(transactions,'yeahrender')
  return (
    <div>
      <Head>
        <title>Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <App transactions={transactions} deleteStock={deleteStock} />
    </div>
  )
}

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('http://localhost:4000/transactions')
  const json = await res.json()
  return { transactions: json }
}

export default Page
