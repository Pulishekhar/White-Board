const mongoose = require("mongoose");
const connectDB = require("./db");
connectDB();


mongoose
  .connect("mongodb://127.0.0.1:27017/whiteboardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
