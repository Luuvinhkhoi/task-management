import './header.css'
import { useEffect, useState, useRef } from 'react'
import task from '../../../util/task'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getProfile } from '../../../store/userProfile'
import { AnimatePresence, motion} from 'framer-motion'
import { CircleUser, UserPen, LogOut } from 'lucide-react'
export const Header=()=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [OpenDropdown, setOpenDropDown]=useState(false)
    const userName=useSelector((state)=>state.userProfile.userName)
    const profileRef = useRef(null);
    const dropdownRef = useRef(null);
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
    return (
        <div className='header'>
            <div className='searchBar'>
                <input placeholder='Search here'></input>
            </div>
            {userName?
             <div style={{display:'inline-block'}}>
                <div className='profile'  ref={profileRef}  onClick={()=>setOpenDropDown(!OpenDropdown)}>
                  <CircleUser></CircleUser>
                  <p>Welcome <span>{userName}</span></p>
                </div>
                <AnimatePresence>
                    {OpenDropdown==true &&(
                        <motion.div 
                            ref={dropdownRef} 
                           initial={{ height: 0, opacity: 0 }} 
                           animate={{ height: "auto", opacity: 1 }} 
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.3, ease: "easeOut" }}
                           className='profileDropdrown'
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