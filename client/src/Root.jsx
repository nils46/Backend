import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { socket } from './socket';

function Root() {
  // This effect runs once when the app loads
  // and stays active for the app's lifetime.
  useEffect(() => {
    console.log('Socket connecting...');
    socket.connect();

    // Clean up the connection when the app is closed
    return () => {
      console.log('Socket disconnecting...');
      socket.disconnect();
    };
  }, []); // Empty array means run once on mount

  // <Outlet /> renders the current page (App.jsx or PostPage.jsx)
  return <Outlet />;
}

export default Root;