import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import {getVideoProgress, updateVideoProgress, createUser, getUser} from './controller.js'


dotenv.config();

// Connect to MongoDB
connectDB()

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



// HTML route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/video', getVideoProgress);
app.post('/video', updateVideoProgress);
app.post('/create',createUser);
app.post('/user', getUser);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
