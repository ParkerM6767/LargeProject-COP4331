import request from 'supertest'
import express from 'express'
import {
  updatePost,
  upvotePost,
  downvotePost
} from '../../../../controllers/post/updatePosts'
import { Post } from '../../../../models/post.model'

const validObjectId = '507f1f77bcf86cd799439011'

jest.mock('../../../../models/post.model', () => ({
  Post: {
    findById: jest.fn()
  }
}))

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express()
app.use(express.json())

app.use((req, _res, next) => {
  req.user = validObjectId
  next()
})

app.put('/updatePost/:id', updatePost)
app.put('/upvotePost/:id', upvotePost)
app.put('/downvotePost/:id', downvotePost)

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPost = {
  _id: '1',
  title: 'Test Post 1',
  description: 'Description 1',
  imageUrl: 'http://example.com/image1.jpg',
  longitude: 10,
  latitude: 20,
  upvote: 5,
  downvote: 2,
  createdAt: '2023-01-01T00:00:00.000Z',
  creatorId: validObjectId,
  upvotedBy: [],
  downvotedBy: []
}

// -------- Tests --------------------------------------------------------

describe('PUT /updatePost/:id', () => {
  beforeAll(() => {
    ;(Post.findById as jest.Mock).mockReset()
  })

  it('should update a post successfully', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        ...mockPost,
        save: jest.fn().mockResolvedValue(true)
      })
    })

    const response = await request(app)
      .put('/updatePost/1')
      .send({ title: 'Updated Title', description: 'Updated Description' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post updated successfully')
    expect(response.body.post.title).toBe('Updated Title')
    expect(response.body.post.description).toBe('Updated Description')
  })
})

describe('PUT /upvotePost/:id', () => {
  beforeAll(() => {
    ;(Post.findById as jest.Mock).mockReset()
  })

  it('should upvote a post successfully', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/upvotePost/1')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post upvoted successfully')
    expect(response.body.upvotes).toBe(6)
  })
})

describe('PUT /downvotePost/:id', () => {
  beforeAll(() => {
    ;(Post.findById as jest.Mock).mockReset()
  })
  it('should downvote a post successfully', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/downvotePost/1')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post downvoted successfully')
    expect(response.body.downvotes).toBe(3)
  })
})
