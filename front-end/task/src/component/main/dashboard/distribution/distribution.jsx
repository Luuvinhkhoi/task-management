import './distribution.css';
import {useState, useEffect} from 'react';
import task from '../../../../util/task';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Label,Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Giả lập các ngày có task và trạng thái
export const Distribution = ({tasks}) => {
  const {t}=useTranslation()
  const theme=useSelector((state)=>state.setting.darkMode)

  const getStatusCounts = (data) => {
    const counts = data.reduce((acc, { status }) => {
      const key = status;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || '#ccc',
    }));
  };
  const COLORS = {
    'To do': '#6399fd',         // xanh dương nhạt
    'In progress': 'rgba(243, 175, 115, 0.8)',   // xanh dương
    'Complete': '#32d583',      // xanh lá
  };
  const chartData = getStatusCounts(tasks);
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
  useEffect(()=>{
    async function getTask(){
      try{
        const result=await task.getAllTaskForUser()
        if(result){
            setTask(result)
        }
      } catch(error){
          console.log(error)
      }
    }
    getTask()
  },[])
  return(
    <div id='distribution'>
       <h3 style={{textAlign:'start'}}>{t('dashboard.statusOverview')}</h3>
       <ResponsiveContainer width="100%" height='100%' maxHeight='300px'>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            label={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}       
            <Label
              value={`Total: ${tasks.length}`}
              position="center"
              style={{ fontSize: '16px', fontWeight: 'bold', fill:`${theme?'white':'black'}` }}
            />
          </Pie>
          <Tooltip
            contentStyle={{
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#333',
            }}
            itemStyle={{
              padding: 0,
              margin: 0,
            }}
            formatter={(value, name) => [`${value}`, `${name}`]}
          />          

          <Legend 
            
          />        
        </PieChart>
       </ResponsiveContainer>
    </div>
  )
};
