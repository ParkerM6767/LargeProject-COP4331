import { Request, Response } from 'express'
import { Post } from '../../models/post.model'
import fs from 'fs';
import path from 'path';
<<<<<<< HEAD
const staticImagePath = (import.meta.dirname) + '/../../../public/images/posts/';
=======
const staticImagePath = path.join(process.cwd(), 'public/images/posts/')
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f

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

    const imageToDelete = post.imageUrl;
    await post.deleteOne()
    fs.unlink(staticImagePath + imageToDelete, (err) => {console.log(err)});
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete post' })
  }
}
