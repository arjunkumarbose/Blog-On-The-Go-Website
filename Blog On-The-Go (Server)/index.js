const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: [
    //'http://localhost:5173',
    'https://arnob-on-the-go.web.app',
    'https://arnob-on-the-go.firebaseapp.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    //await client.connect();
    db = client.db('blog-otg');
    console.log('Connected to database');
  } catch (e) {
    console.error(e);
  }
}

connectDB();

function jwtVerify(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json('You are not authenticated!');

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(403).json('Token is not valid!');
    req.user = user;
    next();
  });
}

app.post('/api/auth/register', async (req, res) => {
  console.log(req.body)
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      username,
      email,
      password: hashedPassword,
    };
    const result = await db.collection('users').insertOne(newUser);
    console.log(result)
    res.send(result);

  } catch (err) {
    res.status(500).json(err.toString());
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ email: req.body.email });
    if (!user) return res.status(404).send('User not found');

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return res.status(400).send('Wrong password');

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true }).send('Logged in successfully');
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

app.get('/api/users', jwtVerify, async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

app.get('/api/users/:id', jwtVerify, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json('User not found');
    }
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

app.put('/api/users/:id', jwtVerify, async (req, res) => {
  try {
    const updatedData = {
      $set: req.body,
    };
    const result = await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) }, updatedData);
    if (result.modifiedCount === 0) {
      return res.status(404).json('No user found with that ID');
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

app.delete('/api/users/:id', jwtVerify, async (req, res) => {
  try {
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json('No user found with that ID');
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('token').status(200).send('Logged out successfully');
});


// Post Routes
app.post('/api/comments/create', async (req, res) => {
  const newPost = req.body;
  try {
    const result = await db.collection('comments').insertOne(newPost);
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Post Routes

// Create a new post
app.post('/api/posts/create', async (req, res) => {
  const newPost = req.body;
  try {
    const result = await db.collection('posts').insertOne(newPost);
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Get a specific post
app.get('/api/post/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await db.collection('posts').findOne(query)
  res.send(result);
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
  console.log(req.body);
  try {
    const updatedPost = {
      $set: req.body,
    };
    const result = await db.collection('posts').updateOne({ _id: new ObjectId(req.params.id) }, updatedPost);
    const post = await db.collection('posts').findOne({_id:new ObjectId(req.params.id)});
    console.log(post);
    res.json(post);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Create a new comment
app.post('/api/comments', async (req, res) => {
  const newComment = req.body;
  try {
    const result = await db.collection('comments').insertOne(newComment);
    res.send(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Get comments for a specific post
app.get('/api/comments/post/:postId', async (req, res) => {
  try {
    const comments = await db.collection('comments').find({ postId: req.params.postId }).toArray();
    res.json(comments);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Update a comment
app.put('/api/comments/:id', async (req, res) => {
  try {
    const updatedComment = {
      $set: req.body,
    };
    const result = await db.collection('comments').updateOne({ _id: new ObjectId(req.params.id) }, updatedComment);
    res.json(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Delete a comment
app.delete('/api/comments/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Add a post to the wishlist
app.post('/api/wishlist', jwtVerify, async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const result = await db.collection('wishlist').insertOne({ userId, postId });
    res.send(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Remove a post from the wishlist
app.delete('/api/wishlist/:id', jwtVerify, async (req, res) => {
  try {
    const result = await db.collection('wishlist').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// Get wishlist items for a user
app.get('/api/wishlist/user/:userId', jwtVerify, async (req, res) => {
  try {
    const wishlist = await db.collection('wishlist').find({ userId: req.params.userId }).toArray();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
