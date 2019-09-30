require('dotenv').config(); // to access .env
const express = require('express');
const cors = require('cors');

const app = express();

const { db, DATABASE_NAME } = require('./config/database');

// middleware
app.use(cors());
app.use(express.json());

const { NODE_ENV } = process.env;

const isDevMode = NODE_ENV === 'development';
const isProductionMode = NODE_ENV === 'production';

db.authenticate()
  .then(() => console.log(`\n[${DATABASE_NAME}]Database connected..`))
  .catch(err => console.log(`Error ${err}`));

app.get('/', (req, res) => {
  res.json({
    msg: 'welcome to personnel tasks api'
  });
});

// use routes
app.use('/api/auth', require('./routes/api/personnel'));
app.use('/api/tasks', require('./routes/api/tasks'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(` \nPersonnel server started on port ${PORT}`);
});

module.exports = { app, server };
