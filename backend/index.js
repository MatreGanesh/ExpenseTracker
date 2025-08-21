const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const { dbConnect } = require('./db/dbConfig')
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();

//!Connect to mongodb
dbConnect();

//!Middlewares
app.use(cors());
app.use(express.json()); //?Pass incoming json data

//!Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);

//! Error
app.use(errorHandler);

//!Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT} `)
);
