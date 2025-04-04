import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {Settings, LayoutDashboard, FolderGit2, ChevronDown} from 'lucide-react'
import { AnimatePresence, motion} from 'framer-motion'
import task from '../../../util/task'
import './sidebar.css'
import app from '../../../assets/app.png'
import { useTranslation } from 'react-i18next';
export const SideBar = ()=>{
   let location=useLocation()
   const {t}=useTranslation()
   const [projects, setProject]=useState([])
   const [isOpen, setIsOpen]=useState('unActive')
   const navigate=useNavigate()
   const isActive=(path)=>{
     return location.pathname===path
   }
   const isSubActive = (subPath) => {
      return location.pathname === subPath
    }
   useEffect(() => {
      if (location.pathname.startsWith('/project')) {
        setIsOpen('active')
      }
    }, [location.pathname])
   useEffect(()=>{
      const fetchProjects = async () => {
         try {
           const result = await task.getAllProject();
           setProject(result); // Chỉ setProject nếu component vẫn còn mounted
         } catch (error) {
           console.error("Error fetching projects:", error);
         }
       };
      fetchProjects()
   },[])
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
                     {t('sideBar.dashboard')}
                  </div>
               </div>
               <div  className={`menuItem ${isActive('/project')?'active':''}`} onClick={()=>isOpen==='unActive'?setIsOpen('active'):setIsOpen('unActive')}>
                  <div style={{justifyContent:'space-between'}}>
                     <div style={{padding:'0', display:'flex', alignItems:'center', gap:'1rem'}}>
                        <FolderGit2></FolderGit2>
                        {t('sideBar.project')}
                     </div>
                     <ChevronDown style={{justifySelf:'end'}}></ChevronDown>
                  </div>
                  <AnimatePresence>
                     {isOpen === 'active' && (
                        <motion.div 
                           initial={{ height: 0, opacity: 0 }} 
                           animate={{ height: "auto", opacity: 1 }} 
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.3, ease: "easeOut" }}
                           className='projectList'
                        >
                           <ul>
                           {projects.map(project=>
                              <li onClick={() => navigate( `/project/${project.id}`)} className={isSubActive(`/project/${project.id}`) ? 'sub-active' : ''}>{project.title}</li>
                           )}
                           </ul>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
               <div onClick={()=>navigate('/setting')} className={`menuItem ${isActive('/setting')?'active':''}`}>
                  <div>
                     <Settings></Settings>
                     {t('sideBar.setting')}
                  </div>
               </div>
           </div>
        </div>
   )
}