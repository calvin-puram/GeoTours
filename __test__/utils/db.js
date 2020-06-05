const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

exports.connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
};

exports.closeDB = async () => {
  await mongoose.connection.close();
};
