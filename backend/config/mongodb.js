import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB`);
  });
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/telecare-hub`);
};

export default connectDB;
