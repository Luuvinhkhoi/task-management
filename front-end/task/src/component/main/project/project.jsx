import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, Outlet } from 'react-router-dom'
import './project.css'
import {X} from 'lucide-react'
import { useDispatch } from 'react-redux'
import task from '../../../util/task'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next";
import { fetchProjects } from '../../../store/project'
import { getAllTask } from '../../../store/task'
export const Project = ()=>{
    const { t } = useTranslation();
    const userId=useSelector(state=>state.userProfile.id)
    const userName=useSelector((state)=>state.userProfile.firstname)
    const lastname=useSelector((state)=>state.userProfile.lastname)
    const avatar=useSelector((state)=>state.userProfile.avatar)
    const {socket}=useOutletContext()
    const dispatch=useDispatch()
    const darkMode = useSelector((state) => state.setting.darkMode);
    const animatedComponents = makeAnimated();
    const [isActive, setActive]=useState()
    const [members,setMember]=useState([])
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [projectFormOpen, setProjectFormOpen]=useState(false)
    const [taskFormOpen, setTaskFormOpen]=useState(false)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState('To do');
    const [priority, setPriority] = useState('Medium');
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [assignedUserId, setAssignedUserId] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [users, setUser]=useState([])
    const [projectUsers, setProjectUser]=useState([])
    const [role, setRole]=useState()
    const [formattedUser, setFormatedUser]=useState([])
    const [formattedProjectUser, setFormatedProjectUser]=useState([])
    const location=useLocation()
    const navigate=useNavigate()
    let param=useParams()
    function listActive(){
      if(location.pathname.endsWith('list')){
        return true
      } else{
        return false
      }
    }
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
        color: darkMode ? '#ddd' : '#000',
        border: darkMode?'1px solid rgb(29, 41, 57)': '1px solid rgb(228, 231, 236)',
        padding: '8px',
        fontSize: '14px',
        '&:hover': {
          border: darkMode?'1px solid rgb(29, 41, 57)': '1px solid rgb(228, 231, 236)',
        },
        borderRadius:'.5rem'
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
          ? (darkMode ? '#007bff' : '#eaeaea')
          : (darkMode ? '#1c2536' : '#fff'),
        color: darkMode ? '#fff' : '#000',
        fontSize: '14px',
        cursor: 'pointer',
      }),
      singleValue: (base) => ({
        ...base,
        color: darkMode ? '#ddd' : '#000',
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: darkMode ? '#1c2536' : '#fff',
        zIndex: 9999,
      }),
    });
    const getCustomStyle=customStyles(darkMode)
    const handleTaskSubmit = async (e) => {
      e.preventDefault()
      const formattedUsersId=assignedUserId.map(user=>user.value)
      const result=await task.createTask(
        title,
        description,
        status,
        priority,
        startDate,
        dueDate,
        formattedUsersId,
        projectId
      );
      const data={
        taskId:result.taskId,
        actorId:userId,
        assignedUserId:formattedUsersId,
        user:{
              id: userId,
              avatar:avatar,
              firstname:userName,
              lastname:lastname
        },
        createdAt:result.createdAt,
        message:`${lastname} ${userName} vừa thêm vào 1 task mới`,
        projectId: projectId
      }
      const result2 = await task.createNoti(data)
      const socketData={
        notiId:result2,
        taskId:result.taskId,
        actorId:userId,
        assignedUserId:formattedUsersId,
        user:{
              id: userId,
              avatar:avatar,
              firstname:userName,
              lastname:lastname
        },
        createdAt:result.createdAt,
        message:`${lastname} ${userName} vừa thêm vào 1 task mới`,
        projectId: projectId
      }
      socket.emit('new-task', socketData)
      dispatch(getAllTask(projectId))
      setTaskFormOpen(false)
      setTitle("")
      setStartDate("")
      setDueDate("")
      setAssignedUserId([])
      setDescription("")
      setAssignedUserId([])
    };
    
    const handleAssignUser = (selectedUsers) => {
      if (selectedUsers) {
        const assignedIds = selectedUsers.map((user) => user.value);
        members.push(selectedUsers)
        setAssignedUserId(assignedIds);
      } else {
        // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
        setAssignedUserId([]);
      }
    };
    
    const handleSelect = (selectedUsers) => {
      console.log(selectedUsers)
      if (!selectedUsers || selectedUsers.length === 0) {
          setMember([]);
          return;
      }else if(selectedUsers) {
          const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
          const userMap = new Map(users.map(user => [user.id, user]));
          const selected= assignedIds.map(id => userMap.get(id));
          console.log(selected)
          setAssignedUserId(selectedUsers);
          setMember(selected);
      } else {
          console.log('❌ selectedUsers is null or empty');
          // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
          setAssignedUserId([]);
      }
  };
    useEffect(()=>{
        setProjectId(param.id)
    },[param])
    useEffect(()=>{
      async function setUserRole(){
        try{
          const result=await task.getUserRole(param.id)
          setRole(result[0].role)
        }catch(error){
          console.log(error)
        }
      }
      setUserRole()
    },[projectId])
    console.log(role)
    useEffect(()=>{
      async function getAllUser(){
        try{
          const result = await task.getAllUser()
          const formattedUsers = result.map(user => ({
            value: user.id, // Dùng ID làm giá trị
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                <span>{user.firstname} {user.lastname}</span>
              </div>
            )// Dùng username làm tên hiển thị
          }));
          setUser(result)
          setFormatedUser(formattedUsers)
        } catch(error){
          console.log(error)
        }
      }
      getAllUser()
    },[param.id])
    useEffect(()=>{
      async function getUserByProjectId(){
        try{
          const result = await task.getUserByProjectId(param.id)
          const formattedUsers = result.map(user => ({
            value: user.id, // Dùng ID làm giá trị
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                <span>{user.firstname} {user.lastname}</span>
              </div>
            )// Dùng username làm tên hiển thị
          }));
          setProjectUser(result)
          setFormatedProjectUser(formattedUsers)
        } catch(error){
          console.log(error)
        }
      }
      getUserByProjectId()
    },[param.id])
    
    console.log(formattedProjectUser)
    return (
        <div className="project">
           <div className='projectHeader'>
             <div className='headerItem'>
                <div style={{cursor:'pointer'}} className={`projectHeader-${listActive()?'unActive':'active'}`} onClick={()=>navigate(`/project/${param.id}`)}>{t('project.Kanban board')}</div>
                <div style={{cursor:'pointer'}} className={`projectHeader-${listActive()?'active':'unActive'}`} onClick={()=>navigate(`/project/${param.id}/list`)}>{t('project.List')}</div>
             </div>
             <div className='headerItem'>  
                <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                    <div style={{fontWeight:'500', fontSize:16}}>Your role: {role}</div>
                    <div className='create' onClick={()=>setTaskFormOpen(true)}>{t('project.New task')}</div>
                </div>
                <div className={`overlay-${taskFormOpen?'active':'unActive'}`}>
                  <form className={`projectForm-${taskFormOpen?'active':'unActive'}`} onSubmit={handleTaskSubmit} >
                      <div className='close-button' onClick={()=>{setTaskFormOpen(!taskFormOpen)}}><X></X></div>
                      <h3>Create new task</h3>
                      <div className='title'>
                        <input value={title} placeholder='title'  onChange={(e)=>setTitle(e.target.value)} minLength={2} maxLength={20}></input>
                      </div>
                      <div className='option'>
                        <div className='select'>
                          <Select
                            options={statusOptions}
                            styles={getCustomStyle}
                            defaultValue={statusOptions[0]}
                            onChange={(selectedOption) => setStatus(selectedOption.value)} // Medium
                          />
                        </div>
                        <div className='select'>
                          <Select
                            options={options}
                            styles={getCustomStyle}
                            defaultValue={options[1]}
                            onChange={(selectedOption) => setPriority(selectedOption.value)} // Medium
                          />
                        </div>
                      </div>
                      <div className='title'>
                        <input placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} minLength={2} maxLength={200}></input>
                      </div>
                      <div className='date'>
                        <div>
                          <p>Start date</p>
                          <div><input type='datetime-local'  
                                value={startDate}
                                onChange={(e) => {
                                  const newStart = e.target.value;
                                  if (!dueDate || newStart <= dueDate) {
                                    setStartDate(newStart);
                                  } else {
                                    alert('Start date cannot be after due date!');
                                  }
                            }}
                          ></input></div>
                        </div>
                        <div>
                          <p>Due date</p>
                          <div>
                            <input type='datetime-local'  
                                value={dueDate}
                                onChange={(e) => {
                                  const newDue = e.target.value;
                                  if (!startDate || newDue >= startDate) {
                                    setDueDate(newDue);
                                  } else {
                                    alert('Due date cannot be before start date!');
                                  }
                                }}
                            >
                          </input></div>
                        </div>
                      </div>
                      <Select 
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={assignedUserId}
                        isMulti
                        styles={getCustomStyle}
                        options={formattedProjectUser}
                        onChange={handleSelect}
                      ></Select>
                      
                      <button>Create Task</button>
                  </form>
                </div>
             </div>
           </div>
           <Outlet context={{socket, role}}></Outlet>  
        </div>
    )
}