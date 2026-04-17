import mongoose from 'mongoose'

jest.mock('./src/db', () => ({
  connectDB: jest.fn()
}))

beforeAll(() => {
  process.env.TOP_RIGHT_CORNER_BOUNDS = '90,180'
  process.env.BOTTOM_LEFT_CORNER_BOUNDS = '-90,-180'
})

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
  delete process.env.TOP_RIGHT_CORNER_BOUNDS
  delete process.env.BOTTOM_LEFT_CORNER_BOUNDS
})
