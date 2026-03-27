// Main libraries
import express from 'express'
import cors from 'cors'
import { connectDB } from './db'

// Express setup/dependencies
const app = express()

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Main routers
import postrouter from './routes/postRoutes'
app.use('/api/posts', postrouter)
import userrouter from './routes/userRoutes'
import cookieParser from 'cookie-parser';
app.use('/api/users', userrouter)

app.get('/api/hello', async (req, res) => {
  res.status(200).send('Hello World')
})

//Start DB Connection
connectDB().then(() => {
  app.listen(8000, () => {
    console.log('Server running on port 8000')
  })
})
