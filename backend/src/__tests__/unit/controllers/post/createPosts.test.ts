import request from 'supertest'
import express from 'express'
<<<<<<< HEAD
import { createPost } from '../../controllers/post/createPosts'
import { Post } from '../../models/post.model'

jest.mock('../../models/post.model', () => ({
=======
import { createPost } from '../../../../controllers/post/createPosts'
import { Post } from '../../../../models/post.model'

jest.mock('../../../../models/post.model', () => ({
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
  Post: {
    create: jest.fn()
  }
}))

const app = express()
<<<<<<< HEAD
=======
app.use(express.json())
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f

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
<<<<<<< HEAD
      longitude: 10,
=======
      longitude: 50,
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
      latitude: 20
    }
    ;(Post.create as jest.Mock).mockResolvedValue({
      ...newPost,
      _id: '1',
      creatorId: 'testUserId',
      createdAt: '2023-01-01T00:00:00.000Z'
    })

    const response = await request(app).post('/createPost').send(newPost)

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

<<<<<<< HEAD
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      description: 'This is a test post',
      longitude: 10,
=======
  it('should return 400 if title is missing', async () => {
    const response = await request(app).post('/createPost').send({
      description: 'This is a test post',
      longitude: 50,
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
      latitude: 20
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
<<<<<<< HEAD
      message: 'Missing required fields'
    })

=======
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
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
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
<<<<<<< HEAD
  }) 
=======
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
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f

  it('should return 500 if there is a server error', async () => {
    ;(Post.create as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).post('/createPost').send({
      title: 'Test Post',
      description: 'This is a test post',
      imageUrl: 'http://example.com/image.jpg',
<<<<<<< HEAD
      longitude: 10,
=======
      longitude: 50,
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
      latitude: 20
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
<<<<<<< HEAD
      message: 'Internal server error'
=======
      message: 'Failed to create post'
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
    })
  })
})
