import './profile.css'
import { Pen, PenLine } from 'lucide-react'
export const Profile=()=>{
    return (
        <div className='profile'>
            <h3>Profile</h3>
            <div>
                <div className='profileHeader'>
                    <div>
                        <div>
                            <img src='qềubiqf'></img>
                        </div>
                        <p>Lưu Vĩnh Khôi</p>
                    </div>
                    <div>
                        <PenLine></PenLine>
                        <p>Edit</p>
                    </div>
                </div>
                <div className='profileBody'>
                    <div>
                        <h3>Personal Information</h3>
                        <div>
                            <div className='name'>
                                <div>
                                    <p>First Name</p>
                                    <h5>Vĩnh Khôi</h5>
                                </div>
                                <div>
                                    <p>Last Name</p>
                                    <h5>Lưu</h5>
                                </div>
                            </div>
                            <div className='email-phone'>
                                <div style={{gap:'unset'}}>
                                    <p>Email address</p>
                                    <h5>khoi@gmail.com</h5>
                                </div>
                                <div>
                                    <p>Phone</p>
                                    <h5>0708109245</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{gap:'1rem', justifyContent:'unset', display:'flex'}}>
                        <PenLine></PenLine>
                        <p>Edit</p>
                    </div>
                </div>
            </div>
        </div>
    )
}