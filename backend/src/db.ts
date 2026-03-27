import mongoose from 'mongoose';

export const connectDB = async () => {
  console.log('Attempting to connectd to MongoDB...');
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.DB_HOST! as string);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
  }
};