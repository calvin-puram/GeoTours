const dotenv = require('dotenv');
const chalk = require('chalk');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });
const app = require('./app');

//connect to DB
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    chalk.blue(
      `server running in ${process.env.NODE_ENV} & listening on port ${process.env.PORT}`
    )
  );
});
