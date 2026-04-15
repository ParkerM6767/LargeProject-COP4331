import request from 'supertest'
import express from 'express'
import { createPost } from '../../../../controllers/post/createPosts'
import { Post } from '../../../../models/post.model'

jest.mock('../../../../models/post.model', () => ({
  Post: {
    create: jest.fn()
  }
}))

const app = express()
app.use(express.json())

app.use((req, _res, next) => {
  req.user = 'testUserId'
  next()
})

app.post('/createPost', createPost)

describe('POST /createPost', () => {
  beforeAll(() => {
    ;(Post.create as jest.Mock).mockReset()
  })

  it('should create a post successfully', async () => {
    const newPost = {
      title: 'Test Post',
      description: 'This is a test post',
      imageUrl: 'http://example.com/image.jpg',
      longitude: 50,
      latitude: 20
    }
    ;(Post.create as jest.Mock).mockResolvedValue({
      ...newPost,
      _id: '1',
      creatorId: 'testUserId',
      createdAt: '2023-01-01T00:00:00.000Z'
    })

    const response = await request(app).post('/createPost').send(newPost)

    console.log(response.body)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      message: 'Post created successfully',
      post: {
        ...newPost,
        _id: '1',
        creatorId: 'testUserId',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    })
  })

  it('should return 400 if title is missing', async () => {
    const response = await request(app).post('/createPost').send({
      description: 'This is a test post',
      longitude: 50,
      latitude: 20
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Title is required'
    })
  })

  it('should return 400 if description is missing', async () => {
    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      longitude: 50,
      latitude: 20
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Description is required'
    })
  })

  it('should return 400 if required latitude and/ or longitude are missing', async () => {
    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      description: 'This is a test post',
      longitude: 50
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Latitude and longitude are required'
    })
  })

  it('should return 400 if longitude or latitude are not numbers', async () => {
    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      description: 'This is a test post',
      longitude: 'not a number',
      latitude: 'not a number'
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Longitude and latitude must be numbers'
    })
  })

  it('should return 400 if coordinates are out of bounds', async () => {
    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      description: 'This is a test post',
      longitude: 200,
      latitude: 100
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Coordinates are out of bounds'
    })
  })

  it('should return 500 if there is a server error', async () => {
    ;(Post.create as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      description: 'This is a test post',
      imageUrl: 'http://example.com/image.jpg',
      longitude: 50,
      latitude: 20
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      message: 'Failed to create post'
    })
  })
})
