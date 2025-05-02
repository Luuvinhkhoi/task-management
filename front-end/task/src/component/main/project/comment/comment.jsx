import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux";
import task from "../../../../util/task";
import {io} from 'socket.io-client'
import './comment.css'
export const Comment=({taskId})=>{
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const avatar=useSelector(state=>state.userProfile.avatar)
    const lastname=useSelector(state=>state.userProfile.lastname)
    const firstname=useSelector(state=>state.userProfile.firstname)
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
            content:newComment, 
            user:{
              avatar:avatar,
              firstname:firstname,
              lastname:lastname
            }
          }
          task.createNewComment(data)
          socketRef.current.emit('new-comment', data)
          setNewComment("");
        } catch(error){
          console.log(error)
        }
      }
      useEffect(() => {
        if (commentsEndRef.current) {
          commentsEndRef.current.scrollTop = commentsEndRef.current.scrollHeight;
        }
      }, [comments])
    
      return(
          <div className="comment">
            <div style={{maxHeight:'200px', overflowY:'scroll', marginBottom:'1rem'}}   ref={commentsEndRef}>
              {comments.map((comment, index) => (
                <div key={index} className="comment-item" >
                  <div className="avatar">
                    <img src={comment.user.avatar? comment.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                  </div>
                  <div className="comment-content">
                    <div style={{fontSize:'14px', fontWeight:'600'}}>
                      <span>{comment.user.firstname}</span>
                      <span> </span>
                      <span>{comment.user.lastname}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
           <form onSubmit={submit}>
              <div>
                <img src={avatar? avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}}></img>
              </div>
              <textarea
                  placeholder="Thêm bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();   
                      submit(e);          
                    }
                  }}
              />
           </form>
        </div>
    )
}