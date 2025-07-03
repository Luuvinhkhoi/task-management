import { useEffect, useState } from 'react'
import './noti.css'
import task from '../../../../util/task'
import { MessageCircleWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTimezone } from '../../../../timezoneContext';
import { TaskDetail } from '../../taskDetail/taskDetail'
export const Notification=({socket,noti, setNoti, isClick, setIsClick})=>{
    const[isLoading,setIsLoading]=useState(true)
    const { timezone } = useTimezone();
    const { t } = useTranslation();
    async function getAllNoti(){
        const result=await task.getAllNoti()
        if(result){
            setNoti(result)
        }
        setIsLoading(false)
    }
    const [groupedNoti, setGroupedNoti] = useState([])

    useEffect(() => {
      const grouped = groupNotiByTask(noti)
      setGroupedNoti(grouped)
    }, [noti])

    const toggleExpand = (taskId) => {
      setGroupedNoti(prev =>
        prev.map(item =>
          item.taskId === taskId
            ? { ...item, isExpanded: !item.isExpanded }
            : item
        )
      )
    }
    useEffect(()=>{
      getAllNoti()
    },[])
    const handleClick=async(id)=>{
        try{
          const data={notiId:id}
          await task.updateNoti(data)
          getAllNoti()
        } catch(error){
          console.log(error)
        }
    }
    function groupNotiByTask(notiArray) {
      const taskMap = {}

      for (const noti of notiArray) {
        const taskId = noti.taskId
        if (!taskMap[taskId]) {
          taskMap[taskId] = []
        }
        taskMap[taskId].push(noti)
      }
      const grouped = Object.entries(taskMap).map(([taskId, notifications]) => {
      const sorted = notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )

      return {
        id: sorted[0].id,
        taskId,
        projectId: sorted[0].projectId,
        latestNoti: sorted[0],
        others: sorted.slice(1),
        isExpanded: false
      }
    })

// 🔥 Sắp xếp các nhóm theo createdAt của latestNoti
    grouped.sort((a, b) => new Date(b.latestNoti.createdAt) - new Date(a.latestNoti.createdAt))
      return grouped
    }
    return (
      <div className='notification'>
        {noti.length>0?(
            <>
            {groupedNoti.map(item => (
            <div key={item.taskId} className="noti-group" onClick={(e) => {
              e.stopPropagation()
              setIsClick(item.taskId)
            }}>
              <div className="noti-header">
                {item.latestNoti.isRead?(
                  <div style={{ display: 'flex', gap: '.5rem',alignItems:'center' ,marginBottom:'1rem' }}>
                    <img src={item.latestNoti.user.avatar?item.latestNoti.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:'1rem', width:'100%', fontWeight:500, fontSize:14}}>
                      <p style={{textOverflow: 'ellipsis',  overflow: 'hidden',display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',}}>{item.latestNoti.user.lastname} {item.latestNoti.user.firstname} {t(`notification.${item.latestNoti.message}`)}</p>
                      <div style={{ fontSize: 12, minWidth:'85px', display:'flex', gap:4, alignItems:'center' }}>
                        {new Intl.DateTimeFormat('en-CA', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          timeZone: timezone,
                        }).format(new Date(item.latestNoti.createdAt))}
                        <div style={{height:6, width:6 , borderRadius:'10rem'}}></div>

                      </div>

                    </div>
                  </div>
                ):(
                  <div style={{ display: 'flex', gap: '.5rem',alignItems:'center' ,marginBottom:'1rem' }} onClick={()=>handleClick(item.id)}>
                    <img src={item.latestNoti.user.avatar?item.latestNoti.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:'1rem', width:'100%', fontWeight:500, fontSize:14}}>
                      <p style={{textOverflow: 'ellipsis',  overflow: 'hidden',display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',}}>{item.latestNoti.user.lastname} {item.latestNoti.user.firstname} {t(`notification.${item.latestNoti.message}`)}</p>
                      <div style={{ fontSize: 12, minWidth:'85px', display:'flex', gap:4, alignItems:'center' }}>
                        {new Intl.DateTimeFormat('en-CA', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          timeZone: timezone,
                        }).format(new Date(item.latestNoti.createdAt))}
                        <div style={{height:6, width:6 ,backgroundColor:'#007bff', borderRadius:'10rem'}}></div>
                      </div>


                    </div>
                  </div>
                )}
                {item.isExpanded && (
                <div className="noti-expanded" style={{ marginLeft: 20, marginTop: 10 }}>
                  {item.others.map((sub, index) => (
                    sub.isRead?(
                      <div key={index} style={{ marginBottom: 16 , display:'flex', gap: 0}} >
                        <img src={sub.user.avatar?sub.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 5 }} />
                        <div style={{display:'flex',fontSize:14, fontWeight:500, justifyContent:'space-between',alignItems:'center', width:'100%'}}>
                          <p style={{textOverflow: 'ellipsis',  overflow: 'hidden',display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',}}>{sub.user.lastname} {sub.user.firstname} {t(`notification.${sub.message}`)}</p>
                          <div style={{display:'flex', gap:0, alignItems:'center'}}>
                            <div style={{ fontSize: 12 , minWidth:'85px'}}> {new Intl.DateTimeFormat('en-CA', {
                                              year: 'numeric',
                                              month: '2-digit',
                                              day: '2-digit',
                                              timeZone: timezone,
                            }).format(new Date(sub.createdAt))}
                            </div>
                            <div style={{height:6, width:6 , borderRadius:'10rem'}}></div>

                          </div>
                        </div>
                      </div>
                    ):(
                      <div key={index} style={{ marginBottom: 16 , display:'flex', gap: 0}} onClick={()=>handleClick(sub.id)}>
                        <img src={sub.user.avatar?sub.user.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 5 }} />
                        <div style={{display:'flex',alignItems:'center',fontSize:14, fontWeight:500, justifyContent:'space-between', width:'100%'}}>
                          <p style={{textOverflow: 'ellipsis',  overflow: 'hidden',display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',}}>{sub.user.lastname} {sub.user.firstname} {t(`notification.${sub.message}`)}</p>
                          <div style={{display:'flex', gap:0, alignItems:'center'}}>
                            <div style={{ fontSize: 12 , minWidth:'85px'}}> {new Intl.DateTimeFormat('en-CA', {
                                              year: 'numeric',
                                              month: '2-digit',
                                              day: '2-digit',
                                              timeZone: timezone,
                            }).format(new Date(sub.createdAt))}
                            </div>
                            <div style={{height:6, width:6 ,backgroundColor:'#007bff', borderRadius:'10rem'}}></div>

                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                )}
                {item.others.length > 0 && (
                  <div style={{display:'inline-block', marginLeft:'1rem'}}>
                    <button style={{fontSize:'12px'}} onClick={(e) => { e.stopPropagation(); toggleExpand(item.taskId) }}>
                    {item.isExpanded ? 'Hide updates' : `+${item.others.length} updates`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isClick !== null && noti.length>0 && (
                  <TaskDetail 
                      socket={socket}
                      overlayId={isClick} 
                      setOverlayId={setIsClick} 
                      taskId={isClick} 
                      projectId={noti.find(item => item.taskId === isClick)?.projectId}
                  />
          )}
          </>
        ):(
          <div style={{alignItems:'center', height:'100%'}}>
            <MessageCircleWarning color='rgb(172, 172, 172)'  height={50} width={50}></MessageCircleWarning>
            <div>{t(`notification.noData`)} </div>
          </div>
        )}
      </div>
    )

}