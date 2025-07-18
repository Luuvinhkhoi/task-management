import './upcoming.css'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TaskDetail } from '../../taskDetail/taskDetail';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUpcomingTask } from '../../../../store/upcomingTask';
export const Upcoming= () => {
  const [isOpenTab, setIsOpenTab] = useState('all');
  const {t}=useTranslation()
  const dispatch=useDispatch()
  const location=useLocation()
  const tasks=useSelector(state=>state.upcomingTasks.tasks||[])
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
    dispatch(getAllUpcomingTask())
  },[])
  return (
    <div id="upcomingTask">
      <div className="taskHeader">
        {tabs.map(tab => (
          <div
            key={tab.value}
            className={`tabItem ${isOpenTab === tab.value ? 'active' : ''}`}
            onClick={() => setIsOpenTab(tab.value)}
          >
            {t(`list.${tab.label}`)}
          </div>
        ))}
      </div>
      <div className='todayTaskList'>
         {filterTask.map(item=>
            <div key={item.id} className='todayTaskListItem' onClick={()=>setIsClick(item.id)}>
                <div className='itemHeader'>
                    <div style={{fontWeight:'600'}}>{item.title}</div>
                    <div className='status-priority'>
                        <div className={`priority-${item.priority.toLowerCase()}`}>{t(`list.priority.${item.priority}`)}</div>
                        <div className={`status-${item.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${item.status}`)}</div>
                    </div>
                </div>
                <div style={{fontSize:'14px'}}>{item.description}</div>
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center', fontSize:'14px'}}>
                  <div>{t('task.startDate')}: {new Date(item.createdAt).toISOString().split('T')[0]}</div>
                  <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                        {item.user.length>3?(
                                  <>
                                      {item.user.slice(2).map(member=>
                                          <div key={member.id}>
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
                                  <div key={member.id}>
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
