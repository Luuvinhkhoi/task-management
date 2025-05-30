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
      <SideBar role={role}></SideBar>
      <div style={{height:'100%'}}>
        <Header socket={socket} role={role}></Header>
        <Outlet context={{socket, role}}></Outlet>
      </div>
    </div>
  )
}