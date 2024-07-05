require('dotenv').config();
const express = require('express');
const cors = require('cors');
const billsRouter = require('./routes/bills');
const { runScrapers } = require('./scrapers/runScrapers');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/bills', billsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Run scrapers once a day
setInterval(runScrapers, 24 * 60 * 60 * 1000);

console.log('Server application entry point');

module.exports = app;
