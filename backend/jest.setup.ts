import mongoose from 'mongoose'
import { connectDB } from './src/db'

beforeAll(async () => {
  await connectDB()
})

afterAll(async () => {
  await mongoose.connection.close()
})