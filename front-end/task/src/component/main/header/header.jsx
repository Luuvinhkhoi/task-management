import './header.css'
import { useEffect, useState, useRef } from 'react'
import task from '../../../util/task'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import notFound from '../../../assets/notFound.png'
import { Link } from 'react-router-dom'
import {X} from 'lucide-react'
import { Download, Paperclip, Trash2, FilePenLine } from 'lucide-react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { getProfile } from '../../../store/userProfile'
import { AnimatePresence, motion} from 'framer-motion'
import { useTranslation } from "react-i18next";
import { useTimezone } from '../../../timezoneContext'
import { Comment } from '../project/comment/comment';
import { TaskDetail } from '../taskDetail/taskDetail'
import { CircleUser, UserPen, LogOut, FolderOpenDot, ClipboardCheck,Bell } from 'lucide-react'
export const Header=({socket})=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const theme=useSelector((state)=>state.setting.darkMode)
    const { t } = useTranslation();
    const animatedComponents = makeAnimated();
    const [isClick, setIsClick]=useState(null)
    const [OpenDropdown, setOpenDropDown]=useState(false)
    const [openSearchBar, setOpenSearchBar]=useState(false)
    const [timeoutId, setTimeoutId] = useState(null);
    const [results, setResults]=useState([])
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString]=useState('')
    const [taskDetail, setTaskDetail]=useState()
    const [dueDate, setDueDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState();
    const [priority, setPriority] = useState();
    const [title, setTitle] = useState("");
    const [overlay, setOverlay]=useState(false)
    const [taskDetailMembers, setTaskDetailMember]=useState([])
    const [taskDetailOpen, setTaskDetailOpen]=useState(false) 
    const [isOpenTab, setIsOpenTab] = useState('Detail');
    const [isSelecting, setIsSelecting] = useState(false);
    const [attachmentId, setAttachmentId]=useState()
    const [attachmentUrl, setAttachmentUrl]=useState()
    const [formattedUsers, setFormatedUser]=useState([])
    const [assignedUserId, setAssignedUserId] = useState([]);
    const [users, setUser]=useState([])//list of user
    const [deleteAttachment, setDeleteAttachment]=useState(false)
    const userName=useSelector((state)=>state.userProfile.firstname)
    const profileRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchBarRef=useRef(null)
    const dropsearchRef=useRef(null)
    const { timezone } = useTimezone();
    const [date, setDate] = useState(new Date());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDate(new Date());
      }, 60000); // cập nhật mỗi giây
  
      return () => clearInterval(interval);
    }, []);
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
    const dayFormat = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timezone,
    }).format(date);
  
    const timeFormat = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(date);
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
    async function handleLogout(){
        try{
            const response = await task.logOut()
            dispatch(getProfile())
            if (response.message==='Logout sucess') {
                navigate('/sign-in');  // Redirect đến trang login sử dụng React Router
            } else {
                console.error('Logout failed');
            }
        } catch(error) {
            console.log(error);
        };
    }
    async function search(parameter){
        const name=parameter
        const result = await task.search(new URLSearchParams({name}).toString())
        setResults(result)
        setLoading(false)
    }
    async function handleActive(event){
        const name=searchString
        const result = await task.search(new URLSearchParams({name}).toString())
        setResults(result)
        setLoading(true)
        setOpenSearchBar(true)
    }
    function handleInputChange(event) {
        const newQuery = event.target.value;
        setSearchString(newQuery)
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            search(newQuery);
            setOpenSearchBar(true)
        }, 500);
        setTimeoutId(id);
    }
    async function getTaskDetail(task_id){
        try{
            const result=await task.getTaskDetail(task_id)
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
    async function getAllUser(id){
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
    const handleSaveEdit=async(e, taskId, id)=>{
            try{
                const formattedUsersId=assignedUserId.map(user=>user.value)
                console.log(formattedUsersId)
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
            }catch(error){
                console.log(error)
            }
    }
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
                    const result=await task.deleteAttachment(key, id)
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
    useEffect(() => {
            if (taskDetailMembers.length > 0 && users.length > 0) {
              const preselectedUsers = formattedUsers.filter(option =>
                taskDetailMembers.some(user => user.id === option.value)
              );
              console.log('❌ selectedUsers is null or empty');
    
              setAssignedUserId(preselectedUsers);
            }
    }, [taskDetailMembers, formattedUsers]);
    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
                dispatch(getProfile());    
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
           
        fetchUserProfile();
       
    },[])
    useEffect(() => {
        if (profileRef.current && dropdownRef.current) {
            dropdownRef.current.style.width = `${profileRef.current.clientWidth}px`;
        }
    }, [OpenDropdown]);
    useEffect(() => {
        if (searchBarRef.current && dropsearchRef.current) {
            dropsearchRef.current.style.width = `${searchBarRef.current.clientWidth}px`;
        }
    }, [openSearchBar]);
    useEffect(() => {
            const handleScroll = () => {
              setOpenDropDown(false);
            };
            window.addEventListener("scroll", handleScroll);
            const handleClickOutside = (event) => {
                if (profileRef.current && !profileRef.current.contains(event.target)) {
                  setOpenDropDown(false); // Đóng thanh tìm kiếm
                }
            };
          
            document.addEventListener("mousedown", handleClickOutside);
    
            return () => {
              document.removeEventListener("mousedown", handleClickOutside);
              window.removeEventListener("scroll", handleScroll);
            };
    }, []);
    useEffect(() => {
        const handleScroll = () => {
          setOpenSearchBar(false);
        };
        window.addEventListener("scroll", handleScroll);
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
              setOpenSearchBar(false); // Đóng thanh tìm kiếm
            }
        };
      
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    useEffect(() => {
        return () => {
          if (timeoutId) clearTimeout(timeoutId);
        };
      }, [timeoutId]);
    console.log(openSearchBar)
    return (
        <div className='header'>
            <div className='searchBar' onClick={handleActive} ref={searchBarRef}>
                <input placeholder='Search here' value={searchString} onChange={handleInputChange}></input>
                <AnimatePresence>
                    {openSearchBar===true &&(
                        <motion.div 
                            ref={dropsearchRef} 
                           initial={{ height: 0, opacity: 0 }} 
                           animate={{ height: "auto", opacity: 1 }} 
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.3, ease: "easeOut" }}
                           className='searchDropDown'
                        >
                            {results.project.length<1 && results.task.length<1?(
                                <div style={{display:'flex', alignContent:'center', flexDirection:'column', flexWrap:'wrap'}}>
                                    <img src={notFound} style={{height:'64px', width:'64px', margin:'0 auto'}}></img>
                                    <p style={{display:'inline-block'}}>We couldn't find anything</p>
                                </div>
                            ):(
                                <div>
                                    {results.project.length>=1?(
                                        <div>
                                            <div style={{display:'flex',gap:'.5rem', marginBottom:'.5rem'}} >
                                                <FolderOpenDot style={{color:' rgb(59, 130, 246)'}}></FolderOpenDot>
                                                <p>Project</p>
                                            </div>
                                            {results.project?results.project.map(item=>
                                                <div key={item.id} style={{marginBottom:'.5rem', marginLeft:'1rem', cursor:'pointer'}} onClick={()=>navigate(`/project/${item.id}`)}>
                                                    <p style={{fontWeight:'600', fontSize:'16px'}}>{item.title}</p>
                                                    <p style={{fontSize:'12px'}}>Member: <span>{item.memberCount}</span></p>
                                                </div>
                                            ):null}
                                        </div>
                                    ):null}
                                    {results.task.length>=1?(
                                        <div >
                                        <div style={{display:'flex',gap:'.5rem', marginBottom:'.5rem'}} >
                                            <ClipboardCheck style={{color:' rgb(59, 130, 246)'}}></ClipboardCheck>
                                            <p>Task</p>
                                        </div>
                                        {results.task?results.task.map(item=>
                                            <div style={{marginBottom:'.5rem', marginLeft:'1rem', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(),setIsClick(item.id)}}>
                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                    <p style={{fontWeight:'600', fontSize:'16px'}}>{item.title}</p>
                                                    <div className={`priority-${item.priority.toLowerCase()}`}>{item.priority}</div>
                                                </div>
                                                <div style={{display:'flex', gap:'.5rem', fontSize:'12px'}}>Due date: <div>
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
                                        ):null}
                                    </div>
                                    ):null}
                                </div>
                            )}
                        </motion.div>
    
                    )
                    }
                </AnimatePresence>
            </div>
            {isClick !== null && results.task && (
                <TaskDetail 
                    overlayId={isClick} 
                    setOverlayId={setIsClick} 
                    taskId={isClick} 
                    
                    projectId={results.task.find(item => item.id === isClick)?.project_id}
                />
            )}  
            <div style={{display:'flex', gap:'1rem'}}>
                <div>{dayFormat}</div>
                <div>{timeFormat}</div>
            </div>
            {userName?
             <div>
                <Bell></Bell>
                <div style={{display:'inline-block'}}>
                    <div className='profile' style={{cursor:'pointer'}} ref={profileRef}  onClick={()=>setOpenDropDown(!OpenDropdown)}>
                        <CircleUser></CircleUser>
                        <p>{t(`header.Welcome`)} <span>{userName}</span></p>
                    </div>
                    <AnimatePresence>
                        {OpenDropdown==true &&(
                            <motion.div 
                                ref={dropdownRef} 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className='profileDropDown'
                            >
                                <div style={{display:'flex',gap:'.5rem', cursor:'pointer'}} onClick={()=>navigate('/profile')}>
                                    <UserPen></UserPen>
                                    <p>Edit profile</p>
                                </div>
                                <div style={{display:'flex',gap:'.5rem', cursor:'pointer'}} onClick={()=>handleLogout()}>
                                    <LogOut></LogOut>
                                    <p>Log out</p>
                                </div>
                            </motion.div>
        
                        )
                        }
                    </AnimatePresence>
                </div>
             </div>
             :
             <div id='authOption'>
                <div className='sign-in'>
                    <Link to='/sign-in'  className='sign-in-anchor'>Sign in</Link>
                </div>
                <div className='sign-up'>
                    <Link to='/sign-up' className='sign-up-button'>Create account</Link>
                </div>
             </div> 
            }
        </div>
    )
}