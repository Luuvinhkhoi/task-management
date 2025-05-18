import { ChevronRight, CircleUser } from 'lucide-react'
import './minitask.css'
import task from '../../../../util/task'
import { useNavigate} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react'
import { TaskDetail } from '../../taskDetail/taskDetail';
import { useTimezone } from '../../../../timezoneContext';
import { getAllTodayTask } from '../../../../store/todayTask';
export const Task = ({socket}) =>{
    const todayTask=useSelector(state=>state.todayTasks.tasks||[])
    const[isClick, setIsClick]=useState(null)
    const {t} = useTranslation()
    const navigate=useNavigate()
    const { timezone } = useTimezone();
    const dispatch=useDispatch()
    useEffect(()=>{
      dispatch(getAllTodayTask())
    },[])
    console.log(todayTask)
    return(
        <div id='task'>
          <div className='task-header'>
            <h3>{t('dashboard.todayTask')}</h3>
            <div onClick={()=>navigate('/today-task',{
              state:todayTask
            })} style={{cursor:'pointer'}}>
                {t('dashboard.seeAll')}
                <ChevronRight></ChevronRight>
            </div>
          </div>
          <div className='task-list' style={{ display: todayTask.length > 0 ? 'grid' : 'block' }} >
            {todayTask.length>0 ? todayTask.slice(0,2).map(task=>
              <div className='task-item' onClick={()=>setIsClick(task.id)}>
                  <div style={{display:'flex', gap:'1rem', alignContent:'center', justifyContent:'space-between'}}>
                    <h4>{task.title.length>20?task.title.slice(0,20)+'...':task.title}</h4>
                    <div className={`priority-${task.priority.toLowerCase()}`}>{t(`list.priority.${task.priority}`)}</div>
                  </div>
                  <p>{task.description.length>70?task.description.slice(0,70)+'...':task.description}</p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                        {task.user.length>3?(
                                  <>
                                      {task.user.slice(2).map(member=>
                                          <div>
                                              <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                                          </div>
                                      )}
                                      <div
                                          style={{
                                              borderRadius: '50%',
                                              height: '32px',
                                              width: '32px',
                                              backgroundColor: '#fff',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: '14px',
                                              fontWeight: 'bold',
                                              color:'black'
                                          }}
                                          >
                                          +{task.user.length - 2}
                                      </div>
                                  </>
                              ):(task.user.map(member=>
                                  <div>
                                      <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                                  </div>
                              ))
                            }
                    </div>
                    <div className='due'>
                        <Clock style={{height:'16px',width:'16px'}}></Clock>
                        <div style={{display:'flex', gap:'.5rem', fontSize:'14px'}}>
                                 <div>
                                    {new Intl.DateTimeFormat('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: timezone,
                                    }).format(new Date(task.endedAt))}
                                 </div>
                        </div>
                    </div>
                  </div>
              </div>
            ):<p>Tasks assigned to you will appear here. </p>}
          </div>
          {isClick !== null && todayTask && (
                <TaskDetail
                    socket={socket}
                    overlayId={isClick} 
                    setOverlayId={setIsClick}
                    taskId={isClick} 
                    projectId={todayTask.find(item => item.id === isClick)?.project_id}
                />
          )}  
          {todayTask.length>0?
          <div className='task-footer'>
              {todayTask.length >0 ?<p>You have {todayTask.length} tasks today. Keep it up!</p>:<p></p>}
          </div>:null}
        </div>
    )
}