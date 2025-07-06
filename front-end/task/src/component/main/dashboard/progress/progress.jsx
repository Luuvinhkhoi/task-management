import task from '../../../../util/task'
import './progress.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
export const Progress = ({progress})=>{
  const {t}=useTranslation()
  return (
    <div id='progress'>
      <h3 style={{textAlign:'start'}}>{t('dashboard.progress')}</h3>
      {progress.length > 0?progress.map(item=>
        <div key={item.projectId} className='progressItem'>
          <h4>{item.projectName}</h4>
          <div>
            <div className='progressBar'>
              <div style={{width:`${item.totalTask === 0 ? '0%' : (item.completeTask / item.totalTask) * 100 + '%'}`}}></div>
            </div>
            <div>{item.totalTask === 0 ? '0%' : Math.round((item.completeTask / item.totalTask) * 100) + '%'}</div>
          </div>
        </div>
      ):<div>
          <p>{t('dashboard.noProgress')}</p>
        </div>}
    </div>
  )
}