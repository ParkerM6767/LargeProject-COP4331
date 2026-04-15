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
  verificationCode?: string
  verificationCodeExpires?: Date
  isVerified?: boolean
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9]+@ucf\.edu$/, 'Must enter a valid UCF email address']
    },
    password: {
      type: String,
      required: true
    },
    resetToken: {
      type: String
    },
    resetTokenExpires: {
      type: Date
    },
    verificationCode: {
      type: String
    },
    verificationCodeExpires: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  }
)

export const User = model<IUser>('User', UserSchema)
