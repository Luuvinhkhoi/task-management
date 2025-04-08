import task from '../../../../util/task'
import './list.css'
import { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import { getAllTask, updateTaskStatus } from '../../../../store/task';
export const List = ()=>{
    const dispatch=useDispatch()
    const { t } = useTranslation();
    const tasks=useSelector(state=> state.tasks.tasks)
    const taskMembers=useSelector((state)=>state.tasks.members)
    const mergeTask=tasks.map((task, index)=>{
        return {
            ...task,
            members:taskMembers[index]?.map(mem => ({
                firstname: mem.user.firstname,
                lastname: mem.user.lastname,
                avatar: mem.user.avatar,
            })) || []   
        }
    })
    const convertTitleToKey = (title) => {
        console.log(title)
        return title.toLowerCase().replace(/\s/g, '') // "To do" -> "todo"
    }
    useEffect(()=>{
          async function fetchTask(){
            try{
              await dispatch(getAllTask())
            } catch(error){
              console.log(error)
            }
          }
          fetchTask()
    }, [dispatch])
   console.log(mergeTask)
    return (
        <div className='list'>
           <h3>List</h3> 
           <div>
            <div className='listHeader'>
                <div>Title</div>
                <div>Description</div>
                <div>Status</div>
                <div>Priority</div>
                <div>{}</div>
                <div>Start Date</div>
                <div>Due Date</div>
            </div>
            <div className='listContent'>
                {mergeTask.map(task=>
                    <div className='listContentItem'>
                        <div>{task.tile}</div>                        
                        <div>{task.description}</div>
                        <div className='status'>{t(`list.${task.status}`)}</div>
                        <div>{task.priority}</div>
                        <div style={{display:'flex', gap:'5px', justifyContent:'center'}}>{task.members.map(member=>
                            <div>
                                <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'32px ', width: '32px '}} alt="Avatar" />
                            </div>
                        )}</div>
                        <div>{new Date(task.createdAt).toISOString().split('T')[0]}</div>
                        <div>{new Date(task.endedAt).toISOString().split('T')[0]}</div>
                    </div>
                )}
            </div>
           </div>
        </div>
    )
}