import mongoose from 'mongoose'
<<<<<<< HEAD
import { connectDB } from './src/db'

beforeAll(async () => {
  await connectDB()
})

afterAll(async () => {
  await mongoose.connection.close()
})
=======

jest.mock('./src/db', () => ({
  connectDB: jest.fn()
}))

beforeAll(() => {
  process.env.TOP_LEFT_CORNER_BOUNDS = '90,180'
  process.env.BOTTOM_RIGHT_CORNER_BOUNDS = '-90,-180'
})

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
  delete process.env.TOP_LEFT_CORNER_BOUNDS
  delete process.env.BOTTOM_RIGHT_CORNER_BOUNDS
})
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
