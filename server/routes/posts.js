const express = require('express');
const router = express.Router(); // <-- This line fixes the "router is not defined" error

// --- In-Memory "Database" ---
let db = {
  posts: [
    { 
      id: 1, 
      title: "How do I deploy Node.js on Cloud Run?", 
      content: "I've tried gcloud build... but it's not working.",
      author: "Rohan",
      votes: 5,
      replies: [
        { id: 1, author: "Jane", content: "Use gcloud CLI with region flag" },
        { id: 2, author: "Admin", content: "Enable Cloud Build first!" }
      ],
      createdAt: new Date()
    }
  ]
};

// --- API Endpoints (MVP) ---

/**
 * GET /api/posts
 * Get all posts.
 */
router.get('/', (req, res) => {
  // Sort by votes (descending)
  const sortedPosts = [...db.posts].sort((a, b) => b.votes - a.votes);
  res.json(sortedPosts);
});

/**
 * POST /api/posts
 * Create a new post.
 * Body: { title: "...", content: "...", author: "..." }
 */
router.post('/', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const newPost = {
    id: db.posts.length + 1, // Simple ID generation
    title,
    content,
    author: author || "Anonymous", // Default author
    votes: 0,
    replies: [],
    createdAt: new Date()
  };

  db.posts.push(newPost);
  
  // --- SOCKET.IO EMIT ---
  // Broadcast a 'post_created' event to ALL connected clients
  req.io.emit('post_created', newPost);
  
  res.status(201).json(newPost); // Return the newly created post
});

/**
 * GET /api/posts/:id
 * Get a single post by its ID with replies.
 */
router.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = db.posts.find(p => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

/**
 * POST /api/posts/:id/upvote
 * Upvote a post.
 */
router.post('/:id/upvote', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = db.posts.find(p => p.id === postId);

  if (post) {
    post.votes++;
    
    // --- SOCKET.IO EMIT ---
    // This makes the upvote real-time
    req.io.emit('post_updated', post);
    
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

/**
 * POST /api/posts/:id/reply
 * Add a reply to a post.
 * Body: { content: "...", author: "..." }
 */
router.post('/:id/reply', (req, res) => {
  const postId = parseInt(req.params.id);
  const { content, author } = req.body;
  const post = db.posts.find(p => p.id === postId);

  if (!content) {
    return res.status(400).json({ error: "Reply content is required." });
  }

  if (post) {
    const newReply = {
      id: post.replies.length + 1, // Simple ID
      content,
      author: author || "Anonymous",
      createdAt: new Date()
    };
    post.replies.push(newReply);
    
    // --- SOCKET.IO EMIT ---
    // This makes the new reply show up in real-time
    req.io.emit('post_updated', post);
    
    res.status(201).json(post); // Return the whole updated post
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

module.exports = router;