const express = require("express");
const cors = require("cors")
require("dotenv").config();

const pool = require("./db/db");
const urlRoute = require("./routes/url");

const healthRoute = require("./routes/health")
const app = express();

app.use(express.json());
app.use(cors())

pool.connect()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/url", urlRoute);
app.use("/api/health",healthRoute);

const PORT = process.env.PORT ||5001;

app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});