const StockData = require('../models/StockData');
const alphaVantageService = require('../services/alphaVantageService'); 
const TechnicalIndicators = require('../services/technicalIndicators');

const getStockData = async (requestAnimationFrame, res)=>{
    try{
        const {symbol, interval,indicators} = req.query;

        await alphaVantageService.fetchStockData(symbol, interval);

        const data = await StockData.find({symbol, interval}).sort({timestamp: 1}).limit(100);

        let processedData = [...data];
        if (indicators) {
            const indicatorsArray = indicators.split(',');
            if (indicatorsArray.includes('sma')) {
                processedData = TechnicalIndicators.calculateSMA(processedData, 20);
            }
            if (indicatorsArray.includes('ema')) {
                processedData = TechnicalIndicators.calculateEMA(processedData, 20);
            }
            if (indicatorsArray.includes('rsi')) {
                processedData = TechnicalIndicators.calculateRSI(processedData, 14);
            }
            if (indicatorsArray.includes('macd')) {
                processedData = TechnicalIndicators.calculateMACD(processedData, 12, 26, 9);
            }
            
        }
        res.json(processedData);
    }
    catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
};

module.exports = {
    getStockData    
};