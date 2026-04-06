import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  resetToken?: string
  resetTokenExpires?: Date
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9]+@ucf\.edu$/, 'Must enter a valid UCF email address'],
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 72,
      minlength: 8
    },
    resetToken: {
      type: String
    },
    resetTokenExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export const User = model<IUser>('User', UserSchema)
