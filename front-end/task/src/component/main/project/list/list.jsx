import task from '../../../../util/task'
import './list.css'
import { useSelector } from 'react-redux'
export const List = ()=>{
    const tasks=useSelector(state=> state.tasks.tasks)
    return (
        <div className='list'>
           <h3>List</h3> 
           <div>
            <div className='listHeader'>
                <div>Title</div>
                <div>Description</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Start Date</div>
                <div>Due Date</div>
            </div>
            <div className='listContent'>
                {tasks.map(task=>
                    <div className='listContentItem'>
                        <div>{task.title}</div>
                        <div>{task.description}</div>
                        <div className='status'>{task.status}</div>
                        <div>{task.priority}</div>
                        <div>{new Date(task.createdAt).toISOString().split('T')[0]}</div>
                        <div>{new Date(task.endedAt).toISOString().split('T')[0]}</div>
                    </div>
                )}
            </div>
           </div>
        </div>
    )
}