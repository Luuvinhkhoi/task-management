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
import { useSocket } from '../../../../socketContext'
import { fetchProjects } from '../../../store/project'
import { getAllTask } from '../../../store/task'
export const Project = ()=>{
    const { t } = useTranslation();
    const userId=useSelector(state=>state.userProfile.id)
    const [touched, setTouched] = useState({
      title: false,
      startDate: false,
      dueDate: false,
      description:false,
      member:false
    });
    const userName=useSelector((state)=>state.userProfile.firstname)
    const lastname=useSelector((state)=>state.userProfile.lastname)
    const avatar=useSelector((state)=>state.userProfile.avatar)
    const socket=useSocket()
    const dispatch=useDispatch()
    const theme = useSelector((state) => state.setting.darkMode);
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
    const [formErrors, setFormErrors] = useState({});
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
              color:'inherit'
            }),
            multiValueLabel:()=>({
              color:`${darkMode?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}`

            }),
            multiValue: (base) => ({
                ...base,
                backgroundColor:'none',
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
                fontSize:'14px'
            }),
        });

    const getCustomStyle=customStyles(darkMode)
    const handleTaskSubmit = async (e) => {
      e.preventDefault()
       const errors = {};

      if (!title.trim()) {
        errors.title = t("createProject.errorTitle");
      }
      if (!startDate) {
        errors.startDate = t("createProject.errorStartDate");
      }
      if(!description){
        errors.description=t("createTask.description")
      }
      if (!dueDate) {
        errors.dueDate = t("createProject.errorDueDate");
      }
      if (startDate && dueDate && startDate > dueDate) {
        errors.date = t("createProject.errorInvalidRange");
      }
      if (assignedUserId.length === 0) {
        errors.member = t("createProject.errorNoMember");
      }
      console.log(assignedUserId)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setTouched({
            title: true,
            startDate:true,
            dueDate:true,
            description:true,
            member:true
        });
        return;
      }
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
        message:`task.created`,
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
        message:`task.created`,
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
    const handleStartDateChange = (e) => {
      const newStart = e.target.value;
      setStartDate(newStart);

      if (!newStart) {
        setFormErrors((prev) => ({
          ...prev,
          startDate: t("createProject.errorStartDate")
        }));
      } else if (dueDate && new Date(newStart) > new Date(dueDate)) {
        setFormErrors((prev) => ({
          ...prev,
          startDate: t("createProject.errorStartBeforeDue"),
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          startDate: null,
        }));
      }
    };

    const handleDueDateChange = (e) => {
      const newDue = e.target.value;
      setDueDate(newDue);

      if (!newDue) {
        setFormErrors((prev) => ({
          ...prev,
          dueDate: t("createProject.errorDueDate")
        }));
      } else if (startDate && new Date(startDate) > new Date(newDue)) {
        setFormErrors((prev) => ({
          ...prev,
          dueDate: t("createProject.errorDueAfterStart")
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          dueDate: null
        }));
      }
    };

    const handleSelect = (selectedUsers) => {
      if (!selectedUsers || selectedUsers.length === 0) {
          setMember([]);
          setAssignedUserId([]);
          return;
      }else if(selectedUsers) {
          const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
          const userMap = new Map(users.map(user => [user.id, user]));
          const selected= assignedIds.map(id => userMap.get(id));
          setAssignedUserId(selectedUsers);
          setMember(selected);
      } else {
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
    useEffect(()=>{
      async function getAllUser(){
        try{
          const result = await task.getAllUser()
          const formattedUsers = result.map(user => ({
            value: user.id, // Dùng ID làm giá trị
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color:`${theme?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}` }}>
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
    
    return (
        <div className="project">
           <div className='projectHeader'>
             <div className='headerItem'>
                <div style={{cursor:'pointer'}} className={`projectHeader-${listActive()?'unActive':'active'}`} onClick={()=>navigate(`/project/${param.id}`)}>{t('project.Kanban board')}</div>
                <div style={{cursor:'pointer'}} className={`projectHeader-${listActive()?'active':'unActive'}`} onClick={()=>navigate(`/project/${param.id}/list`)}>{t('project.List')}</div>
             </div>
             <div className='headerItem'>  
                {role==='viewer'?(
                  <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                    <div style={{fontWeight:'500', fontSize:16}}>Your role: {role}</div>
                  </div>
                ):(
                  <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                    <div style={{fontWeight:'500', fontSize:16}}>Your role: {role}</div>
                    <div className='create' onClick={()=>setTaskFormOpen(true)}>{t('project.New task')}</div>
                  </div>
                )}
                <div className={`overlay-${taskFormOpen?'active':'unActive'}`}>
                  <form className={`projectForm-${taskFormOpen?'active':'unActive'}`} onSubmit={handleTaskSubmit} >
                      <div className='close-button' onClick={()=>{setTaskFormOpen(!taskFormOpen), setFormErrors({}) ,setTitle(""),setDescription(''),setDueDate(''),setStartDate(''),setAssignedUserId([])}}><X></X></div>
                      <h3>{t('createTask.head')}</h3>
                      <div className='title'>
                        <input
                          placeholder={t("createProject.title")}
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);

                            // Xoá lỗi nếu giá trị hợp lệ
                            if (e.target.value.trim()) {
                              setFormErrors(prev => ({ ...prev, title: null }));
                            }
                          }}
                          onBlur={() => {
                            setTouched(prev => ({ ...prev, title: true }));
                            
                            if (!title.trim()) {
                              setFormErrors(prev => ({ ...prev, title: t("createProject.errorTitle") }));
                            }
                          }}
                        />                        
                      </div>
                      {formErrors.title && <p className="error">{formErrors.title}</p>}
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
                        <input placeholder={t("taskDetail.description")} value={description} onChange={(e)=>setDescription(e.target.value)} minLength={2} maxLength={200}></input>
                      </div>
                      <div className='date'>
                        <div>
                          <p>{t("taskDetail.startDate")}</p>
                          <div>
                           <input
                              type="datetime-local"
                              value={startDate}
                              onChange={handleStartDateChange}
                            />
                          </div>
                          {formErrors.startDate && <p className="error">{formErrors.startDate}</p>}
                        </div>
                        <div>
                          <p>{t("taskDetail.dueDate")}</p>
                          <div>
                            <input
                              type="datetime-local"
                              value={dueDate}
                              onChange={handleDueDateChange}
                            />
                          </div>
                          {formErrors.dueDate && <p className="error">{formErrors.dueDate}</p>}
                        </div>
                      </div>
                      <Select 
                        components={animatedComponents}
                        value={assignedUserId}
                        isMulti
                        styles={getCustomStyle}
                        options={formattedProjectUser}
                        onChange={handleSelect}
                        isClearable={true}
                      ></Select>
                      {formErrors.member && <p className="error">{formErrors.member}</p>}
                      <button style={{fontWeight:500}}>{t("createTask.head")}</button>
                  </form>
                </div>
             </div>
           </div>
           <Outlet context={{socket, role}}></Outlet>  
        </div>
    )
}