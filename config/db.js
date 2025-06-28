const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crud_db"
    );
    console.log(
      `\n☘️  MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
