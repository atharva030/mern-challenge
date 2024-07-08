import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('3');
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/transactions', {
        params: {
          page,
          perPage: 10,
          search,
        //   month,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search, month]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset to first page on month change
  };

  return (
    <div className="transaction-dashboard">
      <h1>Transaction Dashboard</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search transaction"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
                <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8">Loading...</td>
            </tr>
          ) : transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={(page - 1) * 10 + index + 1}>
                <td>{(page - 1) * 10 + index + 1}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                <td>
                  <img src={transaction.image} alt={transaction.title} width="50" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page No: {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={transactions.length < 10}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
