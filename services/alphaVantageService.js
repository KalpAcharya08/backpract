const axios = require('axios');
const StockData = require('../models/StockData');

const API_KEY = "D1D2LDS2J42I144O";
const BASE_URL = 'https://www.alphavantage.co/query';

const fetchStockData = async (symbol, interval = '15min') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
        apikey: API_KEY,
        outputsize: 'compact',
        datatype: 'json'
      }
    });

    const timeSeries = response.data[`Time Series (${interval})`];
    const processedData = Object.entries(timeSeries).map(([timestamp, values]) => ({
      symbol,
      timestamp: new Date(timestamp),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseFloat(values['5. volume']),
      interval
    }));

    // Save to database
    await StockData.insertMany(processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

module.exports = {
  fetchStockData
};