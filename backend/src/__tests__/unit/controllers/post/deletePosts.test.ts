import request from 'supertest'
import express from 'express'
import { deletePost } from '../../../../controllers/post/deletePosts'
import { Post } from '../../../../models/post.model'

const mockDeleteOne = jest.fn()

jest.mock('../../../../models/post.model', () => ({
  Post: {
    findById: jest.fn()
  }
}))

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express()

app.use((req, _res, next) => {
  req.user = 'testUserId'
  next()
})

app.delete('/deletePost/:id', deletePost)

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
    createdAt: '2023-01-01T00:00:00.000Z',
    creatorId: 'testUserId',
    deleteOne: mockDeleteOne
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
    createdAt: '2023-01-01T00:00:00.000Z',
    creatorId: 'testUserId',
    deleteOne: mockDeleteOne
  }
]

// -------- Tests --------------------------------------------------------

describe('DELETE /deletePost/:id', () => {
  beforeAll(() => {
    mockDeleteOne.mockReset()
  })

  it('should delete a post successfully', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue(mockPosts[0])
    mockDeleteOne.mockResolvedValue({})

    const response = await request(app).delete('/deletePost/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Post deleted successfully'
    })
    expect(Post.findById).toHaveBeenCalledWith('1')
    expect(mockDeleteOne).toHaveBeenCalled()
  })

  it('should return 403 if user is not the creator', async () => {
    const postCopy = { ...mockPosts[0], creatorId: 'otherUserId' }
    ;(Post.findById as jest.Mock).mockResolvedValue(postCopy)

    const response = await request(app).delete('/deletePost/1')

    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      message: 'Unauthorized to delete this post'
    })
    expect(Post.findById).toHaveBeenCalledWith('1')
  })

  it('should return 404 if post not found', async () => {
    ;(Post.findById as jest.Mock).mockResolvedValue(null)

    const response = await request(app).delete('/deletePost/999')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'Post not found' })
    expect(Post.findById).toHaveBeenCalledWith('999')
  })

  it('should handle server errors', async () => {
    ;(Post.findById as jest.Mock).mockRejectedValue(new Error('DB error'))

    const response = await request(app).delete('/deletePost/1')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ message: 'Failed to delete post' })
  })
})
