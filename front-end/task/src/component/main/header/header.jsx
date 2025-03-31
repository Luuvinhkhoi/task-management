import './header.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getProfile } from '../../../store/userProfile'
export const Header=()=>{
    const dispatch=useDispatch()
    const userName=useSelector((state)=>state.userProfile.userName)
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
    return (
        <div className='header'>
            <div className='searchBar'>
                <input placeholder='Search here'></input>
            </div>
            {userName?
              <div className='profile'>
                  <p>Welcome <span>{userName}</span></p>
              </div>
             :
             <div>
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