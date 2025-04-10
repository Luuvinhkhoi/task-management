import { ChevronRight, CircleUser } from 'lucide-react'
import './task.css'
import task from '../../../../util/task'
import { useEffect, useState } from 'react'
export const Task = () =>{
    const [todayTask, setTodayTask]=useState([])
    useEffect(()=>{
      async function getTask(){
        try{
          const result=await task.getTodayTask()
          if(result){
            setTodayTask(result)
          }
        } catch(error){
          console.log(error)
        }
      }
      getTask()
    },[])
    return(
        <div id='task'>
          <div className='task-header'>
            <h3>Today Tasks</h3>
            <div>
                See All 
                <ChevronRight></ChevronRight>
            </div>
          </div>
          <div className='task-list'>
            {todayTask.length>0 ? todayTask.map(task=>
              <div className='task-item'>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                      {task.user && Array.isArray(task.user) ? task.user.map(member=>
                          <div>
                              <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{height:'32px', width:'32px', borderRadius:'10rem'}} alt="Avatar" />
                          </div>
                      ):null}
                  </div>
              </div>
            ):<p>Tasks assigned to you will appear here. </p>}
          </div>
          {todayTask.length>0?
          <div className='task-footer'>
              {todayTask.length >0 ?<p>You have {todayTask.length} tasks today. Keep it up!</p>:<p></p>}
          </div>:null}
        </div>
    )
}