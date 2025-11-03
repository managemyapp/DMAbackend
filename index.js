const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const dbo = require("./db/conn");
const route = require('./router/route');
require('dotenv').config()
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Initialize MongoDB connection before setting up routes
app.use(async (req, res, next) => {
  try {
    await dbo.connectToServer();
    next();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    res.status(500).send("Database connection failed");
  }
});

app.use(route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});