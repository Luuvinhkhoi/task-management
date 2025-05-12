import './header.css'
import { useEffect, useState, useRef } from 'react'
import task from '../../../util/task'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import notFound from '../../../assets/notFound.png'
import { Link } from 'react-router-dom'
import { getProfile } from '../../../store/userProfile'
import { AnimatePresence, motion} from 'framer-motion'
import { useTranslation } from "react-i18next";
import { useTimezone } from '../../../timezoneContext'
import { CircleUser, UserPen, LogOut, FolderOpenDot, ClipboardCheck } from 'lucide-react'
export const Header=()=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const { t } = useTranslation();
    const [OpenDropdown, setOpenDropDown]=useState(false)
    const [openSearchBar, setOpenSearchBar]=useState(false)
    const [timeoutId, setTimeoutId] = useState(null);
    const [results, setResults]=useState([])
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString]=useState('')
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
  
    async function handleLogout(){
        try{
            const response = await task.logOut()
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
    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
                await dispatch(getProfile());    
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
    console.log(searchString)
    return (
        <div className='header'>
            <div className='searchBar' onClick={handleActive} ref={searchBarRef}>
                <input placeholder='Search here' value={searchString} onChange={handleInputChange}></input>
                <AnimatePresence>
                    {openSearchBar==true &&(
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
                                                <div style={{marginBottom:'.5rem', marginLeft:'1rem'}}>
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
                                            <div style={{marginBottom:'.5rem', marginLeft:'1rem'}}>
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
            <div style={{display:'flex', gap:'1rem'}}>
                <div>{dayFormat}</div>
                <div>{timeFormat}</div>
            </div>
            {userName?
             <div style={{display:'inline-block'}}>
                <div className='profile'  ref={profileRef}  onClick={()=>setOpenDropDown(!OpenDropdown)}>
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
                            <div style={{display:'flex',gap:'.5rem'}} onClick={()=>navigate('/profile')}>
                                <UserPen></UserPen>
                                <p>Edit profile</p>
                            </div>
                            <div style={{display:'flex',gap:'.5rem'}} onClick={()=>handleLogout()}>
                                <LogOut></LogOut>
                                <p>Log out</p>
                            </div>
                        </motion.div>
    
                    )
                    }
                </AnimatePresence>
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