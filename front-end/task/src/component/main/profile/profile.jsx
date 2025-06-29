import './profile.css'
import { useState, useEffect } from 'react'
import { PenLine, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import {motion} from 'framer-motion'
import {Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import task from '../../../util/task'
import { getProfile } from '../../../store/userProfile'
export const Profile=()=>{
    const dispatch=useDispatch()
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading]=useState(false)
    const [editProfileFormOpen, setEditProfileFormOpen]=useState(false)
    const [editAvaFormOpen, setEditAvaFormOpen]=useState(false)
    const firstname=useSelector((state)=>state.userProfile.firstname)
    const lastname=useSelector((state)=>state.userProfile.lastname)
    const email=useSelector((state)=>state.userProfile.email)
    const phone=useSelector((state)=>state.userProfile.phone)
    const avatar=useSelector(state=>state.userProfile.avatar)
    const {t}=useTranslation()
    const [error, setError]=useState(false)
    const [uploadAvatar, setUploadAvatar]=useState(avatar)
    const [firstNameChange, setFirstNameChange]=useState(firstname)
    const [phoneNumberChange, setPhoneNumberChange]=useState(phone)
    const [lastNameChange, setLastNameChange]=useState(lastname)
    const [notiOverlay, setNotiOverlay]=useState(false)
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
        setLoading(true)
        try{
            if (firstNameChange.length>0 && lastNameChange.length>0){
                const updateData={firstname:firstNameChange, lastname:lastNameChange, phonenumber:phoneNumberChange}
                setEditProfileFormOpen(false)
                const result=await task.updateProfile(updateData)   
                if (result){
                    setTimeout(()=>{setLoading(false)},1000 )
                    setError(false)
                    setNotiOverlay(true)
                }
                dispatch(getProfile())
            } else{
                alert(`Firstname or Lastname can't be empty`)
            }
        } catch(error){
            setError(true)
            setNotiOverlay(true)
            setLoading(false)
        }
    }
    
    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
        setSelectedFile(file);
        const reader = new FileReader()
        reader.onload = (e) => {
            setUploadAvatar(e.target?.result)
        }
        reader.readAsDataURL(file)
        }
    }
  
    const handleSetAva = async (event) => {
      event.preventDefault();
      setLoading(true)
      if (!selectedFile) return;
      try {
        setEditAvaFormOpen(false)
        await task.uploadAvatar(selectedFile);
        setLoading(false)
        dispatch(getProfile())
      } catch (error) {
        setLoading(false)
        alert(`Có lỗi xảy ra khi upload. ${error}`);
      }
    };
    return (
        <div className='profile'>
            <h3>{t('profile.profile')}</h3>
            <div className={`overlay-${loading?'active':'unActive'}`}>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center', gap: '.5rem', width:200, backgroundColor:'white', padding:'.5rem', borderRadius:'.5rem'}}>
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ 
                            duration: 1, 
                            repeat: Infinity, 
                            ease: "linear",
                            repeatType: "loop" // Quan trọng!
                        }}
                        style={{
                            width: "24px",
                            height: "24px",
                            transformOrigin: "12px 12px" // Chỉ định chính xác tâm
                        }}
                    >
                        <Loader2 style={{color:' #007bff'}} />
                    </motion.div>
                    <p style={{fontWeight:500, color:'black'}}>{t('taskDetail.wait')}</p>
                </div>
            </div>
            <div className={`overlay-${notiOverlay?'active':'unActive'}`}>
                    {error?(
                                <div className='fail'style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                    <div className='close-button' onClick={()=>{setNotiOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                    <p style={{fontWeight:500}}>{t('profile.updateFail')}</p>
                                    <p style={{fontSize:12}}>{t('profile.failMessage')}</p>
                                </div>
                            )
                    :(
                                <div className='success' style={{ padding:'.5rem', borderRadius:'.5rem'}}>
                                    <div className='close-button' onClick={()=>{setNotiOverlay(false)}}><X style={{height:12, width:12}}></X></div>
                                    <p style={{fontWeight:500}}>{t('profile.updateSuccess')}</p>
                                </div>
                    )}
            </div>
            <div style={{height:'100%', overflow:'auto'}}>
                <div className='profileHeader'>
                    <div>
                        <div className='avatar'>
                            <img src={avatar?avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'}></img>
                        </div>
                        <p>{lastname} {firstname}</p>
                    </div>
                    <div onClick={()=>setEditAvaFormOpen(!editProfileFormOpen)}>
                        <PenLine></PenLine>
                        <p>{t('profile.edit')}</p>
                    </div>
                    <div className={`overlay-${editAvaFormOpen?'active':'unActive'}`}>
                        <form className={`avaForm-${editAvaFormOpen?'active':'unActive'}`} onSubmit={handleSetAva}>
                            <div className='close-button' onClick={()=>{setEditAvaFormOpen(!editAvaFormOpen), setUploadAvatar(avatar)}}><X></X></div>
                            <div style={{height:'200px', width:'200px', margin:'0 auto', borderRadius:'10rem', overflow:'hidden'}}>
                                <img src={uploadAvatar?uploadAvatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'}></img>
                            </div>
                           <div className="avaInput">
                                <input
                                id="fileUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }} // Ẩn input mặc định
                                />
                            </div>
                            <div style={{display: 'flex', gap:'1rem', alignItems:'center', justifyContent:'center'}}>
                                <label style={{backgroundColor:'#007bff', padding:'.7rem', borderRadius:'.5rem'}} htmlFor="fileUpload" className="custom-upload-button">
                                    {t('profile.choose')}
                                </label>
                                <button  type="submit">{t('taskDetail.upload')}</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='profileBody'>
                    <div>
                        <h3>{t('profile.personal')}</h3>
                        <div>
                            <div className='name'>
                                <div>
                                    <p>{t('profile.firstname')}</p>
                                    <h5>{firstname}</h5>
                                </div>
                                <div>
                                    <p>{t('profile.lastname')}</p>
                                    <h5>{lastname}</h5>
                                </div>
                            </div>
                            <div className='email-phone'>
                                <div style={{gap:'unset'}}>
                                    <p>{t('profile.email')}</p>
                                    <h5>{email}</h5>
                                </div>
                                <div>
                                    <p>{t('profile.phone')}</p>
                                    <h5>{phone}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`overlay-${editProfileFormOpen?'active':'unActive'}`}>
                        <form className={`avaForm-${editProfileFormOpen?'active':'unActive'}`} onSubmit={handleEditProfileFormSubmit}>
                            <div className='close-button' onClick={()=>{setEditProfileFormOpen(!editProfileFormOpen)}}><X></X></div>
                            <h3>{t('profile.form')}</h3>
                            <div>
                                <div>
                                    <div className='name'>
                                        <div>
                                            <p>{t('profile.firstname')}</p>
                                            <div><input placeholder={firstname} onChange={handleFirstNameChange}></input></div>
                                        </div>
                                        <div>
                                            <p>{t('profile.lastname')}</p>
                                            <div><input placeholder={lastname} onChange={handleLastNameChange}></input></div>
                                        </div>
                                    </div>
                                    <div className='email-phone'>
                                        <div style={{gap:'unset'}}>
                                            <p>{t('profile.email')}</p>
                                            <div><input placeholder={email} readOnly style={{cursor: 'not-allowed'}}></input></div>
                                        </div>
                                        <div>
                                            <p>{t('profile.phone')}</p>
                                            <div><input placeholder={phone} onChange={handlePhoneNumberChange}></input></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button style={{backgroundColor:"rgb(0, 123, 255)", color:'#fff'}} type="submit">{t('taskDetail.upload')}</button>
                        </form>
                    </div>
                    <div style={{gap:'1rem', justifyContent:'unset', display:'flex'}} onClick={()=>setEditProfileFormOpen(!editProfileFormOpen)}>
                        <PenLine></PenLine>
                        <p>{t('profile.edit')}</p>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}