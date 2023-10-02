const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db.jsx');
const path = require('path');

//dot config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


//routes
//1 test routes
// app.use("/api/v1/test", require("./routes/testRoutes.jsx"));
app.use("/api/v1/auth", require("./routes/authRoutes.jsx"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes.jsx"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes.jsx"));
app.use("/api/v1/admin", require("./routes/adminRoutes.jsx"));

//static folder
app.use(express.static(path.join(__dirname, "./client/build")));

//static routes
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
    console.log(`Node Server Runnig in ${process.env.DEV_MODE} mode on Port ${process.env.PORT}`.bgBlue.white);
});