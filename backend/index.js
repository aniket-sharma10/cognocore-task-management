import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
import 'express-async-errors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// router imports
import taskRoute from './routes/task-route.js'

// middleware imports
import notFoundMiddleware from './middlewares/not-found.js'
import errorHandlerMiddleware from './middlewares/error-handler.js'

dotenv.config()
app.use(cors())
app.use(express.json())


// Using Routers
app.use('/api/tasks', taskRoute)

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });

// Using middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = 3000
const start = async() =>  {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}..`))
    } catch (error) {
        console.log(error)
    }
} 
start()