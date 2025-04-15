import { ChevronRight, CircleUser } from 'lucide-react'
import './minitask.css'
import task from '../../../../util/task'
import { useNavigate} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react'
export const Task = () =>{
    const [todayTask, setTodayTask]=useState([])
    const {t} = useTranslation()
    const navigate=useNavigate()
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
            <h3>{t('dashboard.todayTask')}</h3>
            <div onClick={()=>navigate('/today-task',{
              state:todayTask
            })}>
                {t('dashboard.seeAll')}
                <ChevronRight></ChevronRight>
            </div>
          </div>
          <div className='task-list' style={{ display: todayTask.length > 0 ? 'grid' : 'block' }} >
            {todayTask.length>0 ? todayTask.slice(0,2).map(task=>
              <div className='task-item'>
                  <div style={{display:'flex', gap:'1rem', alignContent:'center'}}>
                    <h4>{task.title}</h4>
                    <div className={`priority-${task.priority.toLowerCase()}`}>{t(`list.priority.${task.priority}`)}</div>
                  </div>
                  <p>{task.description}</p>
                  <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                      {task.user.map(member=>
                          <div>
                              <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{height:'32px', width:'32px', borderRadius:'10rem'}} alt="Avatar" />
                          </div>
                      )}
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