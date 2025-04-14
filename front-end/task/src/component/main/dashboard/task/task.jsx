import './todayTask.css'
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
export const TodayTask = () => {
  const [isOpenTab, setIsOpenTab] = useState('all');
  const location=useLocation()
  const tasks=location.state
  console.log(tasks)
  console.log(isOpenTab)
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
      <div className="todayTaskHeader">
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
                        <div className={`priority-${item.priority.toLowerCase()}`}>{item.priority}</div>
                        <div className={`status-${item.status.toLowerCase().replace(/\s/g, '')}`}>{item.status}</div>
                    </div>
                </div>
                <div>{item.description}</div>
                <div>Due date: {new Date(item.endedAt).toISOString().split('T')[0]}</div>
            </div>
         )}
      </div>
    </div>
  );
};
