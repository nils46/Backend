import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// 1. Import our components
import App from './App.jsx';
import PostPage from './PostPage.jsx';
import Root from './Root.jsx'; // <-- Import Root
import './index.css';

// 2. Define our routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // <-- Use Root as the main layout
    children: [
      {
        path: "/", // Home page
        element: <App />,
      },
      {
        path: "/posts/:id", // Detail page
        element: <PostPage />,
      },
    ],
  },
]);

// 3. Render the router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);