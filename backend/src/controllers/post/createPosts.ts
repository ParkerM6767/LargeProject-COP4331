import { Request, Response } from 'express'
import { Post } from '../../models/post.model'
import fs from 'fs';
import path from 'path';
const staticImagePath = (import.meta.dirname) + './../../../public/images/posts/';

// POST /
export async function createPost (req: Request, res: Response) {
  try {
    const { title, longitude, latitude, description, imageUrl } = JSON.parse(req.body.data)
    const userId = req.user

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' })
    }

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

    const topLeft = process.env.TOP_LEFT_CORNER_BOUNDS?.split(',')
    const bottomRight = process.env.BOTTOM_RIGHT_CORNER_BOUNDS?.split(',')

    if (
      !topLeft ||
      !bottomRight ||
      topLeft.length !== 2 ||
      bottomRight.length !== 2
    ) {
      throw new Error('Invalid map boundaries')
    }

    const [maxLat, minLng] = topLeft.map(Number)
    const [minLat, maxLng] = bottomRight.map(Number)

    if (
      longitude < maxLng ||
      longitude > minLng ||
      latitude < minLat ||
      latitude > maxLat
    ) {
      return res.status(400).json({ message: 'Coordinates are out of bounds' })
    }

    const post = await Post.create({
      title,
      longitude,
      latitude,
      description,
      imageUrl: imageUrl || '',
      creatorId: userId
    })
    // Change image name to post Id
    if(req.file){
      const oldFileName = staticImagePath + req.file?.filename;
      const newFileName = staticImagePath + post.id + path.extname(req.file.originalname);
      fs.rename(oldFileName, newFileName, (err) => {
        console.log(err);
        res.status(500).json({ message: 'Failed to create post' });
      });
    }

    res.status(201).json({ message: 'Post created successfully', post })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create post' })
  }
}
