import task from '../../../../util/task'
import './list.css'
import { useEffect, useState, useRef } from 'react'
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import { useOutletContext, useParams } from 'react-router-dom';
import { getAllTask, updateTaskStatus } from '../../../../store/task';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { motion } from 'framer-motion';
import { Download, Paperclip, Trash2, FilePenLine, Loader2 } from 'lucide-react';
import pdf from '../../../../assets/pdf.png'
import word from '../../../../assets/word.png'
import excel from '../../../../assets/excel.png'
import { useTimezone } from '../../../../timezoneContext';
import { Comment } from '../comment/comment';
import { getAllTodayTask } from '../../../../store/todayTask';
import { getAllUpcomingTask } from '../../../../store/upcomingTask';
import {X} from 'lucide-react'
import { useSocket } from '../../../../../socketContext';
import { Placeholder } from 'react-select/animated';
export const List = ()=>{
    const dispatch=useDispatch()
    const {role}=useOutletContext()    
    const {timezone}=useTimezone()
    const socket=useSocket()
    const animatedComponents = makeAnimated();
    const theme=useSelector((state)=>state.setting.darkMode)
    const { t } = useTranslation();
    const [isOpenTab, setIsOpenTab] = useState('Detail');
    const { id } = useParams()
    const [taskDetailOpen, setTaskDetailOpen]=useState(false)
    const [overlay, setOverlay]=useState(false)
    const [taskDetail, setTaskDetail]=useState()
    const [deleteTask,setDeleteTask]=useState(false)
    const tasks=useSelector(state=> state.tasks.tasks)
    const taskMembers=useSelector((state)=>state.tasks.members)
    const [taskId, setTaskId]=useState()
    const [updateError, setUpdateError]=useState(false)
    const [updateSuccess, setUpdateSuccess]=useState(false)
    const [notiOverlay, setNotiOverlay]=useState(false)
    const [attachmentId, setAttachmentId]=useState()
    const [attachmentUrl, setAttachmentUrl]=useState()
    const [priority, setPriority] = useState();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState();
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isSelecting, setIsSelecting] = useState(false);
    const [errorOverlay,setErrorOverlay ]=useState(false)
    const [error, setError]=useState(false)
    const [loading, setLoading]=useState(false)
    const [users, setUser]=useState([])//list of user
    const [formattedUsers, setFormatedUser]=useState([])
    const [taskDetailMembers, setTaskDetailMember]=useState([])
    const [assignedUserId, setAssignedUserId] = useState([]);
    const userId=useSelector(state=>state.userProfile.id)
    const avatar=useSelector(state=>state.userProfile.avatar)
    const lastname=useSelector(state=>state.userProfile.lastname)
    const firstname=useSelector(state=>state.userProfile.firstname)

    const [deleteAttachment, setDeleteAttachment]=useState(false)
    const tabs=[
        { value: 'Detail', label: t('taskDetail.detail') },
        { value: 'Comment', label: t('taskDetail.comment')},
    ]
    const options = [
        { value: 'Low', label: t('list.priority.Low') },
        { value: 'Medium', label: t('list.priority.Medium') },
        { value: 'High', label: t('list.priority.High') },
        { value: 'Urgent', label: t('list.priority.Urgent') }
    ];
    const statusOptions = [
        { value: 'To do', label: t('list.To do') },
        { value: 'In progress', label: t('list.In progress') },
        { value: 'Complete', label: t('list.Complete') }
    ];
    const customStyles =(darkMode) =>({
        control: (base, state) => ({
          ...base,
          backgroundColor: darkMode ? '#1c2536' : '#fff',
          boxShadow: 'none',
          color: 'inherit',
          border: 'inherit',
          fontSize: '12px',
          '&:hover': {
            border: 'inherit'
          },
          borderRadius:'10rem'
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? (darkMode ? '#007bff' : '#eaeaea')
            : (darkMode ? '#1c2536' : '#fff'),
          color: darkMode ? '#fff' : '#000',
          fontSize: '12px',
          cursor: 'pointer',
        }),
        singleValue: (base) => ({
          ...base,
          color: 'inherit'
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor:'none'
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: darkMode ? '#1c2536' : '#fff',
          zIndex: 9999,
        }),
        dropdownIndicator:(base)=>({
            ...base,
            padding:'unset'
        }),
        placeholder:(base)=>({
            ...base,
            padding:'unset',
            fontSize:'12px'
        }),
    });
    const statusCustomStyles =(darkMode) =>({
        control: (base, state) => ({
          ...base,
          backgroundColor: 'inherit',
          boxShadow: 'none',
          color: 'inherit',
          border: 'inherit',
          fontSize: '12px',
          '&:hover': {
            border: 'inherit'
          },
          borderRadius:'10rem'
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? (darkMode ? '#007bff' : '#eaeaea')
            : (darkMode ? '#1c2536' : '#fff'),
          color: darkMode ? '#fff' : '#000',
          fontSize: '12px',
          cursor: 'pointer',
        }),
        singleValue: (base) => ({
          ...base,
          backgroundColor:'none',
          color: 'inherit'
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: darkMode ? '#1c2536' : '#fff',
          zIndex: 9999,
        }),
        dropdownIndicator:(base)=>({
            ...base,
            padding:'unset'
        }),
        placeholder:(base)=>({
            ...base,
            padding:'unset',
            fontSize:'12px'
        }),
    });
    const getCustomStyle=customStyles(theme)
    const getStatusCustomStyle=statusCustomStyles(theme)
    const mergeTask=tasks.map((task, index)=>{
        return {
            ...task,
            members:taskMembers[index]?.map(mem => ({
                id:mem.user.id,
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
    const handleFileChange = async (event, taskId) => {
          const formattedUsersId=assignedUserId.map(user=>user.value)
          const file = event.target.files[0]; // Lấy file người dùng chọn
          if (file) {
            try{
                setLoading(true)
                setNotiOverlay(true)

               const result=await task.uploadAttachment(file, taskId)
               const data={
                    taskId:taskId,
                    actorId:userId,
                    assignedUserId:formattedUsersId,
                    user:{
                        id: userId,
                        avatar:avatar,
                        firstname:firstname,
                        lastname:lastname
                    },
                    message:`task.updated`,
                    projectId: id,
                    createdAt:new Date().toISOString()
                }
                const result2 = await task.createNoti(data)
                const socketData={
                    notiId:result2,
                    taskId:taskId,
                    actorId:userId,
                    assignedUserId:formattedUsersId,
                    user:{
                        id: userId,
                        avatar:avatar,
                        firstname:firstname,
                        lastname:lastname
                    },
                    message:`task.updated`,
                    projectId: id,
                    createdAt:new Date().toISOString()
                }
                socket.emit('new-update', socketData)
                if(result){
                    setLoading(false)
                    setNotiOverlay(false)
                }
               getTaskDetail(taskId)
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
    useEffect(()=>{
          async function getAllUser(){
            try{
              const result = await task.getAllUser()
              const formatted = result.map(user => ({
                value: user.id, // Dùng ID làm giá trị
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color:`${theme?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}` }}>
                      <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                      <span>{user.firstname} {user.lastname}</span>
                    </div>
                )// Dùng username làm tên hiển thị
              }));
              setUser(result)
              const result2 = await task.getUserByProjectId(id)
              const formattedProjectUser = result2.map(user =>
                formatted.find(u => u.value === user.id)
              ).filter(Boolean); // Loại bỏ phần tử undefined nếu không tìm thấy
              setFormatedUser(formattedProjectUser)
            } catch(error){
              console.log(error)
            }
          }
          getAllUser()
    },[id])
    async function getTaskDetail(task_id){
        try{
            setOverlay(true)
            const result=await task.getTaskDetail(task_id)
            setTaskId(task_id)
            setTaskDetail(result)
            setStatus(result[0].status)
            setPriority(result[0].priority)
            setTitle(result[0].title)
            setDueDate(result[0].endedAt)
            setStartDate(result[0].createdAt)
            setDescription(result[0].description)
            setTaskDetailMember(result[0].users)
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
    const toDateTimeLocal = (date) => {
        const d = new Date(date);

        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      
        const parts = formatter.formatToParts(d);
        const getPart = (type) => parts.find((part) => part.type === type)?.value;
      
        const year = getPart('year');
        const month = getPart('month');
        const day = getPart('day');
        const hour = getPart('hour');
        const minute = getPart('minute');
      
        return `${year}-${month}-${day}T${hour}:${minute}`;
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
    async function handleDeleteAttachment(s3UrlFromDB, fileid, task_id){
            try{
                setLoading(true)
                setNotiOverlay(true)
                setDeleteAttachment(false)
                const key = extractS3KeyFromUrl(s3UrlFromDB);
                const formattedUsersId=assignedUserId.map(user=>user.value)
                const result=await task.deleteAttachment(key, fileid)
                const data={
                    taskId:taskId,
                    actorId:userId,
                    assignedUserId:formattedUsersId,
                    user:{
                        id: userId,
                        avatar:avatar,
                        firstname:firstname,
                        lastname:lastname
                    },
                    message:`task.updated`,
                    projectId: id,
                    createdAt:new Date().toISOString()
                }
                const result2 = await task.createNoti(data)
                const socketData={
                    notiId:result2,
                    taskId:taskId,
                    actorId:userId,
                    assignedUserId:formattedUsersId,
                    user:{
                        id: userId,
                        avatar:avatar,
                        firstname:firstname,
                        lastname:lastname
                    },
                    message:`task.updated`,
                    projectId: id,
                    createdAt:new Date().toISOString()
                }
                socket.emit('new-update', socketData)
                if(result){
                    setLoading(false)
                    setNotiOverlay(false)
                }

                getTaskDetail(task_id)
            }catch (error){
                console.log(error)
            }
    }
    const handleSelect = (selectedUsers) => {
        if (!selectedUsers || selectedUsers.length === 0) {
            return;
        }else if(selectedUsers) {
            const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
            const userMap = new Map(users.map(user => [user.id, user]));
            const selected= assignedIds.map(id => userMap.get(id));
            setAssignedUserId(selectedUsers);
            setTaskDetailMember(selected)
        } else {
            // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
            setAssignedUserId([]);
        }
    };
    const handleSaveEdit=async(e)=>{
                try{
                    const formattedUsersId=assignedUserId.map(user=>user.value)
                    const result=await task.updateTaskDetail(
                        {id:taskId,
                         title:title,
                         status:status,
                         priority:priority,
                         description:description,
                         assignedUserId:formattedUsersId,
                         projectId:id,
                         startDate:startDate,
                         dueDate: dueDate
                        }
                    )
                    if(result){
                        setTimeout(()=>{setLoading(false)},1000 )
                        setError(false)
                        setUpdateError(false)
                        setUpdateSuccess(true)
                    }
                    const data={
                        taskId:taskId,
                        actorId:userId,
                        assignedUserId:formattedUsersId,
                        user:{
                            id: userId,
                            avatar:avatar,
                            firstname:firstname,
                            lastname:lastname
                        },
                        message:`task.updated`,
                        projectId: id,
                        createdAt:new Date().toISOString()
                    }
                    const result2 = await task.createNoti(data)
                    const socketData={
                        notiId:result2,
                        taskId:taskId,
                        actorId:userId,
                        assignedUserId:formattedUsersId,
                        user:{
                            id: userId,
                            avatar:avatar,
                            firstname:firstname,
                            lastname:lastname
                        },
                        message:`task.updated`,
                        projectId: id,
                        createdAt:new Date().toISOString()
                    }
                    socket.emit('new-update', socketData)
                    dispatch(getAllTodayTask())
                    dispatch(getAllUpcomingTask())
                    dispatch(getAllTask(id))
                }catch(error){
                    setTimeout(()=>{setLoading(false)},1000 )
                    setError(true)
                    setUpdateError(true)
                    setUpdateSuccess(false)
                }
    }
    const handleDeleteTask=async(e,taskId)=>{        
        try{
            const result=await task.deleteTask(taskId)
            if(result){
                setTimeout(()=>{setLoading(false)},1000 )
                setError(false)
            }
            dispatch(getAllTask(id))
            setDeleteTask(false)
            setTaskDetail(null)
        }catch(error){
            setTimeout(()=>{setLoading(false)},1000 )
            setError(true)
        }
    }
    useEffect(() => {
        if (taskDetailMembers.length > 0 && users.length > 0) {
          const preselectedUsers = formattedUsers.filter(option =>
            taskDetailMembers.some(user => user.id === option.value)
          );

          setAssignedUserId(preselectedUsers);
        }
    }, [taskDetailMembers, formattedUsers]);
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
                        <div style={{textAlign:'left', fontWeight:'600'}}>{task.title}</div>                        
                        <p style={{color:`${theme?'#fff':'rgb(75, 85, 99)'}`, marginBottom:'.25rem', textOverflow: 'ellipsis',  overflow: 'hidden',display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',}}>{task.description}</p>
                        <div style={{borderRadius:'1rem'}} className={`status-${task.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${task.status}`)}</div>
                        <div style={{textAlign:'center'}}>{t(`list.priority.${task.priority}`)}</div>
                        <div style={{display:'flex', gap:'5px', justifyContent:'center'}}>
                            {task.members.length>3?(
                                <>
                                    {task.members.slice(2).map(member=>
                                        <div key={member.id}>
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
                                        +{task.members.length - 2}
                                    </div>
                                </>
                            ):(task.members.map(member=>
                                <div key={member.id}>
                                    <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'28px ', width: '28px '}} alt="Avatar" />
                                </div>
                            ))
                            }
                        </div>
                        <div style={{textAlign:'center'}}>{new Date(task.createdAt).toISOString().split('T')[0]}</div>
                        <div style={{textAlign:'center'}}>{new Date(task.endedAt).toISOString().split('T')[0]}</div>
                    </div>
                )}
            </div>
            
            <div className={`overlay-${overlay?'active':'unActive'}`}>
                <div className={`overlay-${notiOverlay?'active':'unActive'}`}>
                    {loading?(
                        <div className={`overlay-${loading?'active':'unActive'}`}>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center', gap: '.5rem', width:'200px', backgroundColor:'white', padding:'.5rem', borderRadius:'.5rem'}}>
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ 
                                        duration: 1, 
                                        repeat: Infinity, 
                                        ease: "linear",
                                        repeatType: "loop" // Quan trọng!
                                    }}
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        transformOrigin: "12px 12px" // Chỉ định chính xác tâm
                                    }}
                                >
                                    <Loader2 style={{color:' #007bff'}} />
                                </motion.div>
                                <p style={{fontWeight:500, color:'black'}}>{t("taskDetail.wait")}</p>
                            </div>
                        </div>
                    ):(
                        error?(
                                updateError?(
                                    <div className='fail'style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                        <div className='close-button' onClick={()=>{setNotiOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                        <p style={{fontWeight:500}}>{t('taskDetail.updateFail')}</p>
                                        <p style={{fontSize:12}}>{t('taskDetail.failMessage')}</p>
                                    </div>
                                ):(
                                    <div className='fail'style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                        <div className='close-button' onClick={()=>{setNotiOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                        <p style={{fontWeight:500}}>{t('taskDetail.deleteFail')}</p>
                                        <p style={{fontSize:12}}>{t('taskDetail.failMessage')}</p>
                                    </div>
                                )
                        ):(
                                updateSuccess?(
                                    <div className='success' style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                        <div className='close-button' onClick={()=>{setNotiOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                        <p style={{fontWeight:500}}>{t('taskDetail.updateSuccess')}</p>
                                    </div>
                                ):(
                                    <div className='success' style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                        <div className='close-button' onClick={()=>{setNotiOverlay(false), setOverlay(null),dispatch(getAllTask(id))}}><X style={{height:12, width:12}}></X></div>
                                        <p style={{fontWeight:500}}>{t('taskDetail.deleteSuccess')}</p>
                                    </div>
                                )
                        )
                    )}
                </div>
                {deleteTask?(
                    <div className='delete-warning'>
                        <h2>{t('taskDetail.confirm')}</h2>
                        <span>{t('taskDetail.message')}</span>
                        <div className='delete-warning-footer'>
                            <div className='edit' onClick={()=>{setOverlay(null), setDeleteTask(null)}}>
                            <p>{t('taskDetail.Cancel')}</p>
                            </div>
                            <div className='delete' onClick={(e)=>{handleDeleteTask(e, taskId), setNotiOverlay(true), setLoading(true)}}>
                                <Trash2 color='white'></Trash2>
                                <p style={{color:'white'}}>{t("taskDetail.delete")}</p>
                            </div>
                        </div>
                    </div>
                ):(taskDetail&&status&&priority?taskDetail.map(item=>{
                    return role=='viewer'?(
                        <div key={item.id} className={`taskDetail-${taskDetailOpen?'active':'unActive'}`}>
                        <div className='close-button' onClick={()=>{setTaskDetailOpen(!taskDetailOpen), setIsOpenTab('Detail'), setOverlay(false)}}><X></X></div>
                        <div className='status-priority' style={{width: '250px'}}>
                            <div className={`priority-${priority.toLowerCase()}`} style={{padding:'4px 8px', fontSize:14}}>
                                {priority}
                            </div>
                            <div className={`status-${status.toLowerCase().replace(/\s/g, '')}`} style={{padding:'4px 8px', fontSize:14}} >
                                {status}
                            </div>
                        </div>
                        <div className='title'>
                            <p style={{border: 'none',outline: 'none', boxShadow: 'none', fontWeight:700, fontSize:28}}>{title}</p>
                        </div>
                        <div style={{fontSize:'14px', display:'flex', gap:'1rem', color:'rgb(107, 114, 128)'}}>
                            <div className='startDate'>
                                <div>{t('taskDetail.startDate')}</div>
                                <div style={{display:'flex', gap:'.5rem', fontSize:'14px', fontWeight:'500'}}>
                                    <div>
                                        {new Intl.DateTimeFormat('en-CA', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        timeZone: timezone,
                                        }).format(new Date(startDate))}
                                    </div>
                                    <div>
                                        {new Intl.DateTimeFormat('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: timezone,
                                        }).format(new Date(startDate))}
                                    </div>
                                </div>
                            </div>

                            <div className='dueDate'>
                                <div>{t('taskDetail.dueDate')}</div>
                                <div style={{display:'flex', gap:'.5rem', fontSize:'14px',fontWeight:'500'}}>
                                    <div>
                                        {new Intl.DateTimeFormat('en-CA', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        timeZone: timezone,
                                        }).format(new Date(dueDate))}
                                    </div>
                                    <div>
                                        {new Intl.DateTimeFormat('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: timezone,
                                        }).format(new Date(dueDate))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="taskHeader" style={{width:'fit-content'}}>
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
                        {isOpenTab==='Detail'?<div className='taskDetail-body'>
                            <div className='body-item'>
                                <h4>{t("taskDetail.description")}</h4>
                                <div>
                                    <p style={{border: 'none',outline: 'none', boxShadow: 'none', width:'100%', fontSize:'16px'}}>{description}</p>
                                </div>
                            </div>
                            <div className='body-item'>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>{t("taskDetail.assign")}</h4>
                                </div>
                                
                                <div style={{maxHeight:'150px', overflowY:'scroll'}}>
                                    {taskDetailMembers.map(user=>
                                        <div key={user.id} style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
                                            <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{width:'28px', height:'28px', borderRadius:'10rem'}}></img>
                                            <div>
                                                <span>{user.firstname}</span>
                                                <span> </span>
                                                <span>{user.lastname}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='body-item' style={{border:`${theme?'1px solid rgb(29, 41, 57)':'1px solid rgb(229, 229, 229)'}`, borderRadius:'1rem', maxHeight:'200px', overflowY:'scroll'}}>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>{t('taskDetail.attachment')}</h4>
                                    <div style={{color:'#007bff', fontWeight:'600'}}  onClick={handleUploadClick}>
                                        <input type='file' ref={fileInputRef} 
                                        onChange={(e)=>handleFileChange(e, item.id)} 
                                        style={{ display: 'none' }}></input>{t('taskDetail.upload')}</div>
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
                                            {isPdf ? (
                                            <img src={pdf} style={{height:'32px', width:'28px'}} />
                                            ) : isDoc ? (
                                            <img src={word} style={{height:'24px', width:'24px'}} />
                                            ): isExcel?(
                                                <img src={excel} style={{height:'24px', width:'24px'}} />
                                            ):(
                                                <Paperclip style={{height:'24px', width:'24px', color:'rgb(107, 114, 128)'}} />  
                                            )}

                                            <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                                            <p style={{fontSize:'14px'}}>{file.name}</p>
                                            <div style={{display:'flex', gap:'1rem'}}>
                                                <div onClick={()=>handleDownload(file.url)}>
                                                    <Download style={{color:'#007bff'}} />
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                
                        </div>:<Comment role={role} socket={socket} taskId={item.id} assignedUserId={assignedUserId} projectId={id}></Comment>}
                    </div>
                    ):(
                    <div key={item.id} className={`taskDetail-${taskDetailOpen?'active':'unActive'}`}>
                        <div className='close-button' onClick={()=>{setTaskDetailOpen(!taskDetailOpen), setIsOpenTab('Detail'), setOverlay(false)}}><X></X></div>
                        <div className='status-priority' style={{width: '250px'}}>
                            <div className={`priority-${priority.toLowerCase()}`} style={{padding:'unset'}}>
                                <Select
                                options={options}
                                styles={getCustomStyle}
                                value={options.find(option => {
                                    return option.value == priority
                                })}
                                onChange={(selectedOption) => setPriority(selectedOption.value)} // Medium
                                />
                            </div>
                            <div className={`status-${status.toLowerCase().replace(/\s/g, '')}`} style={{padding:'unset'}}>
                                <Select
                                    options={statusOptions}
                                    styles={getStatusCustomStyle}
                                    value={statusOptions.find(option => option.value == status)}
                                    onChange={(selectedOption) => setStatus(selectedOption.value)} // Medium
                                />
                            </div>
                        </div>
                        <div className='title'>
                            <input value={title} onChange={(e)=>setTitle(e.target.value)}  style={{border: 'none',outline: 'none', boxShadow: 'none'}}></input>
                        </div>
                        <div className='date'>
                            <div className='startDate'>
                                <div>{t('taskDetail.startDate')}</div>
                                <input type='datetime-local'
                                       value={toDateTimeLocal(startDate)}
                                       onChange={(e) => {
                                        const newStart = e.target.value;
                                        if (!dueDate || newStart <= dueDate) {
                                          setStartDate(newStart);
                                        } else {
                                          alert('Start date cannot be after due date!');
                                        }
                                       }}
                                       style={{border: 'none',outline: 'none', boxShadow: 'none', width:'150px',fontSize:'14px', color:'rgb(107, 114, 128)'}}
                                >  
                                </input>
                            </div>

                            <div className='dueDate'>
                                <p>{t('taskDetail.dueDate')}:</p> 
                                <input type='datetime-local'
                                       value={toDateTimeLocal(dueDate)}
                                       onChange={(e) => {
                                        const newDue = e.target.value;
                                        if (!startDate || newDue >= startDate) {
                                          setDueDate(newDue);
                                        } else {
                                          alert('Due date cannot be before start date!');
                                        }
                                      }}
                                       style={{border: 'none',outline: 'none', boxShadow: 'none', width:'150px',fontSize:'14px', color:'rgb(107, 114, 128)'}}
                                >  
                                </input>
                            </div>
                        </div>
                        <div className="taskHeader" style={{width:'fit-content'}}>
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
                        {isOpenTab==='Detail'?<div className='taskDetail-body'>
                            <div className='body-item'>
                                <h4>{t("taskDetail.description")}</h4>
                                <div>
                                    <textarea value={description} onChange={(e)=>setDescription(e.target.value)}  style={{border: 'none',outline: 'none', boxShadow: 'none', width:'100%', fontSize:'16px'}}></textarea>
                                </div>
                            </div>
                            <div className='body-item'>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>{t("taskDetail.assign")}</h4>
                                    {isSelecting ?(<span
                                        onClick={() => setIsSelecting(false)}
                                        style={{color:'#007bff', fontWeight:'600'}}
                                        >
                                        {t("taskDetail.done")}
                                        </span>
                                    ): (
                                        <span
                                        onClick={() => setIsSelecting(true)}
                                        style={{color:'#007bff', fontWeight:'600'}}
                                        >
                                        {t("taskDetail.add")}
                                        </span>
                                    )}
                                </div>
                                {isSelecting ? (
                                    <Select
                                    options={formattedUsers}
                                    value={assignedUserId}
                                    onChange={handleSelect}
                                    required
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    styles={getCustomStyle}
                                    />
                                ):(
                                <div style={{maxHeight:'150px', overflowY:'scroll'}}>
                                    {taskDetailMembers.map(user=>
                                        <div key={user.id} style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
                                            <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{width:'32px', height:'32px', borderRadius:'10rem'}}></img>
                                            <div>
                                                <span>{user.firstname}</span>
                                                <span> </span>
                                                <span>{user.lastname}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>)}
                            </div>
                            <div className='body-item' style={{border:`${theme?'1px solid rgb(29, 41, 57)':'1px solid rgb(229, 229, 229)'}`, borderRadius:'1rem', maxHeight:'200px', overflowY:'scroll'}}>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>{t('taskDetail.attachment')}</h4>
                                    <div style={{color:'#007bff', fontWeight:'600'}}  onClick={handleUploadClick}>
                                        <input type='file' ref={fileInputRef} 
                                        onChange={(e)=>handleFileChange(e, item.id)} 
                                        style={{ display: 'none' }}></input>{t('taskDetail.upload')}</div>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                                {item.attachment.map((file, index) => {
                                    const isPdf = file.url.endsWith(".pdf");
                                    const isDoc = file.url.endsWith(".docx");
                                    const isExcel=file.url.endsWith('.xlsx')
                                    return (
                                        <div key={index} className="attachment-box">
                                        <div style={{ display: 'flex', alignItems:'center', gap: '8px' }}>
                                            {isPdf ? (
                                            <img src={pdf} style={{height:'32px', width:'28px'}} />
                                            ) : isDoc ? (
                                            <img src={word} style={{height:'24px', width:'24px'}} />
                                            ): isExcel?(
                                                <img src={excel} style={{height:'24px', width:'24px'}} />
                                            ):(
                                                <Paperclip style={{height:'24px', width:'24px', color:'rgb(107, 114, 128)'}} />  
                                            )}

                                            <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                                            <p style={{fontSize:'14px'}}>{file.name}</p>
                                            <div style={{display:'flex', gap:'1rem'}}>
                                                <div onClick={()=>handleDownload(file.url)}>
                                                    <Download style={{color:'#007bff'}} />
                                                </div>
                                                <div onClick={()=>{setDeleteAttachment(true), setAttachmentId(file.id), setAttachmentUrl(file.url)}}>
                                                    <Trash2 style={{color:'#dc2626'}}></Trash2>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                
                        </div>:<Comment socket={socket} taskId={item.id} assignedUserId={assignedUserId} projectId={id}></Comment>}
                        <div className='taskDetail-footer'>
                                <div className='edit' onClick={()=>{handleSaveEdit(),setNotiOverlay(true), setLoading(true)}}>
                                   <FilePenLine></FilePenLine>
                                   <p>{t('taskDetail.save')}</p>
                                </div>
                                <div className='delete' onClick={()=>{setDeleteTask(true), setTaskDetail(false)}}>
                                    <Trash2 color='white'></Trash2>
                                    <p style={{color:'white'}}>{t('taskDetail.delete')}</p>
                                </div>
                        </div>
                        <div className={`overlay-${deleteAttachment?'active':'unActive'}`}>
                            <div className='delete-warning'>
                                <h2>{t('taskDetail.confirm')}</h2>
                                <span>{t('taskDetail.fileMessage')}</span>
                                <div className='delete-warning-footer'>
                                    <div className='edit' onClick={()=>{ setDeleteAttachment(false)}}>
                                        <p>{t('taskDetail.Cancel')}</p>
                                    </div>
                                    <div className='delete' onClick={(e)=>handleDeleteAttachment(attachmentUrl, attachmentId, taskId)}>
                                        <Trash2 color='white'></Trash2>
                                        <p style={{color:'white'}}>{t("taskDetail.delete")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    )                   
                }):<div style={{display:'flex',justifyContent:'center',alignItems:'center', gap: '.5rem', width:'150px', backgroundColor:'white', padding:'.5rem', borderRadius:'.5rem'}}>
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ 
                                            duration: 1, 
                                            repeat: Infinity, 
                                            ease: "linear",
                                            repeatType: "loop" // Quan trọng!
                                        }}
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            transformOrigin: "12px 12px" // Chỉ định chính xác tâm
                                        }}
                                    >
                                        <Loader2 style={{color:' #007bff'}} />
                                    </motion.div>
                                    <p style={{fontWeight:500, color:'black'}}>{t('taskDetail.loading')}</p>
                    </div>

                )}
            </div>
           </div>
        </div>
    )
}