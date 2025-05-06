import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {Settings, LayoutDashboard, FolderGit2, ChevronDown, Ellipsis, ChevronRight} from 'lucide-react'
import { AnimatePresence, motion} from 'framer-motion'
import {X} from 'lucide-react'
import { Trash2, FilePenLine } from 'lucide-react';
import task from '../../../util/task'
import './sidebar.css'
import app from '../../../assets/app.png'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useTranslation } from 'react-i18next';
export const SideBar = ()=>{
   let location=useLocation()
   const darkMode = useSelector((state) => state.setting.darkMode);
   const {t}=useTranslation()
   const animatedComponents = makeAnimated();
   let param=useParams()
   const [projects, setProject]=useState([])
   const [projectDetail, setProjectDetail]=useState([])
   const [projectFormOpen, setProjectFormOpen]=useState(null)
   const [optionFormOpen, setOptionFormOpen]=useState(null)
   const [editFormOpen, setEditFormOpen]=useState(null)
   const [title, setTitle] = useState("");
   const [startDate, setStartDate] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [assignedUserId, setAssignedUserId] = useState([]);
   const [projectId, setProjectId] = useState("");
   const [users, setUser]=useState([])
   const [projectUsers, setProjectUser]=useState([])
   const [formattedUser, setFormatedUser]=useState([])
   const [formattedProjectUser, setFormatedProjectUser]=useState([])
   const [initialProjectUSer, setInitialProjectUser]=useState()
   const [isOpen, setIsOpen]=useState('unActive')
   const navigate=useNavigate()
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
   const customComponents = {
      MultiValue: () => null, // Không render gì cả
   };
   const getCustomStyle=customStyles(darkMode)
   const isActive=(path)=>{
     return location.pathname===path
   }
   const isSubActive = (subPath) => {
      return location.pathname === subPath
    }
   const handleProjectSubmit = async(e, id)=>{
      e.preventDefault()
      console.log(id)
      try{
        await task.updateProject(
              {id:id,
               title:title,
               assignedUserId:assignedUserId,
               startDate:startDate,
               dueDate: dueDate
              }
        )
        setProjectFormOpen(!projectFormOpen)
      } catch(error){
        console.log(error)
      }
   }
   const handleSelect = (selectedUsers) => {
      console.log(selectedUsers)
      if(selectedUsers) {
          console.log(selectedUsers)
          const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
          const userMap = new Map(users.map(user => [user.id, user]));
          const selected= assignedIds.map(id => userMap.get(id));
          console.log(selected) 
          setAssignedUserId(assignedIds);
          setProjectUser(selected);
          const formattedUsers = selected.map(user => ({
            value: user.id, // Dùng ID làm giá trị
            label: `${user.firstname} ${user.lastname}`,// Dùng username làm tên hiển thị
            avatar: user.avatar || 'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'
          }));
          console.log(formattedUser)
          console.log(assignedIds)
          setFormatedProjectUser(formattedUsers)
          setAssignedUserId(assignedIds)


      } else {
          console.log('❌ selectedUsers is null or empty');
          // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
          setAssignedUserId([]);
      }
   }
   const handleEditProject= async (id)=>{
    try{
      const result = await task.getAllUser()
      const formattedUsers = result.map(user => ({
        value: user.id, // Dùng ID làm giá trị
        label: `${user.firstname} ${user.lastname}`,// Dùng username làm tên hiển thị
        avatar: user.avatar || 'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'
      }));
      const result2 = await task.getUserByProjectId(id)
      const projectUserIds = result2.map(user => user.id);
      const formattedProjectUser = result2.map(user =>
       formattedUsers.find(u => u.value === user.id)
     ).filter(Boolean);
      // Loại bỏ phần tử undefined nếu không tìm thấy
      const result3=await task.getProjectById(id)
      setTitle(result3.title)
      setStartDate(result3.createdAt)
      setDueDate(result3.endedAt)
      setProjectUser(result2)
      setUser(result)
      setFormatedUser(formattedUsers)
      setFormatedProjectUser(formattedProjectUser)
      const assignedIds = formattedProjectUser.map((user) => user.value);
      setAssignedUserId(assignedIds)
    } catch(error){
      console.log(error)
    }
   }
   const handleRemoveUser=async(id)=>{
      try{
        const formattedSelect=formattedProjectUser.filter(user=>user.value!==id)
        const select=projectUsers.filter(user=>user.id!==id)
        setFormatedProjectUser(formattedSelect)
        setProjectUser(select)
        const select2=assignedUserId.filter(userId=>userId!==id)
        setAssignedUserId(select2)
      } catch(error){
          console.log(error)
      }
   }
   useEffect(() => {
      if (location.pathname.startsWith('/project')) {
        setIsOpen('active')
      }
    }, [location.pathname])
   useEffect(()=>{
      const fetchProjects = async () => {
         try {
           const result = await task.getAllProject();
           setProject(result); // Chỉ setProject nếu component vẫn còn mounted
         } catch (error) {
           console.error("Error fetching projects:", error);
         }
       };
      fetchProjects()
   },[])
   useEffect(()=>{
         async function getAllUser(){
           try{
             const result = await task.getAllUser()
             const formattedUsers = result.map(user => ({
               value: user.id, // Dùng ID làm giá trị
               label: `${user.firstname} ${user.lastname}`,// Dùng username làm tên hiển thị
               avatar: user.avatar || 'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'
             }));
             const result2 = await task.getUserByProjectId(param.id)
             const projectUserIds = result2.map(user => user.id);
             const formattedProjectUser = result2.map(user =>
              formattedUsers.find(u => u.value === user.id)
            ).filter(Boolean); // Loại bỏ phần tử undefined nếu không tìm thấy
             setProjectUser(result2)
             setInitialProjectUser(result2)
             setUser(result)
             setFormatedUser(formattedUsers)
             setFormatedProjectUser(formattedProjectUser)
             const assignedIds = formattedProjectUser.map((user) => user.value);
             setAssignedUserId(assignedIds)
           } catch(error){
             console.log(error)
           }
         }
         getAllUser()
    },[param.id])
    console.log(assignedUserId)
    console.log(projectUsers)
   return (
        <div className="sideBar">
           <div className='brand'>
               <img src={app} style={{width:'48px', height:'48px'}}></img>
               <h3>TASK</h3>
           </div>
           <div className='menu'>
               <div onClick={()=>navigate('/')} className={`menuItem ${isActive('/')?'active':''}`}>
                  <div>
                     <LayoutDashboard></LayoutDashboard>
                     {t('sideBar.dashboard')}
                  </div>
               </div>
               <div  className={`menuItem ${isActive('/project')?'active':''}`} onClick={()=>isOpen==='unActive'?setIsOpen('active'):setIsOpen('unActive')}>
                  <div style={{justifyContent:'space-between'}}>
                     <div style={{padding:'0', display:'flex', alignItems:'center', gap:'1rem'}}>
                        <FolderGit2></FolderGit2>
                        {t('sideBar.project')}
                     </div>
                     <ChevronDown style={{justifySelf:'end'}}></ChevronDown>
                  </div>
                  <AnimatePresence>
                     {isOpen === 'active'&& formattedProjectUser && (
                        <motion.div 
                           initial={{ height: 0, opacity: 0 }} 
                           animate={{ height: "auto", opacity: 1 }} 
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.3, ease: "easeOut" }}
                           className='projectList'
                        >
                           <ul>
                           {projects.map((project)=>
                             <div key={project.id} style={{position:'relative'}} className={isSubActive(`/project/${project.id}`)|| isSubActive(`/project/${project.id}/list`)? 'sub-active' : ''} onClick={(e)=>{e.stopPropagation(), setOptionFormOpen(null), navigate( `/project/${project.id}`)}}>
                                 <div style={{display:'flex', alignItems:'center', width:'100%', justifyContent:'space-between'}}><li>{project.title}</li>
                                 <Ellipsis style={{paddingRight: '1rem'}}
                                          onClick={(e) => {
                                             e.stopPropagation(); // Ngăn chặn sự kiện click lan lên menuItem
                                             setOptionFormOpen(project.id)
                                          }}
                                 ></Ellipsis></div>
                                 <div className= {`option-${optionFormOpen===project.id?'active':'unActive'}`} >
                                      <div className='close-button' onClick={(e)=>{
                                        e.stopPropagation(); // Ngăn chặn sự kiện click lan lên menuItem
                                        setOptionFormOpen(null)
                                        }}>
                                        <X style={{height:'16px', width:'16px'}}></X>
                                      </div>
                                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} onClick={(e)=>{
                                                e.stopPropagation()
                                                setProjectFormOpen(project.id)
                                                setOptionFormOpen(null) // Ngăn chặn sự kiện click lan lên menuItem
                                                setEditFormOpen(project.id)
                                                handleEditProject(project.id)
                                              }
                                              }
                                      >
                                          <div style={{display:'flex', gap:'.5rem', alignItems:'center'}}>
                                            <FilePenLine style={{width:'16px', height:'16px'}}></FilePenLine>
                                            <p>Edit</p>
                                          </div>
                                          <ChevronRight style={{width:'16px', height:'16px'}}>
                                          </ChevronRight>
                                      </div>
                                      <div style={{display:'flex', justifyContent:'space-between'}}>
                                          <div style={{display:'flex', gap:'.5rem', alignItems:'center'}}>
                                            <Trash2 style={{width:'16px', height:'16px', color:'red'}}></Trash2>
                                            <p style={{color:'red'}}>Delete</p>
                                          </div>
                                      </div>
                                    </div>
                                 <div className={`overlay-${projectFormOpen===project.id?'active':'unActive'}`} onClick={(e)=>e.stopPropagation()} >
                                    <form className={`projectForm-${editFormOpen===project.id?'active':'unActive'}`} onSubmit={(e)=>handleProjectSubmit(e, project.id)}>
                                            <div className='close-button' onClick={(e)=>{e.stopPropagation(),setEditFormOpen(null), setProjectFormOpen(null)}}><X></X></div>
                                            <h3>Edit project</h3>
                                            <div className='title'>
                                              <input value={title} onChange={(e)=>setTitle(e.target.value)} minLength={2} maxLength={20}></input>
                                              <small>{title.length}/20</small>
                                            </div>
                                            <div className='date' style={{justifyContent:'space-between'}}>
                                              <div>
                                                <p>Start date</p>
                                                <div><input type='date'
                                                      value={startDate ? new Date(startDate).toISOString().slice(0, 10) : ''}                                                      
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
                                                        value={dueDate ? new Date(dueDate).toISOString().slice(0, 10) : ''}                                                      
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
                                            <div className='select'>
                                              <Select 
                                                components={customComponents}
                                                isMulti
                                                value={formattedProjectUser}
                                                styles={getCustomStyle}
                                                options={formattedUser}
                                                onChange={handleSelect}
                                                formatOptionLabel={(option) => (
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <img 
                                                      src={option.avatar} 
                                                      alt="avatar" 
                                                      style={{ borderRadius: '50%', height: '32px', width: '32px' }} 
                                                    />
                                                    <span>{option.label}</span>
                                                  </div>
                                                )}
                                              ></Select>
                                            </div>
                                            <div className='member'>
                                                <div>
                                                    {projectUsers.length>0?projectUsers.map(user=>
                                                        <div key={user.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
                                                            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                                                              <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{width:'32px', height:'32px', borderRadius:'10rem'}}></img>
                                                              <div>
                                                                  <span>{user.firstname}</span>
                                                                  <span> </span>
                                                                  <span>{user.lastname}</span>
                                                                  <p>{user.email}</p>
                                                              </div>
                                                            </div>
                                                            <X style={{height:'16px', width:'16px'}} onClick={()=>handleRemoveUser(user.id)}></X>

                                                        </div>
                                                    ):(<span style={{marginTop:'1rem', display:'block', textAlign:'center'}}>Not any member yet</span>)}
                                                </div>
                                            </div>
                                            <button>Save</button>
                                      </form>
                                  </div>
                             </div>
                           )}
                           </ul>
                        </motion.div>
                     )}
                  </AnimatePresence>
                
               </div>
               <div onClick={()=>navigate('/setting')} className={`menuItem ${isActive('/setting')?'active':''}`}>
                  <div>
                     <Settings></Settings>
                     {t('sideBar.setting')}
                  </div>
               </div>
           </div>
        </div>
   )
}