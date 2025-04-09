import { ChevronRight, CircleUser } from 'lucide-react'
import './task.css'
import task from '../../../../util/task'
import { useEffect, useState } from 'react'
export const Task = () =>{
    const [todayTask, setTodayTask]=useState()
    useEffect(()=>{
      async function getTask(){
        try{
          const result=await task.getTodayTask()
          console.log(result)
          setTodayTask(result)
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
            <div className='task-item'>
                <h4>Delievery App Kit</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adip incididunt ut labore et dolore magna aliqua.</p>
                <div className='task-member'>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                </div>
                <div className='task-progress'>
                    <div></div>
                </div>
            </div>
            <div className='task-item'>
                <h4>Delievery App Kit</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adip incididunt ut labore et dolore magna aliqua.</p>
                <div className='task-member'>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                  <CircleUser></CircleUser>
                </div>
                <div className='task-progress'>
                    <div></div>
                </div>
            </div>
          </div>
        </div>
    )
}