import { Request, Response } from 'express'
import '../../db'
import { Post } from '../../models/post.model'

// POST /createPost
export async function createPost (req: Request, res: Response) {
  try {
    const { longitude, latitude, description, imageUrl } = req.body
    const userId = '65f1a2b3c4d5e6f7a8b9c0d1' // TODO: replace with req.user._id when authentication is implemented
    // const userId = req.user._id; // TODO: uncomment when authentication is implemented

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ message: 'Description is required' })
    }

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: 'Latitude and longitude are required' })
    }

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return res
        .status(400)
        .json({ message: 'Longitude and latitude must be numbers' })
    }

    const post = await Post.create({
      longitude,
      latitude,
      description,
      imageUrl: imageUrl || '',
      creatorId: userId
    })

    res.status(201).json({ message: 'Post created successfully', post })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err })
  }
}
