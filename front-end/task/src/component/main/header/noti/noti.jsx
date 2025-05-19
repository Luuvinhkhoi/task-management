import { useEffect, useState } from 'react'
import './noti.css'
import task from '../../../../util/task'
import { TaskDetail } from '../../taskDetail/taskDetail'
export const Notification=({noti, setNoti, isClick, setIsClick})=>{
    const[isLoading,setIsLoading]=useState(true)
    useEffect(()=>{
      async function getAllNoti(){
        const result=await task.getAllNoti()
        if(result){
            setNoti(result)
        }
        setIsLoading(false)
      }
      getAllNoti()
    },[])
    
    return(
        <div className='notification'>
            {isLoading
            ?(<div>Loading</div>):
            (noti.length>0?noti.map(item=>
                <div style={{display:'flex', gap:'.5rem', alignItems:'center',cursor:'pointer'}} onClick={()=>setIsClick(item.taskId)}>
                    <img src={item.user.avatar?item.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                    <div>{item.message}</div>
                </div>
            ):(
                <div>You have no notifications from the last 30 days.</div>
            ))}
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