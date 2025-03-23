import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {Settings, LayoutDashboard, FolderGit2, ChevronDown} from 'lucide-react'
import {motion} from 'framer-motion'
import './sidebar.css'
import app from '../../../assets/app.png'
export const SideBar = ()=>{
   let location=useLocation()
   const [isOpen, setIsOpen]=useState('unActive')
   const navigate=useNavigate()
   const isActive=(path)=>{
     return location.pathname===path
   }
   return (
        <div className="sideBar">
           <div className='brand'>
               <img src={app} style={{width:'48px', height:'48px'}}></img>
               <h3>TASK</h3>
           </div>
           <div className='menu'>
               <div onClick={()=>navigate('/')} className={`menuItem ${isActive('/')?'active':''}`}>
                  <div>
                     <LayoutDashboard></LayoutDashboard>
                     Dashboard
                  </div>
               </div>
               <div  className={`menuItem ${isActive('/project')?'active':''}`} onClick={()=>isOpen==='unActive'?setIsOpen('active'):setIsOpen('unActive')}>
                  <div style={{justifyContent:'space-between'}}>
                     <div style={{padding:'0', display:'flex', alignItems:'center', gap:'1rem'}}>
                        <FolderGit2></FolderGit2>
                        Project
                     </div>
                     <ChevronDown style={{justifySelf:'end'}}></ChevronDown>
                  </div>
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: isOpen==='active' ? "auto" : 0, opacity: isOpen ==='active'? 1 : 0 }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className='projectList'
                  >
                     <ul>
                        <li>Project A</li>
                        <li>Project B</li>
                        <li>Project C</li>
                        <li>Project D</li>
                     </ul>
                  </motion.div>
               </div>
               <div onClick={()=>navigate('/setting')} className={`menuItem ${isActive('/setting')?'active':''}`}>
                  <div>
                     <Settings></Settings>
                     Setting
                  </div>
               </div>
           </div>
        </div>
   )
}