import { ChevronRight, CircleUser } from 'lucide-react'
import './task.css'
export const Task = () =>{
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
          <div className='task-footer'>
                <p>You have 5 tasks today. Keep it up!</p>
          </div>
        </div>
    )
}