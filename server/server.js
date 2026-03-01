require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth-routes");
const foodRoutes = require("./routes/food-routes");
const connectDB = require("./db/connection");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
