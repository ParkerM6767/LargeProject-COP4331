import request from 'supertest'
import express from 'express'
import {
  getPosts,
  getPostById,
  getPostsByUserId
} from '../../../../controllers/post/getPosts'
import { Post } from '../../../../models/post.model'

jest.mock('../../../../models/post.model', () => ({
  Post: {
    find: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn()
  }
}))

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express()

app.use((req, _res, next) => {
  req.user = 'testUserId'
  next()
})

app.get('/getPosts', getPosts)
app.get('/getPost/:id', getPostById)
app.get('/getPostsByUserId/:userId', getPostsByUserId)

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPosts = [
  {
    _id: '1',
    title: 'Test Post 1',
    description: 'Description 1',
    imageUrl: 'http://example.com/image1.jpg',
    longitude: 10,
    latitude: 20,
    upvote: 5,
    downvote: 2,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    title: 'Test Post 2',
    description: 'Description 2',
    imageUrl: 'http://example.com/image2.jpg',
    longitude: 30,
    latitude: 40,
    upvote: 10,
    downvote: 1,
    createdAt: '2023-01-01T00:00:00.000Z'
  }
]

// -------- Tests --------------------------------------------------------

describe('GET /getPosts', () => {
  let chain: {
    sort: jest.Mock
    skip: jest.Mock
    limit: jest.Mock
    select: jest.Mock
  }

  beforeEach(() => {
    chain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(mockPosts)
    }
    ;(Post.find as jest.Mock).mockReturnValue(chain)
    ;(Post.countDocuments as jest.Mock).mockResolvedValue(mockPosts.length)
  })

  it('should return a list of posts with default pagination', async () => {
    const response = await request(app).get('/getPosts')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posts retrieved successfully')
    expect(response.body.posts).toEqual(mockPosts)
    expect(Post.find).toHaveBeenCalledWith({})
    expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 })
    expect(chain.skip).toHaveBeenCalledWith(0)
    expect(chain.limit).toHaveBeenCalledWith(20)
  })

  it('should return a list of posts with search query', async () => {
    const response = await request(app).get('/getPosts?search=Test')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posts retrieved successfully')
    expect(Post.find).toHaveBeenCalledWith({
      title: { $regex: 'Test', $options: 'i' }
    })
  })

  it('should apply correct skip and limit for page 2 with limit 10', async () => {
    const response = await request(app).get('/getPosts?page=2&limit=10')

    expect(response.status).toBe(200)
    expect(chain.skip).toHaveBeenCalledWith(10)
    expect(chain.limit).toHaveBeenCalledWith(10)
  })

  it('should return 500 if Post.find throws an error', async () => {
    chain.select.mockRejectedValue(new Error('Database error'))

    const response = await request(app).get('/getPosts')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to get posts')
  })
})

describe('GET /getPost/:id', () => {
  it('should return a post by ID', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockPosts[0])
    })

    const response = await request(app).get('/getPost/1')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post retrieved successfully')
    expect(response.body.post).toEqual(mockPosts[0])
    expect(Post.findById).toHaveBeenCalledWith('1')
  })

  it('should return 404 if post not found', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    })

    const response = await request(app).get('/getPost/999')

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })

  it('should return 500 if Post.findById throws an error', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Database error'))
    })

    const response = await request(app).get('/getPost/1')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to get post')
  })
})

describe('GET /getPostsByUserId/:userId', () => {
  it('should return posts by user ID', async () => {
    ;(Post.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(mockPosts)
    })

    const response = await request(app).get('/getPostsByUserId/testUserId')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posts retrieved successfully')
    expect(response.body.posts).toEqual(mockPosts)
    expect(Post.find).toHaveBeenCalledWith({ creatorId: 'testUserId' })
  })

  it('should return 404 if no posts found for user', async () => {
    ;(Post.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue([])
    })

    const response = await request(app).get('/getPostsByUserId/testUserId')

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('No posts found for this user')
  })

  it('should return 500 if Post.find throws an error', async () => {
    ;(Post.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockRejectedValue(new Error('Database error'))
    })

    const response = await request(app).get('/getPostsByUserId/testUserId')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to get posts')
  })
})
