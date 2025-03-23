import './dashboard.css'
import { Task } from './task/task';
import { Calendar } from './calendar/calendar';
import { Progress } from './progress/progress';
import { TimelineElement } from './timeline/timeline';
export const Dashboard = () =>{
  return(
    <div className='dashboard'>
        <div id='row1'>
          <Task></Task>
          <Calendar></Calendar>
        </div>
        <div id='row2'>
          <Progress></Progress>
          <TimelineElement></TimelineElement>
        </div>
    </div>
  )
}