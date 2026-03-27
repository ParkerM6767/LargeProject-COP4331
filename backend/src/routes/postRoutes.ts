import { Router } from 'express'

import { createPost } from '../controllers/post/createPosts'
import { getPosts, getPostById, getPostsByUserId } from '../controllers/post/getPosts'
import {
  updatePost,
  upVotePost,
  downVotePost
} from '../controllers/post/updatePosts'
import { deletePost } from '../controllers/post/deletePosts'

const postrouter = Router()

postrouter.post('/', createPost)
postrouter.get('/', getPosts)
postrouter.get('/:id', getPostById)
postrouter.get('/my-posts', getPostsByUserId)
postrouter.put('/:id', updatePost)
postrouter.put('/:id/upvote', upVotePost)
postrouter.put('/:id/downvote', downVotePost)
postrouter.delete('/:id', deletePost)

export default postrouter
