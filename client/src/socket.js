import { io } from 'socket.io-client';

// Connect to your backend server
// This URL will be the 'server' service in Docker,
// but for local dev, we use localhost.
const URL = 'https://learnato-server.onrender.com';

export const socket = io(URL, {
  autoConnect: false // We'll connect manually
});