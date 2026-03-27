import { Request, Response } from 'express'
import '../../db'
import { Post } from '../../models/post.model'
import mongoose from 'mongoose' // TODO: delete this line when authentication is implemented

// DELETE /deletePost/:id
export async function deletePost (req: Request, res: Response) {
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
        .json({ message: 'Unauthorized to delete this post' })
    }

    await post.deleteOne()
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err })
  }
}
