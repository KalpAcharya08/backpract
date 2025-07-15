class TechnicalIndicators {
  static calculateSMA(data, period) {
    return data.map((row, index, array) => {
      if (index < period - 1) return { ...row, sma: null };
      const sum = array.slice(index - period + 1, index + 1)
        .reduce((acc, item) => acc + item.close, 0);
      return { ...row, sma: sum / period };
    });
  }

  static calculateEMA(data, period) {
    const k = 2 / (period + 1);
    let ema = data[0].close;
    return data.map((row, index) => {
      if (index === 0) return { ...row, ema };
      ema = row.close * k + ema * (1 - k);
      return { ...row, ema };
    });
  }

  static calculateRSI(data, period = 14) {
    let gains = 0;
    let losses = 0;
    const rsiData = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }

      if (i >= period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        rsiData.push({ ...data[i], rsi });

        // Remove the oldest change
        const oldestChange = data[i - period + 1].close - data[i - period].close;
        if (oldestChange >= 0) {
          gains -= oldestChange;
        } else {
          losses -= Math.abs(oldestChange);
        }
      } else {
        rsiData.push({ ...data[i], rsi: null });
      }
    }

    return rsiData;
  }

  static calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const ema12 = this.calculateEMA(data, fastPeriod);
    const ema26 = this.calculateEMA(data, slowPeriod);
    
    // Calculate MACD line
    const macdLine = ema12.map((item, index) => ({
      ...item,
      macd: item.ema - ema26[index].ema
    }));
    
    // Calculate Signal line (EMA of MACD line)
    const signalLine = this.calculateEMA(
      macdLine.map(item => ({ ...item, close: item.macd })),
      signalPeriod
    ).map(item => ({ ...item, signal: item.ema }));
    
    // Combine results
    return macdLine.map((item, index) => ({
      ...item,
      macd: item.macd,
      signal: signalLine[index]?.signal || null,
      histogram: item.macd - (signalLine[index]?.signal || 0)
    }));
  }
}

module.exports = TechnicalIndicators;