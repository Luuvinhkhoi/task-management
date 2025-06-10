import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux";
import { useTimezone } from '../../../../timezoneContext';
import task from "../../../../util/task";
import {io} from 'socket.io-client'
import './comment.css'
export const Comment=({role,projectId,assignedUserId,socket,taskId})=>{
    const [comments, setComments] = useState([]);
    const { timezone } = useTimezone();
    const [newComment, setNewComment] = useState('');
    const userId=useSelector(state=>state.userProfile.id)
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
        socketRef.current = socket;

        // Join room của task sau khi kết nối thành công
        if (taskId) {
          socket.emit('join-task', taskId);
        }
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
        };
    }, [taskId]);
  
  // Thiết lập các socket event listeners
      const submit=async(e)=>{
        e.preventDefault()
        const formattedUsersId=assignedUserId.map(user=>user.value)
        try{
          const data={
            taskId:taskId,
            content:newComment, 
            actorId:userId,
            assignedUserId:formattedUsersId,
            user:{
              id: userId,
              avatar:avatar,
              firstname:firstname,
              lastname:lastname
            },
            message:`${lastname} ${firstname} vừa comment vào 1 task`,
            projectId: projectId,
            createdAt:new Date().toISOString()
          }
          const result2 = await task.createNoti(data)
          const socketData={
            notiId:result2,
            taskId:taskId,
            content:newComment, 
            actorId:userId,
            assignedUserId:formattedUsersId,
            user:{
              id: userId,
              avatar:avatar,
              firstname:firstname,
              lastname:lastname
            },
            message:`${lastname} ${firstname} vừa comment vào 1 task`,
            projectId: projectId,
            createdAt:new Date().toISOString()
          }
          task.createNewComment(data)
          socketRef.current.emit('new-comment', socketData)
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
          role==='viewer'?(
            <div className="comment">
              <div style={{maxHeight:'200px', overflowY:'scroll', marginBottom:'1rem'}}   ref={commentsEndRef}>
                {comments.map((comment, index) => (
                  <div key={index} className="comment-item" >
                    <div className="avatar">
                      <img src={comment.user.avatar? comment.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                    </div>
                    <div className="comment-content">
                      <div style={{fontSize:'14px', fontWeight:'600', display:'flex', justifyContent:'space-between'}}>
                        <div>
                          <span>{comment.user.firstname}</span>
                          <span> </span>
                          <span>{comment.user.lastname}</span>
                        </div>
                        <div style={{display:'flex', gap:'.5rem', fontSize:'14px'}}>
                          <div>
                                        {new Intl.DateTimeFormat('en-CA', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          timeZone: timezone,
                                        }).format(new Date(comment.createdAt))}
                          </div>
                          <div>{new Intl.DateTimeFormat('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true,
                                          timeZone: timezone,
                                        }).format(new Date(comment.createdAt))}
                          </div>
                        </div>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            
          </div>
          ):(
            <div className="comment">
              <div style={{maxHeight:'200px', overflowY:'scroll', marginBottom:'1rem'}}   ref={commentsEndRef}>
                {comments.map((comment, index) => (
                  <div key={index} className="comment-item" >
                    <div className="avatar">
                      <img src={comment.user.avatar? comment.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                    </div>
                    <div className="comment-content">
                      <div style={{fontSize:'14px', fontWeight:'600', display:'flex', justifyContent:'space-between'}}>
                        <div>
                          <span>{comment.user.firstname}</span>
                          <span> </span>
                          <span>{comment.user.lastname}</span>
                        </div>
                        <div style={{display:'flex', gap:'.5rem', fontSize:'14px'}}>
                          <div>
                                        {new Intl.DateTimeFormat('en-CA', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          timeZone: timezone,
                                        }).format(new Date(comment.createdAt))}
                          </div>
                          <div>{new Intl.DateTimeFormat('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true,
                                          timeZone: timezone,
                                        }).format(new Date(comment.createdAt))}
                          </div>
                        </div>
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
    )
}