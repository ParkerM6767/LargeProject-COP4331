import { Request, Response } from 'express'
import { Post } from '../../models/post.model'

// POST /
export async function createPost (req: Request, res: Response) {
  try {
    const { longitude, latitude, description, imageUrl } = req.body
    const userId = req.user

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ message: 'Description is required' })
    }

    if (latitude === undefined || longitude === undefined) {
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
    console.error(err)
    res.status(500).json({ message: 'Failed to create post' })
  }
}
