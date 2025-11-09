import React from 'react';
import { Link } from 'react-router-dom';

function PostListItem({ post }) {

  // Function to handle upvoting
  const handleUpvote = async () => {
    try {
      // Send the request to the server
      await fetch(`http://localhost:8080/api/posts/${post.id}/upvote`, {
        method: 'POST',
      });
      
      // No need to do anything else here.
      // The server will emit 'post_updated' and App.jsx will catch it.
      
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">
        {/* Link to the post's detail page */}
        <Link to={`/posts/${post.id}`} className="hover:text-blue-300">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-400 mb-4">
        Posted by: {post.author}
      </p>
      
      {/* Show the post content */}
      <p className="text-gray-200 mb-4">
        {post.content}
      </p>

      <div className="flex justify-between items-center text-gray-500">
        <span>Votes: {post.votes}</span>
        <span>Replies: {post.replies.length}</span>
        
        {/* Link to the post's detail page */}
        <Link to={`/posts/${post.id}`} className="text-blue-400 hover:text-blue-300">
          View Replies →
        </Link>
      </div>

      <div className="mt-4">
        {/* Upvote Button */}
        <button 
          onClick={handleUpvote} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Upvote
        </button>
      </div>
    </div>
  );
}

export default PostListItem;