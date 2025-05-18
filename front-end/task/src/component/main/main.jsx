import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import { Header } from "./header/header"
import { useEffect, useRef,useState } from "react"
import './main.css'
import {io} from 'socket.io-client'
export const Main = () =>{
  const SOCKET_URL = 'http://localhost:4001';
  const [socket, setSocket] = useState(null);
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
  return(
    <div className="main">
      <SideBar></SideBar>
      <div style={{height:'100%'}}>
        <Header socket={socket}></Header>
        <Outlet context={{socket}}></Outlet>
      </div>
    </div>
  )
}