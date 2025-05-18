import { useEffect, useState } from 'react'
import './noti.css'
import { TaskDetail } from '../../taskDetail/taskDetail'
export const Notification=({noti, isClick, setIsClick})=>{
    return(
        <div className='notification'>
            {noti.length>0?noti.map(item=>
                <div style={{display:'flex', gap:'.5rem', alignItems:'center',cursor:'pointer'}} onClick={()=>setIsClick(item.taskId)}>
                    <img src={item.actorAvatar} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                    <div>{item.message}</div>
                </div>
            ):(
                <div>You have no notifications from the last 30 days.</div>
            )}
            {isClick !== null && noti.length>0 && (
                <TaskDetail 
                    overlayId={isClick} 
                    setOverlayId={setIsClick} 
                    taskId={isClick} 
                    projectId={noti.find(item => item.taskId === isClick)?.projectId}
                />
            )}  
        </div>
    )
}