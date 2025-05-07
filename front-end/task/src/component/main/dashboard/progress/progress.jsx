import task from '../../../../util/task'
import './progress.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
export const Progress = ()=>{
  const [progress, setProgress]=useState([])
  const {t}=useTranslation()
  /*useEffect(()=>{
     const fetchProgress=async ()=>{
       try{
        const result=await task.getProjectProgress()
        setProgress(result)
       }catch(error){
        console.log(error)
       }
     }
     fetchProgress()
  }, [])*/
  return (
    <div id='progress'>
      <h3 style={{textAlign:'start'}}>{t('dashboard.progress')}</h3>
      {progress.length > 2?progress.map(item=>
        <div className='progressItem'>
          <h4>{item.projectName}</h4>
          <div>
            <div className='progressBar'>
              <div style={{width:`${item.totalTask === 0 ? '0%' : (item.completeTask / item.totalTask) * 100 + '%'}`}}></div>
            </div>
            <div>{item.totalTask === 0 ? '0%' : (item.completeTask / item.totalTask) * 100 + '%'}</div>
          </div>
        </div>
      ):null}
    </div>
  )
}