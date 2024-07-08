const mongoose = require('mongoose')
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoURI = "mongodb+srv://atharva:2RMCXMUmRQpppOEp@cluster0.xbd5dml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Transaction = require('./Models/Transaction');
const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully!");
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
  
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);
  
    console.log('Database seeded!');
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongo;
