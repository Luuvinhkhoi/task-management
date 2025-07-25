import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {Settings, LayoutDashboard, FolderGit2, ChevronDown, Ellipsis, ChevronRight, Loader2} from 'lucide-react'
import { AnimatePresence, motion} from 'framer-motion'
import {X} from 'lucide-react'
import { Trash2, FilePenLine, Plus } from 'lucide-react';
import task from '../../../util/task'
import './sidebar.css'
import app from '../../../assets/app.png'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import makeAnimated, { MultiValue } from 'react-select/animated';
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../../../store/project'
import { RenderDropdown } from './optionMenu'
import { getAllUpcomingTask } from '../../../store/upcomingTask'
import { getAllTodayTask } from '../../../store/todayTask'
import { fetchProgress } from '../../../store/progress'
export const SideBar = ({role, isMobile, isSideBarOpen, onToggleSidebar, onClose })=>{
   let location=useLocation()
   const [formErrors, setFormErrors] = useState({});
   const [touched, setTouched] = useState({
        title: false,
        member: false
   });
   const theme=useSelector((state)=>state.setting.darkMode)
   const userId=useSelector((state)=>state.userProfile.id)
   const darkMode = useSelector((state) => state.setting.darkMode);
   const {t}=useTranslation()
   const selectRef = useRef();
   const [position, setPosition] = useState({ top: 0, left: 0 });
   const animatedComponents = makeAnimated();
   let param=useParams()
   const [checkViewerPermission, setCheckViewerPermission]=useState(true)
   const dispatch=useDispatch()
   const projects=useSelector(state=>state.projects.projects)
   const [projectDetail, setProjectDetail]=useState([])
   const [createProjectFormOpen, setCreateProjectFormOpen]=useState(false)
   const [projectFormOpen, setProjectFormOpen]=useState(null)
   const [optionFormOpen, setOptionFormOpen]=useState(null)
   const [editFormOpen, setEditFormOpen]=useState(null)
   const [deleteProject,setDeleteProject]=useState(false)
   const [error, setError]=useState(false)
   const [loading, setLoading]=useState(false)
   const [overlay, setOverlay]=useState(false)
   const [title, setTitle] = useState("");
   const [startDate, setStartDate] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [assignedUserId, setAssignedUserId] = useState([]);
   const [openDropdownId, setOpenDropdownId] = useState(null);
   const [projectId, setProjectId] = useState("");
   const [users, setUser]=useState([])
   const [userRole, setUserRole]=useState([])
   const [projectUsers, setProjectUser]=useState([])
   const [formattedUser, setFormatedUser]=useState([])
   const [formattedProjectUser, setFormatedProjectUser]=useState([])
   const [initialProjectUSer, setInitialProjectUser]=useState()
   const classes = ['sideBar'];
    if (isMobile) {
      classes.push('mobile'); // add mobile class
      if (isSideBarOpen) {
        classes.push('open');
      } else {
        classes.push('closed');
      }
    }
   const [isOpen, setIsOpen]=useState('unActive')
   const permission={admin:'Admin', editor:'Editor', viewer:'Viewer'}
   const navigate=useNavigate()

   const customStyles =(darkMode) =>({
      control: (base, state) => ({
        ...base,
        backgroundColor: darkMode ? '#1c2536' : '#fff',
        boxShadow: 'none',
        color: darkMode ? '#ddd' : '#000',
        border: darkMode?'1px solid rgb(29, 41, 57)': '1px solid rgb(228, 231, 236)',
        padding: '8px',
        fontSize: '12px',
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
        fontSize: '12px',
        cursor: 'pointer',
      }),
      multiValueLabel:(base)=>({
        ...base,
        color:`${darkMode?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}`

      }),
      multiValue:(base)=>({
        ...base,
        backgroundColor:'none'
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
    const handleCreateProjectSubmit = async(e)=>{
      e.preventDefault()
      try{
        const errors = {};

        if (!title.trim()) {
          errors.title = t("createProject.errorTitle");
        }
        if (projectUsers.length === 0) {
          errors.member = t("createProject.errorNoMember");
        } 
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          setTouched({
            title: true,
            member: true
          });
          return;
        }
        await task.createProject(title, assignedUserId)
        dispatch(fetchProjects())
        setProjectFormOpen(null)
        setCreateProjectFormOpen(null)
        setTitle("")
        setStartDate("")
        setDueDate("")
        setAssignedUserId([])
        selectRef.current.clearValue();
      } catch(error){
      }
    } 
   const handleProjectSubmit = async(e, id)=>{
      e.preventDefault()
      try{
        const errors = {};

        if (!title.trim()) {
          errors.title = t("createProject.errorTitle");
        }
        if (projectUsers.length === 0) {
          errors.member = t("createProject.errorNoMember");
        } 
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          return;
        }
        setProjectFormOpen(!projectFormOpen)
        setOverlay(id);
        setLoading(true);
        const result= await task.updateProject(
              {id:id,
               title:title,
               assignedUserId:assignedUserId,
               role:userRole,
              }
        )
        if(result){
            setTimeout(()=>{setLoading(false),setError(false),dispatch(fetchProjects())},1000 )
        }
      } catch(error){
        setTimeout(()=>{setOverlay(id),setLoading(false),setError(true)},1000 )
      }
   }
   const handleToggle = (e,id) => { //handle option form affected by overflow-y
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setOptionFormOpen(id)
   };
   const handleSelect = (selectedUsers) => {
      if(selectedUsers) {
          const assignedIds = selectedUsers.map((user) => user.value); // Chỉ lấy giá trị (ID)
          const userMap = new Map(users.map(user => [user.id, user]));
          const selected= assignedIds.map(id => userMap.get(id));
          setFormatedProjectUser(selectedUsers)
          setProjectUser(selected)
          const assignedWithRole = assignedIds.map(id => ({
            userId: id,
            role: 'admin',
          }));
          setAssignedUserId(assignedWithRole)
      } else {
          // Nếu không có user nào được chọn (selectedUsers = null khi xóa hết)
          setAssignedUserId([]);
      }
   }
   function handlePermission(projectId){
    for(let i=0; i<role.length; i++){
      if(role[i].projectId===projectId){
        if(role[i].role!=='admin'){
          setCheckViewerPermission(projectId)
          setOptionFormOpen(false)
        }
      }
    }
   }
   const handleSelectRole=(newIndex, newRole)=>{
      let updatedMembers=[...userRole]
      updatedMembers[newIndex]=newRole
      setUserRole(updatedMembers);
      let assignedWithRole = [...assignedUserId]
      assignedWithRole[newIndex].role=newRole
      setAssignedUserId(assignedWithRole)
   }
   const handleCreateProject=async()=>{
      const result = await task.getAllUser()
      setUser(result)
      const formatted =result.map(user => ({
        value: user.id, // Dùng ID làm giá trị
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color:`${theme?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}` }}>
              <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
              <span>{user.firstname} {user.lastname}</span>
            </div>
        )// Dùng username làm tên hiển thị
      }));
      setFormatedUser(formatted)
      setProjectUser([])
      setTitle("")
      setDueDate()
      setStartDate()

   }
   const handleEditProject= async (id)=>{
    try{
      const result = await task.getAllUser()
      const formatted =result.map(user => ({
        value: user.id, // Dùng ID làm giá trị
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color:`${theme?'rgb(229, 229, 229)':'rgb(29, 41, 57)'}` }}>
              <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="vinh" style={{ borderRadius: '50%', height:'32px ', width: '32px '}} />
              <span>{user.firstname} {user.lastname}</span>
            </div>
        )// Dùng username làm tên hiển thị
      }));
      const result2 = await task.getUserByProjectId(id)
      const role=result2.map(user=>user.role)
      const formattedProjectUser = result2.map(user =>
       formatted.find(u => u.value === user.id)
      ).filter(Boolean);
      // Loại bỏ phần tử undefined nếu không tìm thấy
      const result3=await task.getProjectById(id)
      setTitle(result3.title)
      setStartDate(result3.createdAt)
      setDueDate(result3.endedAt)
      setProjectUser(result2)
      setUser(result)
      setFormatedUser(formatted)
      const assignedIds = formattedProjectUser.map((user) => user.value);
      setAssignedUserId(assignedIds)
      setUserRole(role)
    } catch(error){
      setTimeout(()=>{setLoading(false),setError(true)},1000 )
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
   const handleDeleteProject=async(e, id)=>{
      try{
        setProjectFormOpen(!projectFormOpen)
        await task.deleteProject(id)
        dispatch(fetchProjects())
        dispatch(fetchProgress())
        dispatch(getAllTodayTask())
        dispatch(getAllUpcomingTask())
        navigate('/')
      } catch(error){
        setTimeout(()=>{setLoading(false),setError(true)},1000 )
      }
   }
   useEffect(() => {
      if (location.pathname.startsWith('/project')) {
        setIsOpen('active')
      }
    }, [location.pathname])
   useEffect(() => {
            if (projectUsers.length > 0 && users.length > 0) {
                const preselectedUsers = formattedUser.filter(option =>
                 projectUsers.some(user => user.id === option.value)
                );    
                setFormatedProjectUser(preselectedUsers);
            }
  }, [projectUsers, formattedUser, users]);
   
    useEffect(()=>{
          dispatch(fetchProjects())
    },[])
   return (
        <div className={classes.join(' ')}>
           <div className='brand'>
               <img src={app} style={{width:'48px', height:'48px'}}></img>
               <h3>TASK</h3>
           </div>
           <div className='menu'>
               <div onClick={()=>{navigate('/'), onClose()}} className={`menuItem ${isActive('/')?'active':''}`}>
                  <div>
                     <LayoutDashboard></LayoutDashboard>
                     {t('sideBar.dashboard')}
                  </div>
               </div>
               <div  className={`menuItem ${isActive('/project')?'active':''}`} onClick={()=>isOpen==='unActive'?setIsOpen('active'):setIsOpen('unActive')}>
                  <div style={{justifyContent:'space-between', alignItems:'center'}}>
                     <div style={{padding:'0', display:'flex', alignItems:'center', gap:'1rem'}}>
                        <FolderGit2></FolderGit2>
                        {t('sideBar.project')}
                     </div>
                     <div style={{display:'flex', gap:'1rem',alignItems:'baseline'}}>
                      <div onClick={(e)=>{handleCreateProject(),setCreateProjectFormOpen(true), setProjectFormOpen(true) ,e.stopPropagation()}}>
                        <Plus style={{justifySelf:'end',height:'16px', width:'16px'}}></Plus>
                      </div>
                      <ChevronDown style={{justifySelf:'end',height:'16px', width:'16px'}}></ChevronDown>
                     </div>
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
                             <div key={project.id} style={{position:'relative'}} className={isSubActive(`/project/${project.id}`)|| isSubActive(`/project/${project.id}/list`)? 'sub-active' : ''} 
                             onClick={(e)=>{e.stopPropagation(), setOptionFormOpen(null), navigate( `/project/${project.id}`), onClose()}}
                             >
                                 <div style={{display:'flex', alignItems:'center', width:'100%', justifyContent:'space-between'}}>
                                  <li>{project.title}</li>
                                  <Ellipsis className="ellipsis"
                                            style={{paddingRight: '1rem', height:32, width:32}}
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setOptionFormOpen(project.id)
                                              handleToggle(e,project.id)
                                              handlePermission(project.id)
                                            }}
                                  ></Ellipsis>
                                 </div>
                                 {optionFormOpen&&(<RenderDropdown
                                    isOpen={optionFormOpen === project.id}
                                    onClose={() => setOptionFormOpen(null)}
                                    position={position}
                                    onEdit={() => {
                                      setProjectFormOpen(project.id);
                                      setEditFormOpen(project.id);
                                      handleEditProject(project.id);
                                    }}
                                    onDelete={() => {
                                      setProjectFormOpen(project.id);
                                      setDeleteProject(true);
                                      setOptionFormOpen(null);
                                    }}
                                 >
                                 </RenderDropdown>)}
                                 <div className={`overlay-${checkViewerPermission!==project.id?'unActive':'active'}`} onClick={(e)=>e.stopPropagation()}>
                                    <div className='fail'style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                      <div className='close-button' onClick={(e)=>{e.stopPropagation(),setCheckViewerPermission(true)}}><X style={{height:14, width:14}}></X></div>
                                      <p>{t('sideBar.noPermission')}</p>
                                    </div>
                                 </div>
                                 <div className={`overlay-${overlay===project.id?'active':'unActive'}`}>
                                    {loading?(
                                        <div className={`overlay-${loading?'active':'unActive'}`}>
                                            <div style={{display:'flex',justifyContent:'center',alignItems:'center', gap: '.5rem', width:'20%', backgroundColor:'white', padding:'.5rem', borderRadius:'.5rem'}}>
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
                                                <p style={{fontWeight:500, color:'black'}}>{t('taskDetail.wait')}</p>
                                            </div>
                                        </div>
                                    ):(
                                        error?(
                                                <div className='fail'style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                                    <div className='close-button' onClick={()=>{setOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                                    <p style={{fontWeight:500}}>{t('sideBar.fail')}</p>
                                                    <p style={{fontSize:12}}>{t('sideBar.failMessage')}</p>
                                                </div>
                                        ):(
                                                <div className='success' style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                                    <div className='close-button' onClick={()=>{setOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                                    <p style={{fontWeight:500}}>{t('sideBar.success')}</p>
                                                </div>
                                        )
                                    )}
                                  </div>
                                 <div className={`overlay-${projectFormOpen===project.id?'active':'unActive'}`} onClick={(e)=>e.stopPropagation()} >
                                    {deleteProject?(
                                      <div className='delete-warning'>
                                        <h2>{t('taskDetail.confirm')}</h2>
                                        <span>{t('sideBar.message')}</span>
                                        <div className='delete-warning-footer'>
                                            <div className='edit' onClick={()=>{setProjectFormOpen(null),setDeleteProject(null)}}>
                                                <p>{t('taskDetail.Cancel')}</p>
                                            </div>
                                            <div className='delete' onClick={(e)=>{handleDeleteProject(e, project.id),setOverlay(project.id), setLoading(true)}}>
                                                <Trash2 color='white'></Trash2>
                                                <p style={{color:'white'}}>{t("taskDetail.delete")}</p>
                                            </div>
                                        </div>
                                      </div>
                                    ):(
                                      <form className={`projectForm-${editFormOpen===project.id?'active':'unActive'}`}
                                            onSubmit={async(e)=>{handleProjectSubmit(e, project.id)
                                            }}
                                      >
                                            <div className='close-button' onClick={(e)=>{e.stopPropagation(),setFormErrors({}),setDueDate(null), setStartDate(null),setEditFormOpen(null), setProjectFormOpen(null), setTitle(''),setFormatedProjectUser([])}}><X></X></div>
                                            <h3>{t('editProject.head')}</h3>
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
                                              <small>{title.length}/20</small>
                                            </div>
                                            {formErrors.title && <p className="error">{formErrors.title}</p>}
                                            <div className='select'>
                                              <Select
                                                closeMenuOnSelect={false}
                                                components={animatedComponents}
                                                isMulti
                                                ref={selectRef}
                                                value={formattedProjectUser}
                                                styles={getCustomStyle}
                                                options={formattedUser}
                                                onChange={(selectedOptions) => {
                                                  handleSelect(selectedOptions);

                                                  // Ẩn lỗi khi có dữ liệu
                                                  if (selectedOptions.length > 0) {
                                                    setFormErrors(prev => ({ ...prev, member: null }));
                                                  }
                                                }}
                                                onBlur={() => {
                                                  setTouched(prev => ({ ...prev, member: true }));

                                                  if (formattedProjectUser.length === 0) {
                                                    setFormErrors(prev => ({
                                                      ...prev,
                                                      member: t("createProject.errorNoMember")
                                                    }));
                                                  }
                                                }}
                                              />
                                              {touched.member && formErrors.member && (
                                                <p className="error">{formErrors.member}</p>
                                              )}                                            
                                            </div>
                                            <div className='member'>
                                                <div>
                                                    {projectUsers.length>0?projectUsers.map((user, index)=>
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
                                                            <div style={{display:'flex',gap:16, alignItems:'center'}}>
                                                              <select id="select" value={userRole[index]}  onChange={(e)=>handleSelectRole(index, e.target.value)} style={{borderRadius:'.5rem', padding:4}}>
                                                                <option value="admin">Admin</option>
                                                                <option value="editor">Editor</option>
                                                                <option value="viewer">Viewer</option>
                                                              </select>
                                                              <X style={{height:'16px', width:'16px'}} onClick={()=>handleRemoveUser(user.id)}></X>
                                                            </div>

                                                        </div>
                                                    ):(<span style={{marginTop:'1rem', display:'block', textAlign:'center'}}>{t('createProject.noMember')}</span>)}
                                                </div>
                                            </div>
                                            <button>{t('taskDetail.save')}</button>
                                      </form>
                                    )}
                                  </div>
                             </div>
                           )}
                           </ul>
                        </motion.div>
                     )}
                  </AnimatePresence>
                
               </div>
               <div onClick={()=>{navigate('/setting'), onClose()}} className={`menuItem ${isActive('/setting')?'active':''}`}>
                  <div>
                     <Settings></Settings>
                     {t('sideBar.setting')}
                  </div>
               </div>
              <div className={`overlay-${createProjectFormOpen?'active':'unActive'}`}>
                                <form className={`projectForm-${projectFormOpen?'active':'unActive'}`} onSubmit={handleCreateProjectSubmit}>
                                    <div className='close-button' onClick={()=>{setProjectFormOpen(!projectFormOpen), setTitle('') ,setFormErrors({}),setCreateProjectFormOpen(false),setFormatedProjectUser([])}}><X></X></div>
                                    <h3>{t('createProject.head')}</h3>
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
                                      <small>{title.length}/20</small>
                                    </div>  
                                    {(touched.title || formErrors.title) && (
                                      <p className="error">{formErrors.title}</p>
                                    )}                                     
                                    <div className='select'>
                                      <Select
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        ref={selectRef}
                                        value={formattedProjectUser}
                                        styles={getCustomStyle}
                                        options={formattedUser}
                                        onChange={(selectedOptions) => {
                                          handleSelect(selectedOptions);

                                          // Ẩn lỗi khi có dữ liệu
                                          if (selectedOptions.length > 0) {
                                            setFormErrors(prev => ({ ...prev, member: null }));
                                          }
                                        }}
                                        onBlur={() => {
                                          setTouched(prev => ({ ...prev, member: true }));

                                          if (formattedProjectUser.length === 0) {
                                            setFormErrors(prev => ({
                                              ...prev,
                                              member: t("createProject.errorNoMember")
                                            }));
                                          }
                                        }}
                                      />
                                      {touched.member && formErrors.member && (
                                        <p className="error">{formErrors.member}</p>
                                      )}                                            
                                    </div>
                                    <div className='member'>
                                        <div>
                                            {projectUsers.length>0?projectUsers.map((user, index)=>
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
                                                  <div style={{display:'flex',gap:16, alignItems:'center'}}>
                                                    <select id="select" onChange={(e)=>handleSelectRole(index, e.target.value)} style={{borderRadius:'.5rem', padding:4}}>
                                                      <option value="admin">Admin</option>
                                                      <option value="editor">Editor</option>
                                                      <option value="viewer">Viewer</option>
                                                    </select>
                                                    <X style={{height:'16px', width:'16px'}} onClick={()=>handleRemoveUser(user.id)}></X>
                                                  </div>
                                               </div>
                                            ):(<span style={{marginTop:'1rem', display:'block', textAlign:'center'}}>{t('createProject.noMember')}</span>)}
                                        </div>
                                    </div>
                                    <button>{t('createProject.head')}</button>
                                </form>
                </div>
           </div>
        </div>
   )
}