const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GramHealthcare API',
    status: 'running',
    project: 'GramHealthcare'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`GramHealthcare server running on http://localhost:${PORT}`);
});
