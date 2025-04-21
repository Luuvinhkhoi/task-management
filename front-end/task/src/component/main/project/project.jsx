import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, Outlet } from 'react-router-dom'
import './project.css'
import {X} from 'lucide-react'
import task from '../../../util/task'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next";
export const Project = ()=>{
    const { t } = useTranslation();
    const darkMode = useSelector((state) => state.setting.darkMode);
    const animatedComponents = makeAnimated();
    const [isActive, setActive]=useState()
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
        border: darkMode?'3px solid rgb(29, 41, 57)': '3px solid rgb(228, 231, 236)',
        padding: '8px',
        fontSize: '14px',
        '&:hover': {
          border: darkMode?'3px solid rgb(29, 41, 57)': '3px solid rgb(228, 231, 236)',
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
      await task.createTask(
        title,
        description,
        status,
        priority,
        startDate,
        dueDate,
        assignedUserId,
        projectId
      );
    };
    const handleProjectSubmit = async(e)=>{
      try{
        e.preventDefault()
        await task.createProject(title, startDate, dueDate)
      } catch(error){
        console.log(error)
      }
    }
    const handleAssignUser = (selectedUsers) => {
      if (selectedUsers) {
        const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
        setAssignedUserId(assignedIds);
      } else {
        // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
        setAssignedUserId([]);
      }
    };
    
    useEffect(()=>{
      setProjectId(param.id)
    },[param])
    useEffect(()=>{
      async function getAllUser(){
        try{
          const result = await task.getAllUser()
          const formattedUsers = result.map(user => ({
            value: user.id, // Dùng ID làm giá trị
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
                <span>{user.firstname}</span>
              </div>
            )// Dùng username làm tên hiển thị
          }));
          setUser(formattedUsers)
        } catch(error){
          console.log(error)
        }
      }
      getAllUser()
    },[])
    return (
        <div className="project">
           <div className='projectHeader'>
             <div className='headerItem'>
                <div className={`projectHeader-${listActive()?'unActive':'active'}`} onClick={()=>navigate(`/project/${param.id}`)}>{t('project.Kanban board')}</div>
                <div className={`projectHeader-${listActive()?'active':'unActive'}`} onClick={()=>navigate(`/project/${param.id}/list`)}>{t('project.List')}</div>
             </div>
             <div className='headerItem'>
                <div className='create' onClick={()=>setProjectFormOpen(true)}>
                  <p>{t('project.New project')}</p>
                </div>
                <div className={`overlay-${projectFormOpen?'active':'unActive'}`}>
                  <form className={`projectForm-${projectFormOpen?'active':'unActive'}`} onSubmit={handleProjectSubmit}>
                      <div className='close-button' onClick={()=>{setProjectFormOpen(!projectFormOpen)}}><X></X></div>
                      <h3>Create new project</h3>
                      <div className='title'>
                        <input placeholder='Title' onChange={(e)=>setTitle(e.target.value)} minLength={2} maxLength={20}></input>
                        <small>{title.length}/20</small>
                      </div>
                      <div className='date' style={{justifyContent:'space-between'}}>
                        <div>
                          <p>Start date</p>
                          <div><input type='date'  
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
                            <input type='date'  
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
                      <button>Create Project</button>
                  </form>
                </div>
                <div className='create' onClick={()=>setTaskFormOpen(true)}>{t('project.New task')}</div>
                <div className={`overlay-${taskFormOpen?'active':'unActive'}`}>
                  <form className={`projectForm-${taskFormOpen?'active':'unActive'}`} onSubmit={handleTaskSubmit} >
                      <div className='close-button' onClick={()=>{setTaskFormOpen(!taskFormOpen)}}><X></X></div>
                      <h3>Create new task</h3>
                      <div className='title'>
                        <input placeholder='Title'  onChange={(e)=>setTitle(e.target.value)} minLength={2} maxLength={20}></input>
                      </div>
                      <div className='option'>
                        <div className='select'>
                          <Select
                            options={statusOptions}
                            styles={getCustomStyle}
                            defaultValue={statusOptions[1]}
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
                        <input placeholder='Description' onChange={(e)=>setDescription(e.target.value)} minLength={2} maxLength={200}></input>
                      </div>
                      <div className='date'>
                        <div>
                          <p>Start date</p>
                          <div><input type='datetime-local'  
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
                        isMulti
                        styles={getCustomStyle}
                        options={users}
                        onChange={handleAssignUser}
                      ></Select>
                      
                      <button>Create Task</button>
                  </form>
                </div>
             </div>
           </div>
           <Outlet></Outlet>
        </div>
    )
}