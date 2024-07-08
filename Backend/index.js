const connectToMongo = require('./db')
connectToMongo();

const express = require('express')
const app = express()
const port = 5000
const Transaction=require('./Models/Transaction')

const cors = require('cors')
const router = require('./Routes/router')

app.use(cors());
app.use(express.json());
app.use(router);
app.get('/transactions', async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    let filter = {};

    // Handle month filtering if provided
    if (month) {
      const monthNumber = parseInt(month, 10);
      filter.dateOfSale = {
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, monthNumber]
        }
      };
    }
    let searchConditions = [];

    // Handle search based on title, description, or price
    if (search) {
      searchConditions = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: parseFloat(search) || 0 }
      ];
    }

    console.log('Filter:', filter);
    console.log('Search Conditions:', searchConditions);

    // Query transactions based on filter and search conditions
    const transactions = await Transaction.find({
      ...filter,
      $or: searchConditions.length > 0 ? searchConditions : [{}]
    })
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    console.log('Transactions:', transactions);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Server error');
  }
});
app.get('/statistics', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    const monthNumber = parseInt(month, 10);

    // Aggregate to get total sale amount in the specified month
    const totalSaleAmount = await Transaction.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' } // Extract month from dateOfSale field
        }
      },
      {
        $match: {
          month: monthNumber
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    // Count sold and not sold items in the specified month
    const totalSoldItems = await Transaction.countDocuments({ sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ sold: false });

    // Send JSON response with computed statistics
    res.json({
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('Server error');
  }
});
app.get('/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    const monthNumber = parseInt(month, 10);

    // Aggregate to count documents in each price range for the specified month, regardless of year
    const result = await Transaction.aggregate([
      {
        $addFields: {
          month: { $month: '$dateOfSale' } // Extract month from dateOfSale field
        }
      },
      {
        $match: {
          month: monthNumber,
          price: { $exists: true } // Ensure price field exists
        }
      },
      {
        $group: {
          _id: {
            range: {
              $switch: {
                branches: [
                  { case: { $and: [{ $gte: ['$price', 0] }, { $lt: ['$price', 100] }] }, then: '0-100' },
                  { case: { $and: [{ $gte: ['$price', 100] }, { $lt: ['$price', 200] }] }, then: '101-200' },
                  { case: { $and: [{ $gte: ['$price', 200] }, { $lt: ['$price', 300] }] }, then: '201-300' },
                  { case: { $and: [{ $gte: ['$price', 300] }, { $lt: ['$price', 400] }] }, then: '301-400' },
                  { case: { $and: [{ $gte: ['$price', 400] }, { $lt: ['$price', 500] }] }, then: '401-500' },
                  { case: { $and: [{ $gte: ['$price', 500] }, { $lt: ['$price', 600] }] }, then: '501-600' },
                  { case: { $and: [{ $gte: ['$price', 600] }, { $lt: ['$price', 700] }] }, then: '601-700' },
                  { case: { $and: [{ $gte: ['$price', 700] }, { $lt: ['$price', 800] }] }, then: '701-800' },
                  { case: { $and: [{ $gte: ['$price', 800] }, { $lt: ['$price', 900] }] }, then: '801-900' },
                  { case: { $gte: ['$price', 900] }, then: '901-above' }
                ],
                default: 'Unknown'
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          range: '$_id.range',
          count: 1
        }
      }
    ]);

    // Send JSON response with computed data for the bar chart
    res.json(result);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).send('Server error');
  }
});

app.get('/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    const monthNumber = parseInt(month, 10);

    // Filter to match transactions within the specified month
    const filter = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNumber]
      }
    };

    // Aggregate to group transactions by category and count occurrences
    const result = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } } // Rename _id to category
    ]);

    // Send JSON response with computed data for the pie chart
    res.json(result);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).send('Server error');
  }
});
// 5. Combined data
app.get('/combined', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    const monthNumber = parseInt(month, 10);


    // Fetch statistics for the specified month
    const statisticsResponse = await fetch(`http://localhost:5000/statistics?month=${monthNumber}`);
    const statistics = await statisticsResponse.json();

    // Fetch bar chart data for the specified month
    const barChartResponse = await fetch(`http://localhost:5000/bar-chart?month=${monthNumber}`);
    const barChart = await barChartResponse.json();

    // Fetch pie chart data for the specified month
    const pieChartResponse = await fetch(`http://localhost:5000/pie-chart?month=${monthNumber}`);
    const pieChart = await pieChartResponse.json();

    // Combine all fetched data into a single JSON response
    const combinedData = {
      statistics,
      barChart,
      pieChart
    };

    // Send JSON response with combined data
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


