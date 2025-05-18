import './todayTask.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { TaskDetail } from '../../taskDetail/taskDetail';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useTimezone } from '../../../../timezoneContext';
import { getAllTodayTask } from '../../../../store/todayTask';
export const TodayTask = () => {
  const [isOpenTab, setIsOpenTab] = useState('all');
  const { timezone } = useTimezone();
  const {t}=useTranslation()
  const location=useLocation()
  const { socket } = useOutletContext();
  const dispatch=useDispatch()  
  const tasks=useSelector(state=>state.todayTasks.tasks||[])
  const[isClick, setIsClick]=useState(null)
  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'To do', label: 'To do' },
    { value: 'In progress', label: 'In progress' },
    { value: 'Complete', label: 'Complete' }
  ];
  const filterTask=tasks.filter((task)=>{
    if (isOpenTab !== "all" && task.status !== isOpenTab) return false
    return true
  })
  useEffect(()=>{
      dispatch(getAllTodayTask())
  },[])
  return (
    <div id="todayTask">
      <div className="taskHeader">
        {tabs.map(tab => (
          <div
            key={tab.value}
            className={`tabItem ${isOpenTab === tab.value ? 'active' : ''}`}
            onClick={() => setIsOpenTab(tab.value)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className='todayTaskList'>
         {filterTask.map(item=>
            <div className='todayTaskListItem' onClick={()=>setIsClick(item.id)}>
                <div className='itemHeader'>
                    <div style={{fontWeight:'600'}}>{item.title}</div>
                    <div className='status-priority'>
                        <div className={`priority-${item.priority.toLowerCase()}`}>{t(`list.priority.${item.priority}`)}</div>
                        <div className={`status-${item.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${item.status}`)}</div>
                    </div>
                </div>
                <div style={{fontSize:'14px'}}>{item.description}</div>
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                  <div style={{display:'flex', gap:'.5rem', fontSize:'14px'}}>Due date: <div>
                                    {new Intl.DateTimeFormat('en-CA', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      timeZone: timezone,
                                    }).format(new Date(item.endedAt))}
                                 </div>
                                 <div>
                                    {new Intl.DateTimeFormat('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: timezone,
                                    }).format(new Date(item.endedAt))}
                                 </div>
                  </div>
                  <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                        {item.user.length>3?(
                                  <>
                                      {item.user.slice(2).map(member=>
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
                                          +{item.user.length - 2}
                                      </div>
                                  </>
                              ):(item.user.map(member=>
                                  <div>
                                      <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                                  </div>
                              ))
                            }
                    </div>
                </div>
            </div>
         )}
        {isClick !== null && filterTask && (
              <TaskDetail 
                  socket={socket}
                  overlayId={isClick} 
                  setOverlayId={setIsClick}
                  taskId={isClick} 
                  projectId={filterTask.find(item => item.id === isClick)?.project_id}
              />
        )} 
      </div>
    </div>
  );
};
