import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAllSetting } from '../../../store/setting'
import './sign-in.css'
import task from '../../../util/task'
import { ChevronLeft } from 'lucide-react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
export const SignIn = ()=>{
    const [emailState, setEmailState]=useState('')
    const [passwordState, setPasswordState]=useState('')    
    const [error, setError] = useState("");
    const location=useLocation()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    function handleEmailInput(e){
        setEmailState(prev=>prev=e.target.value)    
    }
    function handlePasswordInput(e){
        setPasswordState(prev=>prev=e.target.value)    
    }
    async function handleLogin(){
        const result= await task.signIn(emailState, passwordState)
        if (!result){
            setError("Invalid credential");
        } else{
            setError("");
            dispatch(getAllSetting())
            navigate(location.state?.previousUrl || '/')
        }
    }
    function handleSubmit(e) {
        e.preventDefault(); // Ngăn trang bị reload
        handleLogin(); // Gọi hàm đăng ký
    }
    return (
        <form onSubmit={handleSubmit} className="login">
            <div className='login-box'>
                <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}} onClick={()=>navigate('/')}>
                    <ChevronLeft></ChevronLeft>
                    <p>Back to dashboard</p>
                </div>
                <div className="login-box-row-1">
                    <span>Sign In</span>
                    <p>Enter your email and password to sign in</p>
                </div>
                <div className='login-box-row-2'>
                        <h3>Email</h3>
                        <div className='login-email-input'>
                            <input type='email' placeholder='Type your email here' onChange={handleEmailInput}></input>
                        </div>
                        <h3>Password</h3>
                        <div className='login-password-input'>
                            <input type='password' placeholder='Type your password here' onChange={handlePasswordInput}></input>
                        </div>
                        <div className='login-button'>
                            <button>Sign In</button>
                        </div>
                        {error && <div style={{ color: "red", fontFamily:'Roboto' }}>{error}</div>}
                </div>
                <div className='sign-up-link'>
                    <span>Not a member yet?</span>
                    <Link to={'/sign-up'}>Sign up</Link>
                </div>
            </div>    
        </form>
    )
}