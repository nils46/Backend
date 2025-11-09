import React, { useState, useEffect } from 'react';
import PostListItem from './PostListItem';
import CreatePostForm from './CreatePostForm';
import { socket } from './socket'; // 1. Import the shared socket

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // State to toggle form

  // --- API Call ---
  // This function is just for the *initial* page load
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://learnato-server.onrender.com/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  // --- Socket.io Listeners ---
 // ... in client/src/App.jsx

  useEffect(() => {
    // Function to handle a 'post_created' event
    function onPostCreated(newPost) {
      setPosts((currentPosts) => [...currentPosts, newPost].sort((a, b) => b.votes - a.votes));
    }

    // --- THIS IS THE CRITICAL FUNCTION ---
    // It listens for upvotes
    function onPostUpdated(updatedPost) {
      setPosts((currentPosts) =>
        currentPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
                   .sort((a, b) => b.votes - a.votes)
      );
    }
    // --------------------------------------
    
    // Add both listeners
    socket.on('post_created', onPostCreated);
    socket.on('post_updated', onPostUpdated); // <-- Make sure this line exists
    
    fetchPosts();

    // Clean up listeners
    return () => {
      socket.off('post_created', onPostCreated);
      socket.off('post_updated', onPostUpdated); // <-- Make sure this line exists
    };
  }, []); // The empty array [] means "run this only once"

// ... // The empty array [] means "run this only once"

  // This function will be passed to the form
  const handlePostCreated = () => {
    setShowForm(false); // Hide form
    // We NO LONGER need fetchPosts() here.
    // The 'post_created' socket event will handle the update!
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <nav className="bg-gray-800 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-center">
          Learnato Discussion Forum
        </h1>
      </nav>

      <main>
        {/* New Post Button / Form */}
        <div className="mb-4">
          {showForm ? (
            <CreatePostForm 
              onPostCreated={handlePostCreated}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowForm(true)} // Click to show the form
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
            >
              + New Post
            </button>
          )}
        </div>

        {/* Post List */}
        <div className="post-list">
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            // Map over the "posts" state and render a component for each one
            // The 'onVote' prop is no longer needed
            posts.map((post) => (
              <PostListItem 
                key={post.id} 
                post={post} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;