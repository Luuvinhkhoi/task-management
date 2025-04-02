import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, Outlet } from 'react-router-dom'
import './project.css'
import {X} from 'lucide-react'
import task from '../../../util/task'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
export const Project = ()=>{
    const animatedComponents = makeAnimated();
    const [isActive, setActive]=useState()
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [projectFormOpen, setProjectFormOpen]=useState(false)
    const [taskFormOpen, setTaskFormOpen]=useState(false)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
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
    
    console.log(users)
    console.log(assignedUserId)
    useEffect(()=>{
      setProjectId(param.id)
    },[param])
    useEffect(()=>{
      async function getAllUser(){
        try{
          const result = await task.getAllUser()
          const formattedUsers = result.map(user => ({
            value: user.id, // Dùng ID làm giá trị
            label: user.username // Dùng username làm tên hiển thị
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
                <div className={`projectHeader-${listActive()?'unActive':'active'}`} onClick={()=>navigate(`/project/${param.id}`)}>Kanban board</div>
                <div className={`projectHeader-${listActive()?'active':'unActive'}`} onClick={()=>navigate(`/project/${param.id}/list`)}>List</div>
             </div>
             <div className='headerItem'>
                <div className='create' onClick={()=>setProjectFormOpen(true)}>
                  <p>New project</p>
                </div>
                <div className={`overlay-${projectFormOpen?'active':'unActive'}`}>
                  <form className={`projectForm-${projectFormOpen?'active':'unActive'}`} onSubmit={handleProjectSubmit}>
                      <div className='close-button' onClick={()=>{setProjectFormOpen(!projectFormOpen)}}><X></X></div>
                      <h3>Create new project</h3>
                      <div className='title'>
                        <input placeholder='Title' onChange={(e)=>setTitle(e.target.value)} minLength={2} maxLength={20}></input>
                        <small>{title.length}/20</small>
                      </div>
                      <div className='date'>
                        <div><input type='date' onChange={(e)=>setStartDate(e.target.value)}></input></div>
                        <div><input type='date' onChange={(e)=>setDueDate(e.target.value)}></input></div>
                      </div>
                      <button>Create Project</button>
                  </form>
                </div>
                <div className='create' onClick={()=>setTaskFormOpen(true)}>New task</div>
                <div className={`overlay-${taskFormOpen?'active':'unActive'}`}>
                  <form className={`projectForm-${taskFormOpen?'active':'unActive'}`} onSubmit={handleTaskSubmit} >
                      <div className='close-button' onClick={()=>{setTaskFormOpen(!taskFormOpen)}}><X></X></div>
                      <h3>Create new task</h3>
                      <div className='title'>
                        <input placeholder='Title'  onChange={(e)=>setTitle(e.target.value)} minLength={2} maxLength={20}></input>
                      </div>
                      <div className='option'>
                        <div>
                          <select onChange={(e)=>setStatus(e.target.value)}>
                            <option value='To do'>To do</option>
                            <option value='In progress'>In progress</option>
                            <option value='Done'>Done</option>
                          </select>
                        </div>
                        <div>
                          <select onChange={(e)=>setPriority(e.target.value)} >
                            <option value='Low'>Low</option>
                            <option value='Medium'>Medium</option>
                            <option value='High'>High</option>
                            <option value='Urgent'>Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div className='title'>
                        <input placeholder='Description' onChange={(e)=>setDescription(e.target.value)} minLength={2} maxLength={200}></input>
                      </div>
                      <div className='date'>
                        <div><input type='date' onChange={(e)=>setStartDate(e.target.value)}></input></div>
                        <div><input type='date' onChange={(e)=>setDueDate(e.target.value)}></input></div>
                      </div>
                      <Select 
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
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