import './header.css'
import { useEffect, useState, useRef } from 'react'
import task from '../../../util/task'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import notFound from '../../../assets/notFound.png'
import { useAuth } from '../../../authContext'
import makeAnimated from 'react-select/animated';
import { getProfile } from '../../../store/userProfile'
import { AnimatePresence, motion} from 'framer-motion'
import { useTranslation } from "react-i18next";
import { useTimezone } from '../../../timezoneContext'
import app from '../../../assets/app.png'
import { TaskDetail } from '../taskDetail/taskDetail'
import { Notification } from './noti/noti'
import { useSocket } from '../../../../socketContext'
import { CircleUser, UserPen, LogOut, FolderOpenDot, ClipboardCheck,Bell, Dot, AlignJustify, } from 'lucide-react'
export const Header=({role, onToggleSidebar, onClose})=>{
    const dispatch=useDispatch()
    const socket = useSocket();
    const navigate=useNavigate()
    const { t } = useTranslation();
    const [isClick, setIsClick]=useState(null)
    const [OpenDropdown, setOpenDropDown]=useState(false)
    const [openNotification, setOpenNotification]=useState(false)
    const [openSearchBar, setOpenSearchBar]=useState(false)
    const [timeoutId, setTimeoutId] = useState(null);
    const [results, setResults]=useState([])
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString]=useState('')    
    const [taskDetailMembers, setTaskDetailMember]=useState([])
    const [formattedUsers, setFormatedUser]=useState([])
    const [assignedUserId, setAssignedUserId] = useState([]);
    const [users, setUser]=useState([])//list of user
    const [view, setView]=useState(true)
    const { user, signOut } = useAuth();
    const userName=useSelector((state)=>state.userProfile.firstname)
    const profileRef = useRef(null);
    const dropdownRef = useRef(null);
    const toogleRef=useRef(null)
    const notiRef=useRef(null)
    const notiDropRef=useRef(null)
    const searchBarRef=useRef(null)
    const searchBarPCRef = useRef(null);
    const searchBarMobileRef = useRef(null);
    const [openSearchBarPC, setOpenSearchBarPC] = useState(false);
    const [openSearchBarMobile, setOpenSearchBarMobile] = useState(false);

    const dropsearchRef=useRef(null)
    const { timezone } = useTimezone();
    const [date, setDate] = useState(new Date());
    const [noti, setNoti]=useState([])
    const [projectRole, setProjectRole]=useState()
    useEffect(()=>{
        if (!socket) return;
        socket.on('notification', (data) => {
            setView(false)
            setNoti(prev=>[data,...prev])
        });
    }, [socket])
    useEffect(() => {
      const interval = setInterval(() => {
        setDate(new Date());
      }, 60000); // cập nhật mỗi giây
  
      return () => clearInterval(interval);
    }, []);
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
    async function getRole(projectId){
        try{
            const result=role.find(item=>item.projectId===projectId)
            setProjectRole(result.role)
        }catch(error){
            console.log(error)
        }
    }
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
    async function handleSearchBarPcActive(event){
        const name=searchString
        const result = await task.search(new URLSearchParams({name}).toString())
        setResults(result)
        setLoading(true)
        setOpenSearchBarPC(!openSearchBarPC)
    }
    async function handleSearchBarMobileActive(event){
        const name=searchString
        const result = await task.search(new URLSearchParams({name}).toString())
        setResults(result)
        setLoading(true)
        setOpenSearchBarMobile(!openSearchBarMobile)
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
    useEffect(() => {
            if (taskDetailMembers.length > 0 && users.length > 0) {
              const preselectedUsers = formattedUsers.filter(option =>
                taskDetailMembers.some(user => user.id === option.value)
              );
    
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
        if (notiDropRef.current) {
            notiDropRef.current.style.width = `450px`;
        }
    }, [openNotification]);
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
              onClose();
            };
            window.addEventListener("scroll", handleScroll);
            const handleClickOutside = (event) => {
                const clickedToggle = toogleRef.current?.contains(event.target);
                const clickSideBar=event.target.closest('.sideBar.mobile.open')
                const clickedEllipsis = event.target.closest('.ellipsis'); // class cho Ellipsis
                const clickedRenderDropdown = event.target.closest('.render-dropdown'); // nếu có dropdown
                const clickClose=event.target.closest('.option-active')
                if (!clickedToggle &&!clickSideBar&&!clickClose&& !clickedEllipsis && !clickedRenderDropdown) {
                    onClose(); // chỉ đóng sidebar khi click ngoài hết các vùng liên quan
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
              setOpenNotification(false)
            };
            window.addEventListener("scroll", handleScroll);
            const handleClickOutside = (event) => {
                if (notiRef.current && !notiRef.current.contains(event.target)) {
                  setOpenNotification(false)
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
            if (searchBarPCRef.current && !searchBarPCRef.current.contains(event.target)) {
                setOpenSearchBarPC(false);
            }
            if (searchBarMobileRef.current && !searchBarMobileRef.current.contains(event.target)) {
                setOpenSearchBarMobile(false);
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
    return (
        <div className='header'>
            <div className='header-pc'>
                <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                    <div ref={toogleRef} onClick={onToggleSidebar}>
                        <AlignJustify className='toggle-button' ></AlignJustify>
                    </div>
                    <div className='brand'>
                        <img src={app} style={{width:'32px', height:'32px'}}></img>
                        <h3>TASK</h3>
                    </div>
                    <div className='searchBar'  ref={searchBarPCRef}>
                        <input placeholder='Search here'  onClick={handleSearchBarPcActive}  value={searchString} onChange={handleInputChange}></input>
                        <AnimatePresence>
                            {openSearchBarPC===true &&(
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
                                            <p style={{display:'inline-block'}}>{t('searchBar.noData')}</p>
                                        </div>
                                    ):(
                                        <div>
                                            {results.project.length>=1?(
                                                <div>
                                                    <div style={{display:'flex',gap:'.5rem', marginBottom:'.5rem'}} >
                                                        <FolderOpenDot style={{color:' rgb(59, 130, 246)'}}></FolderOpenDot>
                                                        <p style={{fontWeight:500}}>{t(`sideBar.project`)}</p>
                                                    </div>
                                                    {results.project?results.project.map(item=>
                                                        <div key={item.id} style={{marginBottom:'.5rem', marginLeft:'1rem', cursor:'pointer'}} onClick={()=>navigate(`/project/${item.id}`)}>
                                                            <p style={{fontWeight:'600', fontSize:'15px'}}>{item.title}</p>
                                                            <p style={{fontSize:'12px'}}>{t(`project.Member`)}: <span>{item.memberCount}</span></p>
                                                        </div>
                                                    ):null}
                                                </div>
                                            ):null}
                                            {results.task.length>=1?(
                                                <div >
                                                <div style={{display:'flex',gap:'.5rem', marginBottom:'.5rem'}} >
                                                    <ClipboardCheck style={{color:' rgb(59, 130, 246)'}}></ClipboardCheck>
                                                    <p style={{fontWeight:500}}>{t('project.Task')}</p>
                                                </div>
                                                {results.task?results.task.map(item=>
                                                    <div key={item.id} style={{marginBottom:'.5rem', marginLeft:'1rem', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(),setIsClick(item.id), getRole(item.project_id)}}>
                                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                                            <p style={{fontWeight:'600', fontSize:'15px'}}>{item.title}</p>
                                                            <div className={`priority-${item.priority.toLowerCase()}`} style={{marginBottom:4}}>{t(`list.priority.${item.priority}`)}</div>
                                                        </div>
                                                        <div style={{display:'flex', gap:'.5rem', fontSize:'12px'}}>{t(`task.dueDate`)}: <div>
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
                            role={projectRole}
                            overlayId={isClick} 
                            setOverlayId={setIsClick} 
                            taskId={isClick} 
                            socket={socket}
                            projectId={results.task.find(item => item.id === isClick)?.project_id}
                        />
                    )} 
                </div> 
                {/*{userName?*/}
                <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <div style={{display:'flex', gap:'1rem'}}>
                        <div>{dayFormat}</div>
                        <div>{timeFormat}</div>
                    </div>
                    <div style={{position:'relative'}}>
                        <div className='noti' ref={notiRef} onClick={()=>{setOpenNotification(!openNotification), setView(true)}}>
                            <Bell>
                            </Bell>
                            {view?(<div></div>):(<div style={{position:'absolute', bottom:'18px', left:'-10px', backgroundColor:'orange',height:'10px', width:'10px', borderRadius:'1rem' }}></div>)}
                        </div>
                        <AnimatePresence>
                                {openNotification==true&&(
                                    <motion.div 
                                    ref={notiDropRef} 
                                    initial={{opacity: 0 }} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    animate={{  opacity: 1 }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className='notiDropDown'
                                    >
                                        <Notification socket={socket} noti={noti} setNoti={setNoti} setIsClick={setIsClick} isClick={isClick}></Notification>
                                    </motion.div>
                                )}
                        </AnimatePresence>
                    </div>
                    <div style={{display:'inline-block'}}>
                        <div className='profileHeader' style={{cursor:'pointer'}} ref={profileRef}  onClick={()=>setOpenDropDown(!OpenDropdown)}>
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
                                        <p>{t('header.Edit profile')}</p>
                                    </div>
                                    <div style={{display:'flex',gap:'.5rem', cursor:'pointer'}} onClick={signOut}>
                                        <LogOut></LogOut>
                                        <p>{t('header.Log out')}</p>
                                    </div>
                                </motion.div>
            
                            )
                            }
                        </AnimatePresence>
                    </div>
                </div>
                {/*:
                <div id='authOption'>
                    <div className='sign-in'>
                        <Link to='/sign-in'  className='sign-in-anchor'>Sign in</Link>
                    </div>
                    <div className='sign-up'>
                        <Link to='/sign-up' className='sign-up-button'>Create account</Link>
                    </div>
                </div> 
                }*/}
            </div>
            <div className='searchBar-mobile' ref={searchBarMobileRef}>
                        <input placeholder='Search here'  onClick={handleSearchBarMobileActive}  value={searchString} onChange={handleInputChange}></input>
                        <AnimatePresence>
                            {openSearchBarMobile===true &&(
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
                                            <p style={{display:'inline-block'}}>{t('searchBar.noData')}</p>
                                        </div>
                                    ):(
                                        <div>
                                            {results.project.length>=1?(
                                                <div>
                                                    <div style={{display:'flex',gap:'.5rem', marginBottom:'.5rem'}} >
                                                        <FolderOpenDot style={{color:' rgb(59, 130, 246)'}}></FolderOpenDot>
                                                        <p style={{fontWeight:500}}>{t(`sideBar.project`)}</p>
                                                    </div>
                                                    {results.project?results.project.map(item=>
                                                        <div key={item.id} style={{marginBottom:'.5rem', marginLeft:'1rem', cursor:'pointer'}} onClick={()=>navigate(`/project/${item.id}`)}>
                                                            <p style={{fontWeight:'600', fontSize:'15px'}}>{item.title}</p>
                                                            <p style={{fontSize:'12px'}}>{t(`project.Member`)}: <span>{item.memberCount}</span></p>
                                                        </div>
                                                    ):null}
                                                </div>
                                            ):null}
                                            {results.task.length>=1?(
                                                <div >
                                                <div style={{display:'flex',gap:'.5rem', marginBottom:'.5rem'}} >
                                                    <ClipboardCheck style={{color:' rgb(59, 130, 246)'}}></ClipboardCheck>
                                                    <p style={{fontWeight:500}}>{t(`project.Task`)}</p>
                                                </div>
                                                {results.task?results.task.map(item=>
                                                    <div key={item.id} style={{marginBottom:'.5rem', marginLeft:'1rem', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(),setIsClick(item.id), getRole(item.project_id)}}>
                                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                                            <p style={{fontWeight:'600', fontSize:'15px'}}>{item.title}</p>
                                                            <div className={`priority-${item.priority.toLowerCase()}`} style={{marginBottom:4}}>{t(`list.priority.${item.priority}`)}</div>
                                                        </div>
                                                        <div style={{display:'flex', gap:'.5rem', fontSize:'12px'}}>{t(`task.dueDate`)}: <div>
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
                            role={projectRole}
                            overlayId={isClick} 
                            setOverlayId={setIsClick} 
                            taskId={isClick} 
                            socket={socket}
                            projectId={results.task.find(item => item.id === isClick)?.project_id}
                        />
                    )} 
        </div>
    )
}