import './dashboard.css'
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Task } from './task/minitask';
import { Progress } from './progress/progress';
import { MiniUpcoming } from './upcoming/miniUpcoming';
import {  Distribution } from './distribution/distribution';
import task from '../../../util/task';
export const Dashboard = () =>{
  const todayTask=useSelector(state=>state.todayTasks.tasks||[])
  const upcomingTask=useSelector(state=>state.upcomingTasks.tasks||[])
  const projects=useSelector(state=>state.projects.projects)
  const [tasks, setTask]=useState([])
  const [progress, setProgress]=useState([])
  const { socket } = useOutletContext();
  useEffect(() => {
    if (!socket) return;

    socket.on('new-task', (task) => {
      const today = new Date().toISOString().split('T')[0];
      const taskDeadline = task.deadline.split('T')[0];
      
      if (task.assignee === currentUser.id && taskDeadline === today) {
        dispatch(addTask(task));
      }
    });

    return () => {
      socket.off('new-task');
    };
  }, [socket]);
  useEffect(()=>{
    async function getTask(){
      try{
        const result=await task.getAllTaskForUser()
        if(result){
            setTask(result)
        }
      } catch(error){
          console.log(error)
      }
    }
    getTask()
  },[todayTask, upcomingTask])
  useEffect(()=>{
     const fetchProgress=async ()=>{
       try{
        const result=await task.getProjectProgress()
        if(result){
          setProgress(result)
        }
       }catch(error){
        console.log(error)
       }
     }
     fetchProgress()
  }, [])
  return(
    <div className='dashboard'>
        <div id='row1'>
          <Task></Task>
          <Distribution tasks={tasks}></Distribution>
        </div>
        <div id='row2'>
          <Progress progress={progress}></Progress>
          <MiniUpcoming></MiniUpcoming>
        </div>
    </div>
  )
}