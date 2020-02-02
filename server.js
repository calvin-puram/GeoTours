const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} & listening on port ${process.env.PORT}`
  );
});
