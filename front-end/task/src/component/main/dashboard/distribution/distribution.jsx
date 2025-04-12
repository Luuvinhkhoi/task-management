import './distribution.css';
import {useState, useEffect} from 'react';
import task from '../../../../util/task';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// Giả lập các ngày có task và trạng thái
export const Distribution = () => {
  const [tasks, setTask]=useState([])
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
  console.log(tasks)
  return(
    <div id='distribution'>
       <h3 style={{textAlign:'start'}}>Task Distribution</h3>
       <div >
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
          Total: {total}
        </div>
      </div>
    </div>
  )
};
