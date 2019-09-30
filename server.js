require('dotenv').config(); // to access .env
const express = require('express');
const cors = require('cors');

const app = express();

const { db, DATABASE_NAME } = require('./config/database');

// Middleware
app.use(cors());
app.use(express.json());

const { NODE_ENV } = process.env;

const isDevMode = NODE_ENV === 'development';
const isProductionMode = NODE_ENV === 'production';

// Connect to postgres
db.authenticate()
  .then(() => console.log(`\n[${DATABASE_NAME}]Database connected..`))
  .catch(err => console.log(`Error ${err}`));

// Use routes
app.get('/api', (req, res) => {
  res.json({
    msg: 'welcome to customer care api'
  });
});

app.use('/api/auth', require('./routes/api/personnel'));
app.use('/api/tasks', require('./routes/api/tasks'));

// Hitting / will serve static assets if production
// remember to insert build script, :)
if (isProductionMode) {
  // set static folder
  app.use(express.static('build'));

  //serve index.html for any req
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Hitting / will serve api if development
app.get('/', (req, res) => {
  res.json({ msg: 'welcome to customer care api' });
});

const PORT = process.env.PORT || 5000;

const mode = isDevMode ? 'DevMode' : 'ProductionMode';
app.listen(PORT, () => {
  console.log({ mode });
  console.log(`🥒️ Customer care server started on port ${PORT}..`);
});
