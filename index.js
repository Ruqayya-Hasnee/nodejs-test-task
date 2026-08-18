const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//auth routes
const authRoutes = require("./routes/auth");
//admin routes
const adminRoutes = require("./routes/admin");
//post routes
const postRoutes = require("./routes/posts");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/posts", postRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Server is running .....",
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});