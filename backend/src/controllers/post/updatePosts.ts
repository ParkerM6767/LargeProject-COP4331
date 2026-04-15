import { Request, Response } from 'express'
import { Post } from '../../models/post.model'
import mongoose from 'mongoose'

// PUT /:id
export async function updatePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId).select(
      'title description longitude latitude upvote downvote createdAt creatorId'
    )

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userId = new mongoose.Types.ObjectId(req.user as string)

    if (post.creatorId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update this post' })
    }

    const { title, description } = req.body

    post.title = title || post.title
    post.description = description || post.description

    await post.save()
    res.status(200).json({ message: 'Post updated successfully', post })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update post' })
  }
}

// PUT /:id/upvote
export async function upvotePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userId = new mongoose.Types.ObjectId(req.user as string)

    const alreadyUpvoted = post.upvotedBy.some(
      id => id.toString() === userId.toString()
    )
    const alreadyDownvoted = post.downvotedBy.some(
      id => id.toString() === userId.toString()
    )

    if (alreadyUpvoted) {
      post.upvote -= 1
      post.upvotedBy = post.upvotedBy.filter(
        id => id.toString() !== userId.toString()
      )
    } else {
      if (alreadyDownvoted) {
        post.downvote -= 1
        post.downvotedBy = post.downvotedBy.filter(
          id => id.toString() !== userId.toString()
        )
      }
      post.upvote += 1
      post.upvotedBy.push(userId)
    }

    await post.save()
    res
      .status(200)
      .json({ message: 'Post upvoted successfully', upvotes: post.upvote })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to upvote post' })
  }
}

// PUT /:id/downvote
export async function downvotePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userId = new mongoose.Types.ObjectId(req.user as string)

    const alreadyUpvoted = post.upvotedBy.some(
      id => id.toString() === userId.toString()
    )
    const alreadyDownvoted = post.downvotedBy.some(
      id => id.toString() === userId.toString()
    )

    if (alreadyDownvoted) {
      post.downvote -= 1
      post.downvotedBy = post.downvotedBy.filter(
        id => id.toString() !== userId.toString()
      )
    } else {
      if (alreadyUpvoted) {
        post.upvote -= 1
        post.upvotedBy = post.upvotedBy.filter(
          id => id.toString() !== userId.toString()
        )
      }
      post.downvote += 1
      post.downvotedBy.push(userId)
    }

    await post.save()
    res.status(200).json({
      message: 'Post downvoted successfully',
      downvotes: post.downvote
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to downvote post' })
  }
}
