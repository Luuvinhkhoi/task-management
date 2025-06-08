import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import { Header } from "./header/header"
import { useEffect, useRef,useState } from "react"
import './main.css'
import {io} from 'socket.io-client'
import task from "../../util/task"
export const Main = () =>{
  const SOCKET_URL = 'http://localhost:4001';
  const [socket, setSocket] = useState(null);
  const [role, setRole]=useState(null)
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
      if (window.innerWidth >= 1200) {
        setIsSidebarOpen(false); // reset trạng thái khi không còn mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
      // Tạo socket connection
          const socket = io(SOCKET_URL,{
            withCredentials:true
          })
          setSocket(socket)
          // Xử lý các sự kiện socket
          socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
          })
        
          socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
          });
          socket.on()
          
          // Cleanup khi component unmount
          return () => {
            // Ngắt các event listener nếu có
            socket.off();

            // Đóng kết nối socket
            socket.disconnect();
          };
  }, []);
  useEffect(()=>{
    async function setUserRole(){
        try{
            const result=await task.getAllUserRole()
            console.log('hihi')
            setRole(result)
        }catch(error){
            console.log(error)
        }
    }
    setUserRole()
  },[])
  console.log(role)
  return(
    <div className="main">
      <div style={{height:'100%'}}>
        <Header socket={socket} role={role} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}></Header>
        <div style={{display:'flex', height:'100vh', width:'100vw'}}>
          <SideBar role={role} isMobile={isMobile} isSideBarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}></SideBar>
          <Outlet context={{socket, role}}></Outlet>
        </div>
      </div>
    </div>
  )
}