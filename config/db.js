const mongoose = require('mongoose');
const mongodbURI = "mongodb+srv://acharyakalp8:T2ijgDDQcNvu6j1k@cluster2.mxlxlau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2"

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;