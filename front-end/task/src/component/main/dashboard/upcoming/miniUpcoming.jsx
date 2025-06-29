import React from 'react';
import './miniupcoming.css';
import task from '../../../../util/task';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TaskDetail } from '../../taskDetail/taskDetail';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { useTimezone } from '../../../../timezoneContext';
import { getAllUpcomingTask } from '../../../../store/upcomingTask';
export const MiniUpcoming = ({socket}) => {
  const upcomingTask=useSelector(state=>state.upcomingTasks.tasks||[])
  const theme=useSelector(state=>state.setting.darkMode)
  const[isClick, setIsClick]=useState(null)
  const {t}=useTranslation()
  const { timezone } = useTimezone();
  const navigate=useNavigate()
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getAllUpcomingTask())
  },[])
  return (
    <div id='mini-upcoming'>
        <div className='upcomingTask-header'>
            <h3>{t('dashboard.upcomingTask')}</h3>
            <div onClick={()=>navigate('/upcoming-task',{
              state:upcomingTask
            })} style={{cursor:'pointer'}}>
                {t('dashboard.seeAll')}
                <ChevronRight></ChevronRight>
            </div>
        </div>
        <div className='upcomingTask-list'>
            {upcomingTask.length>0? upcomingTask.slice(0,2).map(task=>
              <div className='upcomingTask-item' onClick={()=>setIsClick(task.id)}>
                  <div style={{display:'flex', gap:'1rem', alignContent:'center', justifyContent:'space-between'}} >
                    <h4>{task.title.length>30?task.title.slice(0,30)+'...':task.title}</h4>
                    <div style={{display:'flex', gap:'1rem'}}>
                        <div className={`priority-${task.priority.toLowerCase()}`}  style={{marginBottom:'.5rem'}}>{task.priority}</div>
                        <div style={{display:'inline-block',width: 'fit-content', marginBottom:'.5rem'}} className={`status-${task.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${task.status}`)}</div>
                    </div>
                  </div>
                  <p style={{color:`${theme?'#fff':'rgb(75, 85, 99)'}`}}>{task.description.length>70?task.description.slice(0,70)+'...':task.description}</p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                        {task.user.length>3?(
                                  <>
                                      {task.user.slice(2).map(member=>
                                          <div>
                                              <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'28px ', width: '28px '}} alt="Avatar" />
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
                                      <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'28px ', width: '28px '}} alt="Avatar" />
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
            ):<p>{t('dashboard.noData')}</p>}
        </div>
        {isClick !== null && upcomingTask && (
              <TaskDetail 
                  socket={socket}
                  overlayId={isClick} 
                  setOverlayId={setIsClick}
                  taskId={isClick} 
                  projectId={upcomingTask.find(item => item.id === isClick)?.project_id}
              />
        )}  
    </div>
  )
};
