import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import postRoutes from '../../routes/postRoutes'

// DB Setup

let mongoServer: MongoMemoryServer

jest.spyOn(console, 'log').mockImplementation(() => {})

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

// Mock Store Image

jest.mock('../../controllers/post/imageManagement', () => ({
  storeImage: (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => next()
}))

// App Setup

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/posts', postRoutes)

// Auth

const JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret'

const mintToken = (userId: string) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' })

const userAId = new mongoose.Types.ObjectId().toString()
const userBId = new mongoose.Types.ObjectId().toString()

const withAuthA = (req: request.Test) =>
  req.set('Cookie', `token=${mintToken(userAId)}`)
const withAuthB = (req: request.Test) =>
  req.set('Cookie', `token=${mintToken(userBId)}`)

// Seed

const seedPost = (authFn: (r: request.Test) => request.Test, overrides = {}) =>
  authFn(
    request(app)
      .post('/api/posts')
      .send({
        title: 'Seed Post',
        description: 'Seeded',
        longitude: 10,
        latitude: 20,
        ...overrides
      })
  )

// --- createPosts.ts --------------------------------------------------------------

describe('POST /api/posts', () => {
  it('should create a new post', async () => {
    const response = await seedPost(withAuthA, {
      title: 'Test Post',
      description: 'This is a test post.'
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      message: 'Post created successfully',
      post: expect.objectContaining({
        title: 'Test Post',
        description: 'This is a test post.'
      })
    })
  })

  it('should return 400 if title is missing', async () => {
    const response = await withAuthA(
      request(app)
        .post('/api/posts')
        .send({ description: 'No title', longitude: 10, latitude: 20 })
    )

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Title is required')
  })

  it('should return 400 if description is missing', async () => {
    const response = await withAuthA(
      request(app)
        .post('/api/posts')
        .send({ title: 'No desc', longitude: 10, latitude: 20 })
    )

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Description is required')
  })

  it('should return 400 if coordinates are missing', async () => {
    const response = await withAuthA(
      request(app)
        .post('/api/posts')
        .send({ title: 'No coords', description: 'Missing coords' })
    )

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Latitude and longitude are required')
  })

  it('should return 401 if no token cookie is provided', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({ title: 'Test', description: 'Test', longitude: 10, latitude: 20 })

    expect(response.status).toBe(401)
  })
})

// --- getPosts.ts --------------------------------------------------------------

describe('GET /api/posts', () => {
  it('should return a list of posts without auth', async () => {
    await seedPost(withAuthA)

    const response = await request(app).get('/api/posts')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posts retrieved successfully')
    expect(response.body.posts.length).toBeGreaterThan(0)
  })

  it('should filter posts by search query', async () => {
    await seedPost(withAuthA, { title: 'Unique Searchable Title' })

    const response = await request(app).get(
      '/api/posts?search=Unique+Searchable+Title'
    )

    expect(response.status).toBe(200)
    expect(response.body.posts[0].title).toBe('Unique Searchable Title')
  })

  it('should paginate correctly', async () => {
    await Promise.all([
      seedPost(withAuthA, { title: 'Post A' }),
      seedPost(withAuthA, { title: 'Post B' }),
      seedPost(withAuthA, { title: 'Post C' })
    ])

    const response = await request(app).get('/api/posts?page=1&limit=2')

    expect(response.status).toBe(200)
    expect(response.body.posts.length).toBe(2)
  })
})

describe('GET /api/posts/my-posts', () => {
  it('should return only posts belonging to the authenticated user', async () => {
    await seedPost(withAuthA, { title: 'User A Post' })
    await seedPost(withAuthB, { title: 'User B Post' })

    const response = await withAuthA(request(app).get('/api/posts/my-posts'))

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Posts retrieved successfully')
    const titles = response.body.posts.map((p: { title: string }) => p.title)
    expect(titles).toContain('User A Post')
    expect(titles).not.toContain('User B Post')
  })

  it('should return 404 if the authenticated user has no posts', async () => {
    const response = await withAuthA(request(app).get('/api/posts/my-posts'))

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('No posts found for this user')
  })

  it('should return 401 if no token cookie is provided', async () => {
    const response = await request(app).get('/api/posts/my-posts')

    expect(response.status).toBe(401)
  })
})

describe('GET /api/posts/:id', () => {
  it('should return a post by ID without auth', async () => {
    const create = await seedPost(withAuthA, { title: 'Find Me' })
    const postId = create.body.post._id

    const response = await request(app).get(`/api/posts/${postId}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post retrieved successfully')
    expect(response.body.post._id).toBe(postId)
  })

  it('should return 404 for a non-existent post', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await request(app).get(`/api/posts/${fakeId}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })
})

// --- updatePosts.ts --------------------------------------------------------------

describe('PUT /api/posts/:id', () => {
  it('should update a post successfully', async () => {
    const create = await seedPost(withAuthA, { title: 'Original' })
    const postId = create.body.post._id

    const response = await withAuthA(
      request(app)
        .put(`/api/posts/${postId}`)
        .send({ title: 'Updated Title', description: 'Updated Description' })
    )

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post updated successfully')
    expect(response.body.post.title).toBe('Updated Title')
    expect(response.body.post.description).toBe('Updated Description')
  })

  it('should return 403 if a different user tries to update the post', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await withAuthB(
      request(app).put(`/api/posts/${postId}`).send({ title: 'Hijacked' })
    )

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Unauthorized to update this post')
  })

  it('should return 401 if no token cookie is provided', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await request(app)
      .put(`/api/posts/${postId}`)
      .send({ title: 'No auth' })

    expect(response.status).toBe(401)
  })

  it('should return 404 if the post does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await withAuthA(
      request(app).put(`/api/posts/${fakeId}`).send({ title: 'Ghost' })
    )

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })
})

describe('PUT /api/posts/:id/upvote', () => {
  it('should upvote a post and increment the count', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await withAuthA(
      request(app).put(`/api/posts/${postId}/upvote`)
    )

    expect(response.status).toBe(200)
    expect(response.body.upvotes).toBe(1)
  })

  it('should remove the upvote on a second call (toggle)', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    await withAuthA(request(app).put(`/api/posts/${postId}/upvote`))

    const response = await withAuthA(
      request(app).put(`/api/posts/${postId}/upvote`)
    )

    expect(response.status).toBe(200)
    expect(response.body.upvotes).toBe(0)
  })

  it('should switch from downvote to upvote', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    await withAuthA(request(app).put(`/api/posts/${postId}/downvote`))

    const response = await withAuthA(
      request(app).put(`/api/posts/${postId}/upvote`)
    )

    expect(response.status).toBe(200)
    expect(response.body.upvotes).toBe(1)
  })

  it('should return 401 if no token cookie is provided', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await request(app).put(`/api/posts/${postId}/upvote`)

    expect(response.status).toBe(401)
  })

  it('should return 404 if the post does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await withAuthA(
      request(app).put(`/api/posts/${fakeId}/upvote`)
    )

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })
})

describe('PUT /api/posts/:id/downvote', () => {
  it('should downvote a post and increment the count', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await withAuthA(
      request(app).put(`/api/posts/${postId}/downvote`)
    )

    expect(response.status).toBe(200)
    expect(response.body.downvotes).toBe(1)
  })

  it('should remove the downvote on a second call (toggle)', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    await withAuthA(request(app).put(`/api/posts/${postId}/downvote`))

    const response = await withAuthA(
      request(app).put(`/api/posts/${postId}/downvote`)
    )

    expect(response.status).toBe(200)
    expect(response.body.downvotes).toBe(0)
  })

  it('should switch from upvote to downvote', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    await withAuthA(request(app).put(`/api/posts/${postId}/upvote`))

    const response = await withAuthA(
      request(app).put(`/api/posts/${postId}/downvote`)
    )

    expect(response.status).toBe(200)
    expect(response.body.downvotes).toBe(1)
  })

  it('should return 401 if no token cookie is provided', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await request(app).put(`/api/posts/${postId}/downvote`)

    expect(response.status).toBe(401)
  })

  it('should return 404 if the post does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await withAuthA(
      request(app).put(`/api/posts/${fakeId}/downvote`)
    )

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })
})

// --- deletePosts.ts --------------------------------------------------------------

describe('DELETE /api/posts/:id', () => {
  it('should delete a post created by the authenticated user', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await withAuthA(
      request(app).delete(`/api/posts/${postId}`)
    )

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Post deleted successfully')
  })

  it('should return 403 if a different user tries to delete the post', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await withAuthB(
      request(app).delete(`/api/posts/${postId}`)
    )

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Unauthorized to delete this post')
  })

  it('should return 401 if no token cookie is provided', async () => {
    const create = await seedPost(withAuthA)
    const postId = create.body.post._id

    const response = await request(app).delete(`/api/posts/${postId}`)

    expect(response.status).toBe(401)
  })

  it('should return 404 for a non-existent post', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await withAuthA(
      request(app).delete(`/api/posts/${fakeId}`)
    )

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Post not found')
  })
})
