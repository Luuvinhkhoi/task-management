import { useState } from 'react'
import './sign-up.css'
import task from '../../../util/task'
import { ChevronLeft } from 'lucide-react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
export const SignUp = ()=>{
    const [userNameState, setUserNameState]=useState('')
    const [emailState, setEmailState]=useState('')
    const [passwordState, setPasswordState]=useState('')    
    const [error, setError] = useState("");
    const location=useLocation()
    const navigate=useNavigate()
    function handleUserNameInput(e){
        setUserNameState(prev=>prev=e.target.value)   
    }
    function handleEmailInput(e){
        setEmailState(prev=>prev=e.target.value)    
    }
    function handlePasswordInput(e){
        setPasswordState(prev=>prev=e.target.value)    
    }
    async function handleSignUp(){
        const result= await task.signUp(emailState, passwordState, userNameState)
        if (!result){
            setError("Invalid credential");
        } else{
            setError("");
            navigate(location.state?.previousUrl || '/')
        }
    }
    function handleSubmit(e) {
        e.preventDefault(); // Ngăn trang bị reload
        handleSignUp(); // Gọi hàm đăng ký
    }
    return (
        <form onSubmit={handleSubmit} className="sign-up">
            <div className='sign-up-box'>
                <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}} onClick={()=>navigate('/')}>
                    <ChevronLeft></ChevronLeft>
                    <p>Back to dashboard</p>
                </div>
                <div className="sign-up-box-row-1">
                    <span>Sign Up</span>
                    <p>Enter your email, username and password to sign up</p>
                </div>
                <div className='sign-up-box-row-2'>
                        <h3>Email</h3>
                        <div className='sign-up-email-input'>
                            <input type='email' placeholder='Type your email here' onChange={handleEmailInput}></input>
                        </div>
                        <h3>Username</h3>
                        <div className='sign-up-user-name-input'> 
                            <input placeholder='Type your user name here' onChange={handleUserNameInput} required minLength={2} maxLength={30}></input>
                        </div>
                        <h3>Password</h3>
                        <div className='sign-up-password-input'>
                            <input type='password' placeholder='Type your password here' onChange={handlePasswordInput}></input>
                        </div>
                        <div className='sign-up-button'>
                            <button>Sign Up</button>
                        </div>
                        {error && <div style={{ color: "red", fontFamily:'Roboto' }}>{error}</div>}
                </div>
                <div className='sign-up-link'>
                    <span>Already have an account?</span>
                    <Link to={'/sign-in'}>Sign in</Link>
                </div>
            </div>    
        </form>
    )
}