import express from 'express';
import mongoose from 'mongoose';
import { PostValidator, registerValidator } from './validations/validator.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB connect successfuly');
  })
  .catch((err) => console.log('DB error', err));

const app = express();

app.use((req, res, next) => {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Set the allowed HTTP methods to be used
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // Set the allowed headers for HTTP requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidator, UserController.registration);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/delete-image', (req, res) => {
  const imagePath = path.join('uploads', req.body.filename);

  // Delete the image file
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Could not delete image file');
    }

    console.log('Image file deleted successfully');
    res.status(200).send('Image file deleted successfully');
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, PostValidator, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return err;
  }
  console.log('Server works');
});
