import React, { useState } from 'react';

// We'll receive two props:
// 1. onPostCreated: A function to call to refresh the post list.
// 2. onCancel: A function to call to close the form.
function CreatePostForm({ onPostCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(''); // Optional: add author field
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from refreshing
    setError(null); // Clear previous errors

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author: author || 'Anonymous', // Use 'Anonymous' if author is empty
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // If successful:
      setTitle('');
      setContent('');
      setAuthor('');
      onPostCreated(); // Tell App.jsx to refresh the posts!

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Author Field (Optional) */}
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Content Field */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button" // Important: type="button" so it doesn't submit the form
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Submit Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;