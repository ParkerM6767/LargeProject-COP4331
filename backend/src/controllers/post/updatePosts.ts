import { Request, Response } from 'express'
import '../../db'
import { Post } from '../../models/post.model'
import mongoose from 'mongoose' // TODO: delete this line when authentication is implemented

// PUT /updatePost/:id
export async function updatePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // TODO: replace with req.user._id when authentication is implemented
    const userId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c0d1')
    // const userId = req.user._id; // TODO: uncomment when authentication is implemented

    if (post.creatorId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update this post' })
    }

    const { longitude, latitude, description, imageUrl } = req.body

    post.longitude = longitude || post.longitude
    post.latitude = latitude || post.latitude
    post.description = description || post.description
    post.imageUrl = imageUrl || post.imageUrl

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    await post.save()
    res.status(200).json({ message: 'Post updated successfully', post })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post', error: err })
  }
}

// PUT /upvotePost/:id
export async function upVotePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // TODO: replace with req.user._id when authentication is implemented
    const userId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c0d1')
    // const userId = req.user._id; // TODO: uncomment when authentication is implemented
    const alreadyUpvoted = post.upvotedBy.includes(userId)
    const alreadyDownvoted = post.downvotedBy.includes(userId)

    if (alreadyUpvoted) {
      post.upvote -= 1
      post.upvotedBy = post.upvotedBy.filter(
        userId => userId.toString() !== userId.toString()
      )
    } else {
      if (alreadyDownvoted) {
        post.downvote -= 1
        post.downvotedBy = post.downvotedBy.filter(
          userId => userId.toString() !== userId.toString()
        )
      }
      post.upvote += 1
      post.upvotedBy.push(userId)
    }

    await post.save()
    res.status(200).json({ message: 'Post upvoted successfully', post })
  } catch (err) {
    res.status(500).json({ message: 'Failed to upvote post', error: err })
  }
}

// PUT /downvotePost/:id
export async function downVotePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // TODO: replace with req.user._id when authentication is implemented
    const userId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f7a8b9c0d1')
    // const userId = req.user._id; // TODO: uncomment when authentication is implemented
    const alreadyUpvoted = post.upvotedBy.includes(userId)
    const alreadyDownvoted = post.downvotedBy.includes(userId)

    if (alreadyDownvoted) {
      post.downvote -= 1
      post.downvotedBy = post.downvotedBy.filter(
        userId => userId.toString() !== userId.toString()
      )
    } else {
      if (alreadyUpvoted) {
        post.upvote -= 1
        post.upvotedBy = post.downvotedBy.filter(
          userId => userId.toString() !== userId.toString()
        )
      }
      post.downvote += 1
      post.downvotedBy.push(userId)
    }

    await post.save()
    res.status(200).json({ message: 'Post downvoted successfully', post })
  } catch (err) {
    res.status(500).json({ message: 'Failed to downvote post', error: err })
  }
}
