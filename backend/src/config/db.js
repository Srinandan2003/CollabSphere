import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Debug: Check if MONGO_URI is set
    console.log('MONGO_URI:', process.env.MONGO_URI);

    // Add Mongoose connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,       // Avoid deprecation warnings
      useUnifiedTopology: true,    // Avoid deprecation warnings
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed Mongodb connection");
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;