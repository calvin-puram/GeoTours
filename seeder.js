const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const Tours = require('./models/Tours');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const toursData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, './dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

const importData = async () => {
  try {
    await Tours.create(toursData);
    console.log('data successfully imported')
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteData = async () => {
  try {
    await Tours.deleteMany();
    console.log('data successfully removed');
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
