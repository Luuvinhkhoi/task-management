import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchAuthSession } from 'aws-amplify/auth';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4001';

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
          return;
        }

        const socketInstance = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket'],
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
        });

        socketInstance.on('connect_error', (err) => {
          console.error('Socket connect error:', err.message);
        });
      } catch (err) {
        console.error('Socket setup error:', err);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
