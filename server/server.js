require("dotenv").config();
const express = require("express");
const router = require("./routes/auth-routes");
const connectDB = require("./db/connection");
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api", router);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
