import './kanban.css';
import React, { useRef, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import task from '../../../../util/task';
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTask, updateTaskStatus } from '../../../../store/task';
import { updateItem } from '../../../../store/task';
import makeAnimated from 'react-select/animated';
import { useTimezone } from '../../../../timezoneContext';
import pdf from '../../../../assets/pdf.png'
import word from '../../../../assets/word.png'
import excel from '../../../../assets/excel.png'
import {X} from 'lucide-react'
import Select from 'react-select'
import { Download, Paperclip, Trash2, FilePenLine } from 'lucide-react';
import { Comment } from '../comment/comment';
import { useOutletContext } from 'react-router-dom';

const ItemType = "KANBAN_ITEM";

export const Kanban = () => {
    const { t } = useTranslation();
    const { id } = useParams()
    const dispatch=useDispatch()
    const theme=useSelector((state)=>state.setting.darkMode)

    const location=useLocation()
    const tasks=useSelector((state)=>state.tasks.tasks)
    const taskMembers=useSelector((state)=>state.tasks.members)
    const hasUnsavedChanges = useSelector(state => state.tasks.hasUnsavedChanges);
    const [users, setUser]=useState([])//list of user
    const [formattedUsers, setFormatedUser]=useState([])
    const [taskDetailMembers, setTaskDetailMember]=useState([])
    const [assignedUserId, setAssignedUserId] = useState([]);
    console.log(formattedUsers)
    // Hàm di chuyển item khi kéo thả
    const moveItem = (id, newStatus) => {
        try{
          dispatch(updateItem({id: id,status: newStatus}))
        } catch(error){
          console.log(error)
        }
    };
     useEffect(()=>{
              async function getAllUser(){
                try{
                  const result = await task.getAllUser()
                  console.log(result)
                  console.log('hihihihihihihih')

                  const formatted = await result.map(user => ({
                    value: user.id, // Dùng ID làm giá trị
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color:`${theme?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}` }}>
                          <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                          <span>{user.firstname} {user.lastname}</span>
                        </div>
                      )// Dùng username làm tên hiển thị
                    }));
                  setUser(result)
                  console.log(formatted)
                  const result2 = await task.getUserByProjectId(id)
                  const formattedProjectUser = result2.map(user =>
                        formatted.find(u => u.value === user.id)
                  ).filter(Boolean); 
                  console.log(formattedProjectUser)// Loại bỏ phần tử undefined nếu không tìm thấy
                  setFormatedUser(formattedProjectUser)
                } catch(error){
                  console.log(error)
                }
              }
              getAllUser()
    },[id])
    useEffect(()=>{
      async function fetchTask(){
        try{
          await dispatch(getAllTask(id))
        } catch(error){
          console.log(error)
        }
      }
      fetchTask()
    }, [id])
    useEffect(() => {
            // Lưu URL hiện tại để theo dõi trang
            const currentPath = location.pathname;
    
            // Function gửi cart lên server
            const saveTask = async () => {
                if (hasUnsavedChanges) {
                    const updatedTasks = tasks.filter(task=>task.isModified)
                    if (updatedTasks.length > 0) {
                       await dispatch(updateTaskStatus(updatedTasks)); 
                    }
                    console.log("Cart data saved!");
                }
            };
    
            // Xử lý khi tải lại trang hoặc đóng tab
            const handleBeforeUnload = (event) => {
                if (hasUnsavedChanges) {
                    saveTask();
                }
            };
    
            // Xử lý back/forward trên trình duyệt
            const handlePopState = () => {
                if (currentPath === "/project") {
                    saveTask();
                }
            };
    
            // Đăng ký event listeners
            window.addEventListener("beforeunload", handleBeforeUnload);
            window.addEventListener("popstate", handlePopState);
    
            // Cleanup function
            return () => {
                saveTask(); // Lưu lại trước khi component unmount
                window.removeEventListener("beforeunload", handleBeforeUnload);
                window.removeEventListener("popstate", handlePopState);
            };
    }, [location.pathname, dispatch, hasUnsavedChanges, tasks]);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="kanban">
                {/* To Do Column */}
                <KanbanColumn 
                    status="To do" 
                    title={t('kanban.todo')} 
                    projectId={id}
                    formattedUsers={formattedUsers}
                    setFormatedUser={setFormatedUser}
                    users={users}
                    setUser={setUser}
                    taskDetailMembers={taskDetailMembers}
                    setTaskDetailMember={setTaskDetailMember}
                    assignedUserId={assignedUserId}
                    setAssignedUserId={setAssignedUserId}
                    tasks={tasks}
                    taskMembers={taskMembers}
                    moveItem={moveItem}
                    borderColor="#007bff" 
                />

                {/* In Progress Column */}
                <KanbanColumn 
                    status="In progress" 
                    title={t('kanban.inProgress')} 
                    tasks={tasks}
                    projectId={id}
                    formattedUsers={formattedUsers}
                    setFormatedUser={setFormatedUser}
                    users={users}
                    setUser={setUser}
                    taskDetailMembers={taskDetailMembers}
                    setTaskDetailMember={setTaskDetailMember}
                    assignedUserId={assignedUserId}
                    setAssignedUserId={setAssignedUserId}
                    taskMembers={taskMembers}
                    moveItem={moveItem}
                    borderColor="#f59e0b" 
                />

                {/* Complete Column */}
                <KanbanColumn 
                    status="Complete" 
                    title={t('kanban.complete')} 
                    tasks={tasks}
                    projectId={id}
                    formattedUsers={formattedUsers}
                    setFormatedUser={setFormatedUser}
                    users={users}
                    setUser={setUser}
                    taskDetailMembers={taskDetailMembers}
                    setTaskDetailMember={setTaskDetailMember}
                    assignedUserId={assignedUserId}
                    setAssignedUserId={setAssignedUserId}
                    taskMembers={taskMembers}
                    moveItem={moveItem}
                    borderColor="rgb(50, 213, 131)" 
                />
            </div>
        </DndProvider>
    );
};

// Định nghĩa KanbanColumn bên ngoài Kanban nhưng vẫn trong cùng file
const KanbanColumn = ({
    status,
    title,
    tasks,
    taskMembers,
    moveItem,
    borderColor,
    projectId,
    users,
    setUser,
    formattedUsers,
    setFormatedUser,
    taskDetailMembers,
    setTaskDetailMember,
    assignedUserId,
    setAssignedUserId
})=> {
    console.log(formattedUsers)
    const {role}=useOutletContext()
    const isDroppable = role !== 'viewer';
    const [{ isOver }, drop] = useDrop({
        accept: ItemType,
        canDrop:()=>isDroppable,
        drop: (item) => moveItem(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });
    const filteredTasks = tasks.filter(task => task.status === status);
    const mergeTask=filteredTasks.map((task)=>{
        const members = taskMembers.find(memberGroup => 
            memberGroup[0]?.task_id === task.id
          ) || []
        
        return {
            ...task,
            members: members.map(mem => ({
              firstname: mem.user.firstname,
              lastname: mem.user.lastname,
              avatar: mem.user.avatar,
            }))
        }
    })  
    return (
        <div 
            className="kanbanColumn" 
            ref={drop}
            style={{ backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : '' }}
        >
            <div className="kanbanHeader" style={{borderLeft: `1rem solid ${borderColor}`}}>
                {title}
            </div>
            <div className='kanbanItemList'>
                {mergeTask.map((task) => (
                    <KanbanItem key={task.id}
                                taskItem={task}
                                users={users}
                                formattedUsers={formattedUsers}
                                setFormatedUser={setFormatedUser}
                                projectId={projectId}
                                taskDetailMembers={taskDetailMembers}
                                setTaskDetailMember={setTaskDetailMember}
                                assignedUserId={assignedUserId}
                                setAssignedUserId={setAssignedUserId}
                    />
                ))}
            </div>
        </div>
    );
};

// Định nghĩa KanbanItem bên ngoài Kanban nhưng vẫn trong cùng file
const KanbanItem = ({ users,taskItem, projectId, formattedUsers, setFormatedUser,assignedUserId,setAssignedUserId, taskDetailMembers,setTaskDetailMember }) => {
    const { t } = useTranslation();
    const userId=useSelector(state=>state.userProfile.id)
    const avatar=useSelector(state=>state.userProfile.avatar)
    const lastname=useSelector(state=>state.userProfile.lastname)
    const firstname=useSelector(state=>state.userProfile.firstname)
    const {role}=useOutletContext()
    const isDraggable = role !== 'viewer';
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: taskItem.id },
        canDrag: isDraggable,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
        const dispatch=useDispatch()
        const {socket}=useOutletContext()
        const {timezone}=useTimezone()
        const animatedComponents = makeAnimated();
        const theme=useSelector((state)=>state.setting.darkMode)
        const [isOpenTab, setIsOpenTab] = useState('Detail');
        const { id } = useParams()
        const [overlay, setOverlay]=useState(false)
        const [deleteTask,setDeleteTask]=useState(false)
        const [taskDetailOpen, setTaskDetailOpen]=useState(false)
        const [taskDetail, setTaskDetail]=useState()
        const tasks=useSelector(state=> state.tasks.tasks)
        const taskMembers=useSelector((state)=>state.tasks.members)
        const [taskId, setTaskId]=useState()
        const [attachmentId, setAttachmentId]=useState()
        const [attachmentUrl, setAttachmentUrl]=useState()
        const [priority, setPriority] = useState();
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [status, setStatus] = useState();
        const [startDate, setStartDate] = useState("");
        const [dueDate, setDueDate] = useState("");
        const [isSelecting, setIsSelecting] = useState(false);
        const [deleteAttachment, setDeleteAttachment]=useState(false)
        console.log(formattedUsers)
        const tabs=[
            { value: 'Detail', label: 'Detail' },
            { value: 'Comment', label: 'Comment' },
        ]
        const options = [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Urgent', label: 'Urgent' }
        ];
        const statusOptions = [
            { value: 'To do', label: 'To do' },
            { value: 'In progress', label: 'In progress' },
            { value: 'Complete', label: 'Complete' },
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
        const handleFileChange = async (event, id) => {
          const formattedUsersId=assignedUserId.map(user=>user.value)
          const file = event.target.files[0]; // Lấy file người dùng chọn
          if (file) {
            console.log("Selected file: ", file);
            try{
               const result=await task.uploadAttachment(file, id)
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
                    message:`${lastname} ${firstname} vừa cập nhập 1 task`,
                    projectId: projectId,
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
                    message:`${lastname} ${firstname} vừa cập nhập 1 task`,
                    projectId: projectId,
                    createdAt:new Date().toISOString()
                }
                socket.emit('new-update', socketData)
               getTaskDetail(id)
            } catch (error) {
                console.error('Error uploading file:', error);
            }
          }
        };
        
        console.log(taskDetail)

        async function getTaskDetail(task_id){
            try{
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
                setOverlay(true)

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
        async function handleDeleteAttachment(s3UrlFromDB, id, task_id){
            try{
                const key = extractS3KeyFromUrl(s3UrlFromDB);
                const formattedUsersId=assignedUserId.map(user=>user.value)
                const result=await task.deleteAttachment(key, id)
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
                    message:`${lastname} ${firstname} vừa cập nhập 1 task`,
                    projectId: projectId,
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
                    message:`${lastname} ${firstname} vừa cập nhập 1 task`,
                    projectId: projectId,
                    createdAt:new Date().toISOString()
                }
                socket.emit('new-update', socketData)
                getTaskDetail(task_id)
                setDeleteAttachment(false)
            }catch (error){
                console.log(error)
            }
        }
        const handleSelect = (selectedUsers) => {
            console.log(selectedUsers)
            if (!selectedUsers || selectedUsers.length === 0) {
                return;
            }else if(selectedUsers) {
                const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
                const userMap = new Map(users.map(user => [user.id, user]));
                const selected= assignedIds.map(id => userMap.get(id));
                console.log(selectedUsers)
                setAssignedUserId(selectedUsers);
                setTaskDetailMember(selected)
            } else {
                console.log('❌ selectedUsers is null or empty');
                // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
                setAssignedUserId([]);
            }
        };
        const handleSaveEdit=async(e)=>{
            try{
                const formattedUsersId=assignedUserId.map(user=>user.value)
                await task.updateTaskDetail(
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
                    message:`${lastname} ${firstname} vừa cập nhập 1 task`,
                    projectId: projectId,
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
                    message:`${lastname} ${firstname} vừa cập nhập 1 task`,
                    projectId: projectId,
                    createdAt:new Date().toISOString()
                }
                socket.emit('new-update', socketData)
                dispatch(getAllTodayTask())
                dispatch(getAllUpcomingTask())
                dispatch(getAllTask(id))
            }catch(error){
                console.log(error)
            }
        }
        const handleDeleteTask=async(e,taskId)=>{        
            try{
                await task.deleteTask(taskId)
                dispatch(getAllTask(id))
                setDeleteTask(false)
                setOverlay(false)
            }catch(error){
                console.log(error)
            }
        }
        console.log(users)
        useEffect(() => {
            if (taskDetailMembers.length > 0 && users.length > 0) {
              const preselectedUsers = formattedUsers.filter(option =>
                taskDetailMembers.some(user => user.id === option.value)
              );
              console.log('❌ selectedUsers is null or empty');
       
              setAssignedUserId(preselectedUsers);
            }else{
                console.log('❌ selectedUsers is null or empty');
            }

        }, [taskDetailMembers, formattedUsers]);
        
        console.log(role)
        console.log(taskDetailMembers)
        console.log(assignedUserId)
        console.log(taskItem)
    return (
      <div>
        <div 
            ref={drag} 
            className="kanbanItem" 
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={()=>getTaskDetail(taskItem.id)}
        >
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>{taskItem.title}</p>
                <div className={`priority-${taskItem.priority.toLowerCase()}`} style={{display:'inline-block', marginBottom:'4px'}}>{t(`list.priority.${taskItem.priority}`)}</div>
            </div>
            <span>{taskItem.description}</span>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',borderTop:'1px solid'}}>
                <div style={{display:'flex', gap:'.5rem', fontSize:'12px', paddingTop:'.5rem'}}>
                    <div>
                        {new Intl.DateTimeFormat('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: timezone,
                        }).format(new Date(taskItem.endedAt))}
                    </div>
                    <div>
                        {new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: timezone,
                        }).format(new Date(taskItem.endedAt))}
                    </div>
                </div>
                <div className="member" style={{display:'flex', gap:'.5rem'}}>
                {taskItem.members.length>3?(
                    <>
                        {taskItem.members.slice(2).map(member=>
                            <div>
                                <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'24px ', width: '24px '}} alt="Avatar" />
                             </div>
                        )}
                            <div
                                style={{
                                    borderRadius: '50%',
                                    height: '24px',
                                    width: '24px',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color:'black'
                                }}
                            >
                                +{taskItem.members.length - 2}
                            </div>
                    </>
                    ):(taskItem.members.map(member=>
                        <div>
                            <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ borderRadius: '50%', height:'24px ', width: '24px '}} alt="Avatar" />
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
        <div className={`overlay-${overlay?'active':'unActive'}`}>
                {deleteTask?(
                    <div className='delete-warning'>
                        <h2>Xác nhận xóa</h2>
                        <span>Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.</span>
                        <div className='delete-warning-footer'>
                            <div className='edit' onClick={()=>{setOverlay(null), setDeleteTask(null)}}>
                            <p>Cancel</p>
                            </div>
                            <div className='delete' onClick={(e)=>handleDeleteTask(e, taskId)}>
                                <Trash2 color='white'></Trash2>
                                <p style={{color:'white'}}>Delete</p>
                            </div>
                        </div>
                    </div>
                ):(taskDetail&&status&&priority?taskDetail.map(item=>{
                    return role=='viewer'?(
                        <div className={`taskDetail-${taskDetailOpen?'active':'unActive'}`}>
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
                            <div style={{display:'flex', gap:'.5rem'}}>Start date: 
                                <div style={{display:'flex', gap:'.5rem', fontSize:'14px', fontWeight:'500'}}>
                                    <div>
                                        {new Intl.DateTimeFormat('en-CA', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        timeZone: timezone,
                                        }).format(new Date(taskItem.endedAt))}
                                    </div>
                                    <div>
                                        {new Intl.DateTimeFormat('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: timezone,
                                        }).format(new Date(taskItem.endedAt))}
                                    </div>
                                </div>
                            </div>

                            <div style={{display:'flex', gap:'.5rem'}}>Due date: 
                                <div style={{display:'flex', gap:'.5rem', fontSize:'14px',fontWeight:'500'}}>
                                    <div>
                                        {new Intl.DateTimeFormat('en-CA', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        timeZone: timezone,
                                        }).format(new Date(taskItem.endedAt))}
                                    </div>
                                    <div>
                                        {new Intl.DateTimeFormat('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        timeZone: timezone,
                                        }).format(new Date(taskItem.endedAt))}
                                    </div>
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
                        {isOpenTab==='Detail'?<div className='taskDetail-body'>
                            <div className='body-item'>
                                <h4>Description</h4>
                                <div>
                                    <p style={{border: 'none',outline: 'none', boxShadow: 'none', width:'100%', fontSize:'16px'}}>{description}</p>
                                </div>
                            </div>
                            <div className='body-item'>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>Assign</h4>
                                </div>
                                
                                <div style={{maxHeight:'150px', overflowY:'scroll'}}>
                                    {taskDetailMembers.map(user=>
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
                            <div className='body-item' style={{border:`${theme?'1px solid rgb(29, 41, 57)':'1px solid rgb(229, 229, 229)'}`, borderRadius:'1rem', maxHeight:'200px', overflowY:'scroll'}}>
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
                
                        </div>:<Comment role={role} socket={socket} taskId={item.id} assignedUserId={assignedUserId} projectId={projectId}></Comment>}
                    </div>
                    ):(
                    <div className={`taskDetail-${taskDetailOpen?'active':'unActive'}`}>
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
                        <div style={{fontSize:'14px', display:'flex', gap:'1rem', color:'rgb(107, 114, 128)'}}>
                            <div style={{display:'flex', gap:'.5rem'}}>Start date: 
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
                                       style={{border: 'none',outline: 'none', boxShadow: 'none', fontSize:'16px', color:'rgb(107, 114, 128)'}}
                                >  
                                </input>
                            </div>

                            <div style={{display:'flex', gap:'.5rem'}}>Due date: 
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
                                       style={{border: 'none',outline: 'none', boxShadow: 'none', fontSize:'16px', color:'rgb(107, 114, 128)'}}
                                >  
                                </input>
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
                        {isOpenTab==='Detail'?<div className='taskDetail-body'>
                            <div className='body-item'>
                                <h4>Description</h4>
                                <div>
                                    <input value={description} onChange={(e)=>setDescription(e.target.value)}  style={{border: 'none',outline: 'none', boxShadow: 'none', width:'100%', fontSize:'16px'}}></input>
                                </div>
                            </div>
                            <div className='body-item'>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>Assign</h4>
                                    {isSelecting ?(<span
                                        onClick={() => setIsSelecting(false)}
                                        style={{color:'#007bff', fontWeight:'600'}}
                                        >
                                        Done
                                        </span>
                                    ): (
                                        <span
                                        onClick={() => setIsSelecting(true)}
                                        style={{color:'#007bff', fontWeight:'600'}}
                                        >
                                        Add
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
                                        <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
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
                
                        </div>:<Comment socket={socket} taskId={item.id} assignedUserId={assignedUserId} projectId={projectId}></Comment>}
                        <div className='taskDetail-footer'>
                                <div className='edit' onClick={handleSaveEdit}>
                                   <FilePenLine></FilePenLine>
                                   <p>Save</p>
                                </div>
                                <div className='delete' onClick={()=>{setDeleteTask(true), setTaskDetail(false)}}>
                                    <Trash2 color='white'></Trash2>
                                    <p style={{color:'white'}}>Delete</p>
                                </div>
                        </div>
                        <div className={`overlay-${deleteAttachment?'active':'unActive'}`}>
                            <div className='delete-warning'>
                                <h2>Xác nhận xóa</h2>
                                <span>Bạn có chắc chắn muốn xóa file này? Hành động này không thể hoàn tác.</span>
                                <div className='delete-warning-footer'>
                                    <div className='edit' onClick={()=>{ setDeleteAttachment(false)}}>
                                    <p>Cancel</p>
                                    </div>
                                    <div className='delete' onClick={(e)=>handleDeleteAttachment(attachmentUrl, attachmentId, taskId)}>
                                        <Trash2 color='white'></Trash2>
                                        <p style={{color:'white'}}>Delete</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                }):<div>Loading</div>
                )}
            </div>
 
      </div>
    );
};