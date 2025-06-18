import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import { Header } from "./header/header"
import { useEffect, useRef,useState } from "react"
import './main.css'
import {io} from 'socket.io-client'
import task from "../../util/task"
import { fetchAuthSession } from "aws-amplify/auth"
export const Main = () =>{
  const SOCKET_URL =import.meta.env.VITE_SOCKET_URL || 'http://localhost:4001';
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
  async function connectSocket() {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
          console.warn('No token available. User might not be signed in.');
          return;
        }

        const socketInstance = io(SOCKET_URL, {
          auth: {
            token
          },
          transports: ['websocket'],
          secure: true
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
          console.log('Socket connected');
        });

        socketInstance.on('connect_error', err => {
          console.error('Socket error:', err.message);
        });

      } catch (error) {
        console.error('Lỗi khi lấy token từ Amplify:', error);
      }
    }

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  useEffect(()=>{
    async function setUserRole(){
        try{
            const result=await task.getAllUserRole()
            setRole(result)
        }catch(error){
        }
    }
    setUserRole()
  },[])
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