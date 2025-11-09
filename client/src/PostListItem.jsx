import React from 'react';
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words'; // 1. Import the highlighter
import { FaArrowUp, FaCommentAlt } from 'react-icons/fa'; // (Using icons from "better UI" step)

// 2. Accept 'searchTerm' as a prop
function PostListItem({ post, searchTerm }) {

  const handleUpvote = async () => {
    try {
      // Use your deployed Render URL here
      await fetch(`https://learnato-server.onrender.com/api/posts/${post.id}/upvote`, {
        method: 'POST',
      });
      // The socket.io listener in App.jsx will handle the update
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4 
                    border border-transparent 
                    transition-all duration-200 
                    hover:border-blue-500 hover:shadow-xl">
      
      <h2 className="text-xl font-semibold mb-2">
        <Link to={`/posts/${post.id}`} className="hover:text-blue-300">
          {/* 3. Wrap the title with the Highlighter */}
          <Highlighter
            highlightClassName="bg-yellow-300 text-black" // Style the highlight
            searchWords={[searchTerm]} // The word(s) to find
            autoEscape={true}
            textToHighlight={post.title} // The text to search in
          />
        </Link>
      </h2>
      
      <p className="text-gray-400 mb-4">
        Posted by: {post.author}
      </p>
      
      {/* 4. Wrap the content with the Highlighter */}
      <p className="text-gray-200 mb-4">
        <Highlighter
          highlightClassName="bg-yellow-300 text-black"
          searchWords={[searchTerm]}
          autoEscape={true}
          textToHighlight={post.content}
        />
      </p>

      {/* --- (Rest of the file is the same) --- */}
      <div className="flex justify-between items-center text-gray-500">
        <div className="flex items-center gap-1">
          <FaArrowUp /> 
          <span>{post.votes}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCommentAlt />
          <span>{post.replies.length}</span>
        </div>
        
        <Link to={`/posts/${post.id}`} className="text-blue-400 hover:text-blue-300">
          View Replies →
        </Link>
      </div>

      <div className="mt-4">
        <button 
          onClick={handleUpvote} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded
                     flex items-center gap-2 
                     transition-colors duration-200"
        >
          <FaArrowUp /> Upvote
        </button>
      </div>
    </div>
  );
}

export default PostListItem;