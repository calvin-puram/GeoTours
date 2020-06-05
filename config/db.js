const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
  try {
    let DB;
    if (process.env.NODE_ENV === 'development') {
      DB = process.env.MONGODB_URI_TEST;
    } else {
      DB = process.env.MONGODB_URI;
    }
    const conn = await mongoose.connect(DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log(
      chalk.yellowBright(`connected to DB on host: ${conn.connection.host}`)
    );
  } catch (err) {
    console.log(chalk.red(`mongoDB error: ${err.message}`));
  }
};

module.exports = connectDB;
