import React from 'react';
import './miniupcoming.css';
import task from '../../../../util/task';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
export const MiniUpcoming = () => {
  const [todayTask, setTodayTask]=useState([])
  const navigate=useNavigate()
  useEffect(()=>{
    async function getTask(){
      try{
        const result=await task.getUpcomingTask()
        if(result){
          setTodayTask(result)
        }
      } catch(error){
          console.log(error)
      }
    }
    getTask()
  },[])
  return (
    <div id='mini-upcoming'>
        <div className='upcomingTask-header'>
            <h3>Upcoming Tasks</h3>
            <div onClick={()=>navigate('/upcoming-task',{
              state:todayTask
            })}>
                See All 
                <ChevronRight></ChevronRight>
            </div>
        </div>
        <div className='upcomingTask-list'>
            {todayTask.length>0 ? todayTask.slice(0,2).map(task=>
              <div className='upcomingTask-item'>
                  <div style={{display:'flex', gap:'1rem', alignContent:'center'}}>
                    <h4>{task.title}</h4>
                    <div className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</div>
                  </div>
                  <p>{task.description}</p>
                  <div className='upcomingTask-member' style={{display:'flex', gap:'.5rem'}}>
                      {task.user.map(member=>
                          <div>
                              <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{height:'32px', width:'32px', borderRadius:'10rem'}} alt="Avatar" />
                          </div>
                      )}
                  </div>
              </div>
            ):<p>Tasks assigned to you will appear here. </p>}
        </div>
    </div>
  )
};
