import './dashboard.css'
import { Task } from './task/minitask';
import { Progress } from './progress/progress';
import { MiniUpcoming } from './upcoming/miniUpcoming';
import {  Distribution } from './distribution/distribution';
export const Dashboard = () =>{
  return(
    <div className='dashboard'>
        <div id='row1'>
          <Task></Task>
          <Distribution></Distribution>
        </div>
        <div id='row2'>
          <Progress></Progress>
          <MiniUpcoming></MiniUpcoming>
        </div>
    </div>
  )
}