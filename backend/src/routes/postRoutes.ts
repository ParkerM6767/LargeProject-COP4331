// Router and middleware functions
import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { optionalAuthMiddleware } from '../middleware/optionalAuth.middleware'

// Post Functions
import { createPost } from '../controllers/post/createPosts'
import {
  getPosts,
  getPostById,
  getPostsByUserId
} from '../controllers/post/getPosts'
import {
  updatePost,
  upvotePost,
  downvotePost
} from '../controllers/post/updatePosts'
import { deletePost } from '../controllers/post/deletePosts'

// Misc. Functions
import { storeImage } from '../controllers/post/imageManagement'

const postrouter = Router()

postrouter.post('/', authMiddleware, storeImage, createPost)
postrouter.get('/', optionalAuthMiddleware, getPosts)
postrouter.get('/my-posts', authMiddleware, getPostsByUserId)
postrouter.get('/:id', optionalAuthMiddleware, getPostById)
postrouter.put('/:id', authMiddleware, updatePost)
postrouter.put('/:id/upvote', authMiddleware, upvotePost)
postrouter.put('/:id/downvote', authMiddleware, downvotePost)
postrouter.delete('/:id', authMiddleware, deletePost)

export default postrouter
