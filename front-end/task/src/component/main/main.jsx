import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import { Header } from "./header/header"
import { useEffect, useRef } from "react"
import './main.css'
import {io} from 'socket.io-client'
export const Main = () =>{
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
          })
        
          socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
          });
          socket.on()
          
          // Cleanup khi component unmount
          return () => {
            socket.emit('leave-room');
            socket.off('chat message');
          };
  }, []);
  return(
    <div className="main">
      <SideBar></SideBar>
      <div style={{height:'100%'}}>
        <Header socket={socketRef.current}></Header>
        <Outlet context={{socket: socketRef.current}}></Outlet>
      </div>
    </div>
  )
}