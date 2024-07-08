import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState('1'); // Default to January

  const priceRanges = [
    '0-100', '101-200', '201-300', '301-400', '401-500',
    '501-600', '601-700', '701-800', '801-900', '901-above'
  ];

  useEffect(() => {
    fetchData();
  }, [month]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/bar-chart?month=${month}`);
      const responseData = response.data;

      // Fill in missing ranges with count 0
      const filledData = priceRanges.map(range => {
        const item = responseData.find(d => d.range === range);
        return { range, count: item ? item.count : 0 };
      });

      setData(filledData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="chart-container">
      <h2>Transactions Bar Chart</h2>
      <select onChange={(e) => setMonth(e.target.value)} value={month}>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#00C49F" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
