const express = require("express");
const app = express();
const colors = require("colors");
const morgan = require("morgan");
const connectDb = require("./config/dbConfig");
const dotenv = require("dotenv");
// const proxy= require('./proxy');

//dotenv conig
dotenv.config();
connectDb()

app.use(express.json());
// app.use(cors());
const studentRoute = require("./routes/studentRoute");
const classRoute = require("./routes/classRoute")
const resultsRoute = require("./routes/resultsRoute")

app.use("/api/student/", studentRoute);
app.use('/api/classes/', classRoute);
app.use('/api/results/', resultsRoute);
// app.use(proxy());
const port = process.env.PORT || 4001;

// deployment config
const path = require("path");

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});