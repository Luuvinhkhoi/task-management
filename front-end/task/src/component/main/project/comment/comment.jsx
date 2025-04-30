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
        const socket = io(SOCKET_URL,{
          withCredentials:true
        })
        socketRef.current = socket;
        // Xử lý các sự kiện socket
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          
          // Join room của task sau khi kết nối thành công
          if (taskId) {
            socket.emit('join-room', taskId);
          }
        });
        socket.on('receive-comment', (newComment) => {
          setComments(prev => [...prev, newComment]); // ✅ Cập nhật UI
        });
      
        socket.on('connect_error', (error) => {
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
          socket.emit('leave-room', taskId);
          socket.off('chat message');
        };
    }, [taskId]);
  
  // Thiết lập các socket event listeners
      const submit=async(e)=>{
        e.preventDefault()
        try{
          console.log('hihi')
          const data={
            taskId:taskId,
            content:newComment
          }
          task.createNewComment(data)
          socketRef.current.emit('new-comment', data)
          setNewComment("");
        } catch(error){
          console.log(error)
        }
      }
    
      return(
          <div className="comment">
            {comments.map(item=>
            <div>{item.content}</div>
           )}
           <form onSubmit={submit}>
             <input  value={newComment} onChange={(e) => setNewComment(e.target.value)}></input>
             <button type="submit">Upload</button>
           </form>
        </div>
    )
}