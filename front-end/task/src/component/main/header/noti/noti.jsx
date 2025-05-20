import { useEffect, useState } from 'react'
import './noti.css'
import task from '../../../../util/task'
import { useTimezone } from '../../../../timezoneContext';
import { TaskDetail } from '../../taskDetail/taskDetail'
export const Notification=({socket,noti, setNoti, isClick, setIsClick})=>{
    const[isLoading,setIsLoading]=useState(true)
    const { timezone } = useTimezone();
    async function getAllNoti(){
        const result=await task.getAllNoti()
        if(result){
            setNoti(result)
        }
        setIsLoading(false)
    }
    useEffect(()=>{
      getAllNoti()
    },[])
    const handleClick=async(id)=>{
        try{
          const data={notiId:id}
          await task.updateNoti(data)
          getAllNoti()
        } catch(error){
          console.log(error)
        }
    }
    return(
        <div className='notification'>
            {isLoading
            ?(<div>Loading</div>):
            (noti.length>0?noti.map(item=>
              item.isRead?(
                <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center',cursor:'pointer'}} onClick={(e)=>{setIsClick(item.taskId),e.stopPropagation()}}>
                    <div style={{display:'flex', gap:'.5rem', alignItems:'center',cursor:'pointer'}}>
                      <img src={item.user.avatar?item.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                      <div>{item.message}</div>
                    </div>
                    <div style={{display:'flex', gap:'.5rem', alignItems:'baseline',cursor:'pointer'}}>
                      <div style={{fontSize:'12px', fontWeight:400}}>
                        {new Intl.DateTimeFormat('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          timeZone: timezone,
                        }).format(new Date(item.createdAt))}
                      </div>
                      <div style={{height:'8px', width:'8px', borderRadius:'1rem' }}></div>
                    </div>
                </div>
              ):(
                <div  key={item.id} style={{display:'flex',justifyContent:'space-between', alignItems:'center',cursor:'pointer'}} onClick={(e)=>{setIsClick(item.taskId),handleClick(item.id), e.stopPropagation()}}>
                    <div style={{display:'flex', gap:'.5rem', alignItems:'center',cursor:'pointer'}}>
                      <img src={item.user.avatar?item.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                      <div>{item.message}</div>
                    </div>
                    <div style={{display:'flex', gap:'.5rem', alignItems:'baseline',cursor:'pointer'}}>
                      <div style={{fontSize:'12px', fontWeight:400}}>
                        {new Intl.DateTimeFormat('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          timeZone: timezone,
                        }).format(new Date(item.createdAt))}
                      </div>
                      <div style={{ backgroundColor:'#007bff',height:'8px', width:'8px', borderRadius:'1rem' }}></div>
                    </div>
                </div>
              )
            ):(
                <div>You have no notifications from the last 30 days.</div>
            ))}
            {isClick !== null && noti.length>0 && (
                <TaskDetail 
                    socket={socket}
                    overlayId={isClick} 
                    setOverlayId={setIsClick} 
                    taskId={isClick} 
                    projectId={noti.find(item => item.taskId === isClick)?.projectId}
                />
            )}  
        </div>
    )
}