import { Request, Response } from 'express'
import { Post } from '../../models/post.model'

// GET /getPosts?page=1&limit=20
export async function getPosts (req: Request, res: Response) {
  try {
    const search = req.query.search as string
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {}

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        'title description imageUrl longitude latitude upvote upvotedBy downvote downvotedBy createdAt creatorId'
      )
    const count = await Post.find(filter).countDocuments()

    const results = posts.map(post => {
      const { upvotedBy, downvotedBy, ...rest } = post.toObject()
      return {
        ...rest,
        userUpvoted: upvotedBy.some(id => id.toString() === req.user),
        userDownvoted: downvotedBy.some(id => id.toString() === req.user)
      }
    })

    res.status(200).json({
      message: 'Posts retrieved successfully',
      posts: results,
      count
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get posts' })
  }
}

// GET /getPost/:id
export async function getPostById (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId).select(
      'title description imageUrl longitude latitude upvote upvotedBy downvote downvotedBy createdAt'
    )

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const { upvotedBy, downvotedBy, ...rest } = post.toObject()

    res.status(200).json({
      message: 'Post retrieved successfully',
      post: {
        ...rest,
        userUpvoted: upvotedBy.some(id => id.toString() === req.user),
        userDownvoted: downvotedBy.some(id => id.toString() === req.user)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get post' })
  }
}

// GET /getPostsByUserId/:userId
export async function getPostsByUserId (req: Request, res: Response) {
  try {
    const userId = req.user

    const posts = await Post.find({ creatorId: userId })
      .sort({ createdAt: -1 })
      .select(
        'title description imageUrl longitude latitude upvote upvotedBy downvote downvotedBy createdAt'
      )

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' })
    }

    const results = posts.map(post => {
      const { upvotedBy, downvotedBy, ...rest } = post.toObject()
      return {
        ...rest,
        userUpvoted: upvotedBy.some(id => id.toString() === req.user),
        userDownvoted: downvotedBy.some(id => id.toString() === req.user)
      }
    })

    res.status(200).json({
      message: 'Post retrieved successfully',
      posts: results
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get posts' })
  }
}
