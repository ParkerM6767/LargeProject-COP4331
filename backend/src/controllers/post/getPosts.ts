import { Request, Response } from 'express'
import '../../db'
import { Post } from '../../models/post.model'

// GET /getPosts?page=1&limit=20
export async function getPosts (req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({ message: 'Posts retrieved successfully', posts })
  } catch (err) {
    console.error('getPosts error:', err)
    res
      .status(500)
      .json({ message: 'Failed to get posts', error: (err as Error).message })
  }
}

// GET /getPost/:id
export async function getPostById (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.status(200).json({ message: 'Post retrieved successfully', post })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get post', error: err })
  }
}

// GET /getPostsByUserId/:userId
// TODO: Change this once authentication is implemented so that other users cannot see posts by a specific user
export async function getPostsByUserId (req: Request, res: Response) {
  try {
    const userId = req.params.userId
    const posts = await Post.find({ creatorId: userId }).sort({ createdAt: -1 })

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' })
    }

    res.status(200).json({ message: 'Posts retrieved successfully', posts })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get posts', error: err })
  }
}
