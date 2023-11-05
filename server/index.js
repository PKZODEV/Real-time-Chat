const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require('./Routes/userRoutes')

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute)

app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs...");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`server is running at http://localhost:${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => {
    "MongoDB connection failed: ", error.message;
  });
