import React from 'react';
import './upcoming.css';
import task from '../../../../util/task';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
export const Upcoming = () => {
  const [todayTask, setTodayTask]=useState([])
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
    <div id='upcoming'>
        <div className='upcomingTask-header'>
            <h3>Upcoming Tasks</h3>
            <div>
                See All 
                <ChevronRight></ChevronRight>
            </div>
        </div>
        <div className='upcomingTask-list'>
            {todayTask.length>0 ? todayTask.slice(0,2).map(task=>
              <div className='upcomingTask-item'>
                  <h4>{task.title}</h4>
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
