import { useEffect, useState, useRef } from "react"
import task from "../../../../util/task";
import {io} from 'socket.io-client'
export const Comment=({taskId})=>{
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const commentsEndRef = useRef(null);
    const socketRef = useRef(null)
    const SOCKET_URL = 'http://localhost:4001';
     useEffect(() => {
    // Tạo socket connection
    const newSocket = io(SOCKET_URL)
        
    // Xử lý các sự kiện socket
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      
      // Join room của task sau khi kết nối thành công
      if (taskId) {
        newSocket.emit('join-room', taskId);
      }
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setError('Failed to connect to the comment service. Please refresh the page.');
    });
    
    // Fetch comments ban đầu từ API
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await task.getComment(taskId)
        setComments(response);
        setError(null);
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (taskId) {
      fetchComments();
    }
    
    // Cleanup khi component unmount
    return () => {
      if (socketRef.current) {
        // Leave room trước khi disconnect
        if (taskId) {
          socketRef.current.emit('leave-room', taskId);
        }
        
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [taskId]);
  
  // Thiết lập các socket event listeners
  
    return(
        <div className="comment"></div>
    )
}