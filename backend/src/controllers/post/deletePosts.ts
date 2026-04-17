import { Request, Response } from 'express'
import { Post } from '../../models/post.model'
import fs from 'fs'
import path from 'path'
const staticImagePath = path.join(
  import.meta.dirname,
  '../../../public/images/posts'
)

// DELETE /:id
export async function deletePost (req: Request, res: Response) {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userId = req.user

    if (post.creatorId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this post' })
    }

    const imageToDelete = post.imageUrl
    await post.deleteOne()
    await fs.promises.unlink(path.join(staticImagePath, imageToDelete))
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete post' })
  }
}
