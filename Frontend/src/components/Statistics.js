import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [month, setMonth] = useState('3'); // Default to March
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = async (selectedMonth) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/statistics', {
        params: {
          month: selectedMonth,
        },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to fetch statistics');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatistics(month);
  }, [month]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="statistics-box">
      <h2>
        Statistics - {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
      </h2>
      <div className="controls">
        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <div className="statistics-content">
        <div className="stat-item">
          <span>Total sale</span>
          <span>{statistics.totalSaleAmount}</span>
        </div>
        <div className="stat-item">
          <span>Total sold items</span>
          <span>{statistics.totalSoldItems}</span>
        </div>
        <div className="stat-item">
          <span>Total not sold items</span>
          <span>{statistics.totalNotSoldItems}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
