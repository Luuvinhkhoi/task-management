import './profile.css'
import { useState, useEffect } from 'react'
import { PenLine, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import task from '../../../util/task'
export const Profile=()=>{
    const [selectedFile, setSelectedFile] = useState(null);
    const [editProfileFormOpen, setEditProfileFormOpen]=useState(false)
    const [editAvaFormOpen, setEditAvaFormOpen]=useState(false)
    const firstname=useSelector((state)=>state.userProfile.firstname)
    const lastname=useSelector((state)=>state.userProfile.lastname)
    const email=useSelector((state)=>state.userProfile.email)
    const phone=useSelector((state)=>state.userProfile.phone)
    const avatar=useSelector(state=>state.userProfile.avatar)
    const [firstNameChange, setFirstNameChange]=useState(firstname)
    const [phoneNumberChange, setPhoneNumberChange]=useState(phone)
    const [lastNameChange, setLastNameChange]=useState(lastname)
    function handleFirstNameChange(e){
        setFirstNameChange(e.target.value)
    }
    function handleLastNameChange(e){
        setLastNameChange(e.target.value)
    }
    function handlePhoneNumberChange(e){
        setPhoneNumberChange(e.target.value)
    }
    useEffect(()=>{
            setFirstNameChange(firstname)
    }, [firstname])
    useEffect(()=>{
        setLastNameChange(lastname)
    }, [firstname])
    useEffect(()=>{
            setPhoneNumberChange(phone)
    }, [phone])
    
    async function handleEditProfileFormSubmit(e){
        e.preventDefault()
        try{
            const updateData={firstname:firstNameChange, lastname:lastNameChange, phonenumber:phoneNumberChange}
            await task.updateProfile(updateData)   
        } catch(error){
            console.log(error)
        }
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
                    <div onClick={()=>setEditAvaFormOpen(!editProfileFormOpen)}>
                        <PenLine></PenLine>
                        <p>Edit</p>
                    </div>
                    <div className={`overlay-${editAvaFormOpen?'active':'unActive'}`}>
                        <form className={`avaForm-${editAvaFormOpen?'active':'unActive'}`} onSubmit={handleSetAva}>
                            <div className='close-button' onClick={()=>{setEditAvaFormOpen(!editAvaFormOpen)}}><X></X></div>
                            <div style={{height:'200px', width:'200px', margin:'0 auto', borderRadius:'10rem', overflow:'hidden'}}>
                                <img src={avatar}></img>
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
                    <div className={`overlay-${editProfileFormOpen?'active':'unActive'}`}>
                        <form className={`avaForm-${editProfileFormOpen?'active':'unActive'}`} onSubmit={handleEditProfileFormSubmit}>
                            <div className='close-button' onClick={()=>{setEditProfileFormOpen(!editProfileFormOpen)}}><X></X></div>
                            <h3>Edit Personal Information</h3>
                            <div>
                                <div>
                                    <div className='name'>
                                        <div>
                                            <p>First Name</p>
                                            <div><input placeholder={firstname} onChange={handleFirstNameChange}></input></div>
                                        </div>
                                        <div>
                                            <p>Last Name</p>
                                            <div><input placeholder={lastname} onChange={handleLastNameChange}></input></div>
                                        </div>
                                    </div>
                                    <div className='email-phone'>
                                        <div style={{gap:'unset'}}>
                                            <p>Email address</p>
                                            <div><input placeholder={email} readOnly style={{cursor: 'not-allowed'}}></input></div>
                                        </div>
                                        <div>
                                            <p>Phone</p>
                                            <div><input placeholder={phone} onChange={handlePhoneNumberChange}></input></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                    <div style={{gap:'1rem', justifyContent:'unset', display:'flex'}} onClick={()=>setEditProfileFormOpen(!editProfileFormOpen)}>
                        <PenLine></PenLine>
                        <p>Edit</p>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}