const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const router = require('./routes/routes');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json()); // Use express.json() to parse JSON request bodies

// Logging middleware
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    console.log('Request body:', req.body);
    next();
});

// Register routes
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`The app is running at server: http://localhost:${PORT}`);
});
