import React, { useState, useEffect } from 'react';
import PostListItem from './PostListItem';
import CreatePostForm from './CreatePostForm';
import { socket } from './socket';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search bar

  // --- API Call ---
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
  useEffect(() => {
    function onPostCreated(newPost) {
      setPosts((currentPosts) => [...currentPosts, newPost].sort((a, b) => b.votes - a.votes));
    }

    function onPostUpdated(updatedPost) {
      setPosts((currentPosts) =>
        currentPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
                   .sort((a, b) => b.votes - a.votes)
      );
    }
    
    socket.on('post_created', onPostCreated);
    socket.on('post_updated', onPostUpdated);
    
    fetchPosts();

    return () => {
      socket.off('post_created', onPostCreated);
      socket.off('post_updated', onPostUpdated);
    };
  }, []);

  const handlePostCreated = () => {
    setShowForm(false);
  };

  // --- Search Bar Logic ---
  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(term);
    const contentMatch = post.content.toLowerCase().includes(term);
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
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
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                + New Post
              </button>
            )}
          </div>

          {/* --- Search Bar --- */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* --- Post List --- */}
          <div className="post-list">
            {loading ? (
              <p>Loading posts...</p>
            ) : (
              filteredPosts.map((post) => (
                <PostListItem 
                  key={post.id} 
                  post={post}
                  searchTerm={searchTerm} // <-- THIS IS THE MISSING LINE**
                />
              ))
            )}

            {!loading && filteredPosts.length === 0 && (
              <p className="text-gray-400 text-center">No posts found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;