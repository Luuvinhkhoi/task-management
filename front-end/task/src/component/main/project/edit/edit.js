import './edit.css'
export const EditTask=()=>{
    const taskDetail=[]
    return(
        <div className={`overlay-${taskDetailOpen?'active':'unActive'}`}>
                {taskDetail?taskDetail.map(item=>
                    <div className={`taskDetail-${taskDetailOpen?'active':'unActive'}`}>
                        <div className='close-button' onClick={()=>{setTaskDetailOpen(!taskDetailOpen)}}><X></X></div>
                        <div className='status-priority' style={{width: '200px'}}>
                            <div className={`priority-${item.priority.toLowerCase()}`}>{t(`list.priority.${item.priority}`)}</div>
                            <div className={`status-${item.status.toLowerCase().replace(/\s/g, '')}`}>{t(`list.${item.status}`)}</div>
                        </div>
                        <h2>
                            {item.title}
                        </h2>
                        <div style={{fontSize:'14px', display:'flex', gap:'1rem', color:'rgb(107, 114, 128)'}}>
                            <div style={{display:'flex', gap:'.5rem'}}>Start date: <div>
                                    {new Intl.DateTimeFormat('en-CA', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      timeZone: timezone,
                                    }).format(new Date(item.createdAt))}
                                 </div>
                                 <div>
                                    {new Intl.DateTimeFormat('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: timezone,
                                    }).format(new Date(item.createdAt))}
                                 </div>
                            </div>

                            <div style={{display:'flex', gap:'.5rem'}}>Due date: <div>
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
                        <div className="taskHeader" style={{width:'165px'}}>
                            {tabs.map(tab => (
                            <div
                                key={tab.value}
                                className={`tabItem ${isOpenTab === tab.value ? 'active' : ''}`}
                                onClick={() => setIsOpenTab(tab.value)}
                            >
                                {tab.label}
                            </div>
                            ))}
                        </div>
                        <div className='taskDetail-body'>
                            <div className='body-item'>
                                <h4>Description</h4>
                                <div>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                            <div className='body-item'>
                                <h4>Assign</h4>
                                <div>
                                    {item.users.map(user=>
                                        <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
                                            <img src={user.avatar?user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{width:'32px', height:'32px', borderRadius:'10rem'}}></img>
                                            <div>
                                                <span>{user.firstname}</span>
                                                <span> </span>
                                                <span>{user.lastname}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='body-item' style={{border:`${theme?'1px solid rgb(29, 41, 57)':'1px solid rgb(229, 229, 229)'}`, borderRadius:'1rem', maxHeight:'200px', overflowY:'scroll'}}>
                                <div style={{display:'flex', gap:'1rem'}}>
                                    <h4 style={{paddingRight:'1rem',borderRight:`${theme?'2px solid rgb(29, 41, 57)':'2px solid rgb(229, 229, 229)'}`}}>Attachment</h4>
                                    <div style={{color:'#007bff', fontWeight:'600'}}  onClick={handleUploadClick}>
                                        <input type='file' ref={fileInputRef} 
                                        onChange={(e)=>handleFileChange(e, item.id)} 
                                        style={{ display: 'none' }}></input>Upload</div>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                                {item.attachment.map((file, index) => {
                                    const isGoogleDrive = file.url.includes("drive.google.com");
                                    const isPdf = file.url.endsWith(".pdf");
                                    const isDoc = file.url.endsWith(".docx");
                                    const isExcel=file.url.endsWith('.xlsx')
                                    return (
                                        <div key={index} className="attachment-box">
                                        <div style={{ display: 'flex', alignItems:'center', gap: '8px' }}>
                                            {isGoogleDrive ? (
                                            <FaGoogleDrive size={24} />
                                            ) : isPdf ? (
                                            <img src={pdf} style={{height:'32px', width:'28px'}} />
                                            ) : isDoc ? (
                                            <img src={word} style={{height:'24px', width:'24px'}} />
                                            ): isExcel?(
                                                <img src={excel} style={{height:'24px', width:'24px'}} />
                                            ):(
                                                <Paperclip style={{height:'24px', width:'24px', color:'rgb(107, 114, 128)'}} />  
                                            )}

                                            <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                                            <p style={{fontSize:'14px'}}>{file.url.split('/').pop().replace(/^\d+-/, '')}</p>
                                            <div style={{display:'flex', gap:'1rem'}}>
                                                <div onClick={()=>handleDownload(file.url)}>
                                                    <Download style={{color:'#007bff'}} />
                                                </div>
                                                <div onClick={()=>handleDelete(file.url, file.id)}>
                                                    <Trash2 style={{color:'#dc2626'}}></Trash2>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                
                        </div>
                        <div className='taskDetail-footer'>
                                <div className='edit'>
                                   <FilePenLine></FilePenLine>
                                   <p>Edit</p>
                                </div>
                                <div className='delete'>
                                    <Trash2 color='white'></Trash2>
                                    <p style={{color:'white'}}>Delete</p>
                                </div>
                        </div>
                    </div>
                ):<div>Loading</div>
                }
        </div>
    )
}