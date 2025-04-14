import task from '../../../../util/task'
import './list.css'
import { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getAllTask, updateTaskStatus } from '../../../../store/task';
export const List = ()=>{
    const dispatch=useDispatch()
    const { t } = useTranslation();
    const { id } = useParams()
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
    useEffect(()=>{
          async function fetchTask(){
            try{
              await dispatch(getAllTask(id))
            } catch(error){
              console.log(error)
            }
          }
          fetchTask()
    }, [dispatch,id])
   console.log(mergeTask)
    return (
        <div className='list'>
           <h3>List</h3> 
           <div>
            <div className='listHeader'>
                <div>{t('list.Title')}</div>
                <div>{t('list.Description')}</div>
                <div>{t('list.Status')}</div>
                <div>{t('list.Priority')}</div>
                <div>{t('list.Assign')}</div>
                <div>{t('list.Start Date')}</div>
                <div>{t('list.Due Date')}</div>
            </div>
            <div className='listContent'>
                {mergeTask.map(task=>
                    <div className='listContentItem'>
                        <div>{task.title}</div>                        
                        <div>{task.description.length>20?task.description.slice(0,20)+'...':task.description}</div>
                        <div className='status'>{t(`list.${task.status}`)}</div>
                        <div>{t(`list.priority.${task.priority}`)}</div>
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