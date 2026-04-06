import { Document, Schema, Types, model } from 'mongoose'

export interface IPost extends Document {
  title: string
  upvote: number
  downvote: number
  upvotedBy: Types.ObjectId[]
  downvotedBy: Types.ObjectId[]
  longitude: number
  latitude: number
  description: string
  imageUrl: string
  creatorId: Types.ObjectId
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    upvote: {
      type: Number,
      default: 0
    },
    upvotedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvotedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvote: {
      type: Number,
      default: 0
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Post = model<IPost>('Post', PostSchema)
