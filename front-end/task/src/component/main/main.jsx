import { Outlet } from "react-router-dom"
import { SideBar } from "./sidebar/sidebar"
import { Header } from "./header/header"
import { useEffect, useRef,useState } from "react"
import { useDispatch } from "react-redux"
import { getAllSetting } from "../../store/setting"
import './main.css'
import { SocketProvider } from "../../../socketContext"
import task from "../../util/task"
export const Main = () =>{
  const SOCKET_URL =import.meta.env.VITE_SOCKET_URL || 'http://localhost:4001';
  const [socket, setSocket] = useState(null);
  const [role, setRole]=useState(null)
  const dispatch=useDispatch()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  useEffect(() => {
    dispatch(getAllSetting())
  }, []);
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
    <SocketProvider>
      <div className="main">
        <div style={{height:'100%'}}>
          <Header role={role} onClose={()=>setIsSidebarOpen(false)} onToggleSidebar={() => setIsSidebarOpen(prev=>!prev)}></Header>
          <div className='second-child' style={{display:'flex',width:'100vw'}}>
            <SideBar role={role} isMobile={isMobile} isSideBarOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}></SideBar>
            <Outlet context={{role}}></Outlet>
          </div>
        </div>
      </div>
    </SocketProvider>
  )
}