import './todayTask.css'
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export const TodayTask = () => {
  const [isOpenTab, setIsOpenTab] = useState('all');
  const {t}=useTranslation()
  const location=useLocation()
  const tasks=location.state
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
            <div className='todayTaskListItem'>
                <div className='itemHeader'>
                    <div>{item.title}</div>
                    <div className='status-priority'>
                        <div className={`priority-${item.priority.toLowerCase()}`}>{t(`list.priority.${item.priority}`)}</div>
                        <div className={`status-${item.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${item.status}`)}</div>
                    </div>
                </div>
                <div>{item.description}</div>
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                  <div>Due date: {new Date(item.endedAt).toISOString().split('T')[0]}</div>
                  <div className='task-member' style={{display:'flex', gap:'.5rem'}}>
                        {item.user.map(member=>
                            <div>
                                <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{height:'32px', width:'32px', borderRadius:'10rem'}} alt="Avatar" />
                            </div>
                        )}
                  </div>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};
