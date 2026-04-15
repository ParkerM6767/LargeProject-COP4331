import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
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
  beforeEach(() => {
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

  it('should return 404 if post not found', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    })

    const response = await request(app)
      .put('/updatePost/999')
      .send({ title: 'Updated Title', description: 'Updated Description' })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })

  it('should return 403 if user is not the creator', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        ...mockPost,
        creatorId: 'anotherUserId',
        save: jest.fn().mockResolvedValue(true)
      })
    })

    const response = await request(app)
      .put('/updatePost/1')
      .send({ title: 'Updated Title', description: 'Updated Description' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Unauthorized to update this post')
  })

  it('should return 500 on server error', async () => {
    ;(Post.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Database error'))
    })

    const response = await request(app)
      .put('/updatePost/1')
      .send({ title: 'Updated Title', description: 'Updated Description' })

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to update post')
  })
})

describe('PUT /upvotePost/:id', () => {
  beforeEach(() => {
    ;(Post.findById as jest.Mock).mockReset()
  })

  it('should upvote a post (no prior votes)', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      upvote: 5,
      upvotedBy: [],
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/upvotePost/1')
    expect(response.status).toBe(200)
    expect(response.body.upvotes).toBe(6)
  })

  it('should remove upvote if already upvoted', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      upvote: 6,
      upvotedBy: [new mongoose.Types.ObjectId(validObjectId)],
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/upvotePost/1')
    expect(response.status).toBe(200)
    expect(response.body.upvotes).toBe(5)
  })

  it('should switch from downvote to upvote', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      upvote: 5,
      downvote: 3,
      upvotedBy: [],
      downvotedBy: [new mongoose.Types.ObjectId(validObjectId)],
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/upvotePost/1')
    expect(response.status).toBe(200)
    expect(response.body.upvotes).toBe(6)
  })

  it('should return 404 if post not found', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue(null)

    const response = await request(app).put('/upvotePost/999')

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })

  it('should return 500 on server error', async () => {
    ;(Post.findById as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).put('/upvotePost/1')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to upvote post')
  })
})

describe('PUT /downvotePost/:id', () => {
  beforeEach(() => {
    ;(Post.findById as jest.Mock).mockReset()
  })

  it('should downvote a post (no prior votes)', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      downvote: 2,
      downvotedBy: [],
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/downvotePost/1')
    expect(response.status).toBe(200)
    expect(response.body.downvotes).toBe(3)
  })

  it('should remove downvote if already downvoted', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      downvote: 3,
      downvotedBy: [new mongoose.Types.ObjectId(validObjectId)],
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/downvotePost/1')
    expect(response.status).toBe(200)
    expect(response.body.downvotes).toBe(2)
  })

  it('should switch from upvote to downvote', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue({
      ...mockPost,
      upvote: 6,
      downvote: 2,
      upvotedBy: [new mongoose.Types.ObjectId(validObjectId)],
      downvotedBy: [],
      save: jest.fn().mockResolvedValue(true)
    })
    const response = await request(app).put('/downvotePost/1')
    expect(response.status).toBe(200)
    expect(response.body.downvotes).toBe(3)
  })

  it('should return 404 if post not found', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue(null)
    const response = await request(app).put('/downvotePost/999')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })

  it('should return 500 on server error', async () => {
    ;(Post.findById as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).put('/downvotePost/1')

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to downvote post')
  })
})
