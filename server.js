const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
require("dotenv").config({ path: "./config/.env" });
const app = express();
const db = require("./config/db");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);

db.connect(process.env.MONGODB_URI);

//routes
app.use("/api/user", userRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
