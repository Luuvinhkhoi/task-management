import './profile.css'
import { useState } from 'react'
import { PenLine, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import task from '../../../util/task'
export const Profile=()=>{
    const [selectedFile, setSelectedFile] = useState(null);
    const [editProfileFormOpen, setEditProfileFormOpen]=useState(false)
    const firstname=useSelector((state)=>state.userProfile.firstname)
    const lastname=useSelector((state)=>state.userProfile.lastname)
    const email=useSelector((state)=>state.userProfile.email)
    const phone=useSelector((state)=>state.userProfile.phone)
    const avatar=useSelector(state=>state.userProfile.avatar)
    function handleFormSubmit(){

    }
    
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
  
    const handleSetAva = async (event) => {
      event.preventDefault();
  
      if (!selectedFile) return;
  
      try {
        await task.uploadAvatar(selectedFile);
        alert("Upload thành công!");
      } catch (error) {
        alert(`Có lỗi xảy ra khi upload. ${error}`);
      }
    };
    return (
        <div className='profile'>
            <h3>Profile</h3>
            <div>
                <div className='profileHeader'>
                    <div>
                        <div className='avatar'>
                            <img src={avatar}></img>
                        </div>
                        <p>{lastname} {firstname}</p>
                    </div>
                    <div onClick={()=>setEditProfileFormOpen(!editProfileFormOpen)}>
                        <PenLine></PenLine>
                        <p>Edit</p>
                    </div>
                    <div className={`overlay-${editProfileFormOpen?'active':'unActive'}`}>
                        <form className={`avaForm-${editProfileFormOpen?'active':'unActive'}`} onSubmit={handleSetAva}>
                            <div className='close-button' onClick={()=>{setEditProfileFormOpen(!editProfileFormOpen)}}><X></X></div>
                            <div style={{height:'200px', width:'200px', margin:'0 auto', borderRadius:'10rem', overflow:'hidden'}}>
                                <img src='https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1743831298~exp=1743834898~hmac=cd90ff8bc1e6ddac16918645916dff150ad605d18c6fdb41f00b9b6f4d9e2a89&w=826'></img>
                            </div>
                            <div className='avaInput'>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                </div>
                <div className='profileBody'>
                    <div>
                        <h3>Personal Information</h3>
                        <div>
                            <div className='name'>
                                <div>
                                    <p>First Name</p>
                                    <h5>{firstname}</h5>
                                </div>
                                <div>
                                    <p>Last Name</p>
                                    <h5>{lastname}</h5>
                                </div>
                            </div>
                            <div className='email-phone'>
                                <div style={{gap:'unset'}}>
                                    <p>Email address</p>
                                    <h5>{email}</h5>
                                </div>
                                <div>
                                    <p>Phone</p>
                                    <h5>{phone}</h5>
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