import task from '../../../../util/task'
import './list.css'
import { useEffect, useState, useRef } from 'react'
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getAllTask, updateTaskStatus } from '../../../../store/task';
import { FaFilePdf, FaDownload, FaGoogleDrive, FaPlus } from "react-icons/fa";
import { Download, Paperclip } from 'lucide-react';
import pdf from '../../../../assets/pdf.png'
import word from '../../../../assets/word.png'
import excel from '../../../../assets/excel.png'
import { useTimezone } from '../../../../timezoneContext';
import {X} from 'lucide-react'
export const List = ()=>{
    const dispatch=useDispatch()
    const {timezone}=useTimezone()
    const theme=useSelector((state)=>state.setting.darkMode)
    const { t } = useTranslation();
    const [isOpenTab, setIsOpenTab] = useState('Detail');
    const { id } = useParams()
    const [taskDetailOpen, setTaskDetailOpen]=useState(false)
    const [taskDetail, setTaskDetail]=useState()
    const tasks=useSelector(state=> state.tasks.tasks)
    const taskMembers=useSelector((state)=>state.tasks.members)
    const tabs=[
        { value: 'Detail', label: 'Detail' },
        { value: 'Comment', label: 'Comment' },
    ]
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
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event, id) => {
      const file = event.target.files[0]; // Lấy file người dùng chọn
      if (file) {
        console.log("Selected file: ", file);
        try{
           task.uploadAttachment(file, id)
        } catch (error) {
            console.error('Error uploading file:', error);
        }
      }
    };
    
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
    async function getTaskDetail(task_id){
        try{
            const result=await task.getTaskDetail(task_id)
            setTaskDetail(result)
            setTaskDetailOpen(true)
          } catch(error){
            console.log(error)
        }
    }
    const extractS3KeyFromUrl = (url) => {
        try {
          const key = new URL(url).pathname.slice(1); // remove leading slash
          return decodeURIComponent(key);
        } catch {
          return null;
        }
    };
    async function handleDownload(s3UrlFromDB){
        try{
            const key = extractS3KeyFromUrl(s3UrlFromDB);
            const result=await task.getPresignedUrl(key)
            window.location.href = result.url;
        }catch (error){
            console.log(error)
        }
    }
    return (
        <div className='list'>
           <h3>List</h3> 
           <div>
            <div className='listHeader'>
                <div style={{textAlign:'left'}}>{t('list.Title')}</div>
                <div style={{textAlign:'left'}}>{t('list.Description')}</div>
                <div>{t('list.Status')}</div>
                <div>{t('list.Priority')}</div>
                <div>{t('list.Assign')}</div>
                <div>{t('list.Start Date')}</div>
                <div>{t('list.Due Date')}</div>
            </div>
            <div className='listContent'>
                {mergeTask.map(task=>
                    <div className='listContentItem' key={task.id} onClick={()=>getTaskDetail(task.id)}>
                        <div>{task.title}</div>                        
                        <div>{task.description.length>50?task.description.slice(0,50)+'...':task.description}</div>
                        <div style={{borderRadius:'1rem'}} className={`status-${task.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${task.status}`)}</div>
                        <div style={{textAlign:'center'}}>{t(`list.priority.${task.priority}`)}</div>
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
            
            <div className={`overlay-${taskDetailOpen?'active':'unActive'}`}>
                {taskDetail?taskDetail.map(item=>
                    <div className={`taskDetail-${taskDetailOpen?'active':'unActive'}`}>
                        <div className='close-button' onClick={()=>{setTaskDetailOpen(!taskDetailOpen)}}><X></X></div>
                        <div className='status-priority' style={{width: '200px'}}>
                            <div className={`priority-${item.priority.toLowerCase()}`}>{t(`list.priority.${item.priority}`)}</div>
                            <div className={`status-${item.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${item.status}`)}</div>
                        </div>
                        <h2>
                            {item.title}
                        </h2>
                        <div style={{fontSize:'14px', display:'flex', gap:'1rem', color:'rgb(107, 114, 128)'}}>
                            <div style={{display:'flex', gap:'.5rem'}}>Start date: <div>
                                    {new Intl.DateTimeFormat('en-CA', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      timeZone: timezone,
                                    }).format(new Date(item.createdAt))}
                                 </div>
                                 <div>
                                    {new Intl.DateTimeFormat('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: timezone,
                                    }).format(new Date(item.createdAt))}
                                 </div>
                            </div>

                            <div style={{display:'flex', gap:'.5rem'}}>Due date: <div>
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
                        </div>
                        <div className="taskHeader" style={{width:'165px'}}>
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
                        <div className='taskDetail-body'>
                            <div className='body-item'>
                                <h4>Description</h4>
                                <div>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                            <div className='body-item'>
                                <h4>Assign</h4>
                                <div>
                                    {item.users.map(user=>
                                        <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
                                            <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{width:'32px', height:'32px', borderRadius:'10rem'}}></img>
                                            <div>
                                                <span>{user.firstname}</span>
                                                <span> </span>
                                                <span>{user.lastname}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='body-item' style={{border:`${theme?'1px solid rgb(29, 41, 57)':'1px solid rgb(229, 229, 229)'}`, borderRadius:'1rem'}}>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>Attachment</h4>
                                    <div style={{color:'#007bff', fontWeight:'600'}}  onClick={handleUploadClick}>
                                        <input type='file' ref={fileInputRef} 
                                        onChange={(e)=>handleFileChange(e, item.id)} 
                                        style={{ display: 'none' }}></input>Upload</div>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                                {item.attachment.map((file, index) => {
                                    const isGoogleDrive = file.url.includes("drive.google.com");
                                    const isPdf = file.url.endsWith(".pdf");
                                    const isDoc = file.url.endsWith(".docx");
                                    const isExcel=file.url.endsWith('.xlsx')
                                    return (
                                        <div key={index} className="attachment-box">
                                        <div style={{ display: 'flex', alignItems:'center', gap: '8px' }}>
                                            {isGoogleDrive ? (
                                            <FaGoogleDrive size={24} />
                                            ) : isPdf ? (
                                            <img src={pdf} style={{height:'32px', width:'28px'}} />
                                            ) : isDoc ? (
                                            <img src={word} style={{height:'24px', width:'24px'}} />
                                            ): isExcel?(
                                                <img src={excel} style={{height:'24px', width:'24px'}} />
                                            ):(
                                                <Paperclip style={{height:'24px', width:'24px', color:'rgb(107, 114, 128)'}} />  
                                            )}

                                            <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                                            <p style={{fontSize:'14px'}}>{file.url.split('/').pop().replace(/^\d+-/, '')}</p>
                                            <span>
                                                <div onClick={()=>handleDownload(file.url)}>
                                                <Download style={{color:'#007bff'}} />
                                                </div>
                                            </span>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                            <div className='taskDetail-footer'>
                                <div></div>
                            </div>
                        </div>
                    </div>
                ):<div>Loading</div>
                }
            </div>
           </div>
        </div>
    )
}