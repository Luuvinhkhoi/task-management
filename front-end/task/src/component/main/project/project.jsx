import { useState } from 'react'
import { useLocation, useNavigate, useParams, Outlet } from 'react-router-dom'
import './project.css'
import { Kanban }   from './kanban/kanban'
export const Project = ()=>{
    const [isActive, setActive]=useState()
    const location=useLocation()
    const navigate=useNavigate()
    let param=useParams()
    function listActive(){
      if(location.pathname.endsWith('list')){
        return true
      } else{
        return false
      }
    }
    return (
        <div className="project">
           <div className='projectHeader'>
             <div className={`projectHeader-${listActive()?'unActive':'active'}`} onClick={()=>navigate(`/project/${param.id}`)}>Kanban board</div>
             <div className={`projectHeader-${listActive()?'active':'unActive'}`} onClick={()=>navigate(`/project/${param.id}/list`)}>List</div>
           </div>
           <Outlet></Outlet>
        </div>
    )
}