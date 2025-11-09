import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { useParams, Link } from 'react-router-dom';
import { socket } from './socket';

function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  
  const { id } = useParams();

  // 2. Wrap fetchPost in useCallback
  // This function now only re-creates itself if 'id' changes.
  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
    setLoading(false);
  }, [id]); // It depends on 'id'

  // 3. Wrap onPostUpdated in useCallback
  // This function also only re-creates itself if 'id' changes.
  const onPostUpdated = useCallback((updatedPost) => {
    if (updatedPost.id === parseInt(id)) {
      setPost(updatedPost);
    }
  }, [id]); // It depends on 'id'

  // 4. Update the useEffect hook
  useEffect(() => {
    // Add our listener
    socket.on('post_updated', onPostUpdated);
    
    // Fetch the initial post data
    fetchPost();

    // Clean up *only the listener* on component unmount
    return () => {
      socket.off('post_updated', onPostUpdated);
    };
  }, [fetchPost, onPostUpdated]); // 5. Now the dependencies are stable!

  // Handle submitting a new reply
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent) return;

    try {
      await fetch(`http://localhost:8080/api/posts/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, author: 'User' }),
      });
      setReplyContent('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  // ... (rest of the file is identical)

  if (loading) {
    return <p className="text-white p-8">Loading post...</p>;
  }

  if (!post) {
    return <p className="text-white p-8">Post not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="mb-4">
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          &larr; Back to all posts
        </Link>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        <p className="text-gray-400 mb-4">Posted by: {post.author}</p>
        <p className="text-gray-200 text-lg">{post.content}</p>
        <div className="mt-4 text-gray-500">
          <span>Votes: {post.votes}</span>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Replies ({post.replies.length})</h2>
      <form onSubmit={handleReplySubmit} className="bg-gray-800 p-4 rounded-lg mb-6">
        <textarea
          rows="3"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Write your reply..."
          className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-2">
          Add Reply
        </button>
      </form>
      <div className="replies-list space-y-4">
        {post.replies.length > 0 ? (
          post.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold text-blue-300">{reply.author}</p>
              <p>{reply.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No replies yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}

export default PostPage;