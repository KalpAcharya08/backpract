const axios = require('axios');

exports.getPrediction = async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8000/predict');
    res.json({ next_movement: response.data.next_movement });
  } catch (error) {
    console.error('Error fetching prediction:', error.message);
    res.status(500).json({ error: 'Failed to fetch prediction' });
  }
};