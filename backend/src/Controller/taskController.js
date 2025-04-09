const service=require('../Services/taskService')
const createTask= async(req, res)=>{
  try{
     const {title, description,status, priority ,assignedUserId,projectId,startDate, dueDate}=req.body
     console.log(req.body)
     const startTimestamp = new Date(startDate).toISOString(); 
     const endTimestamp = new Date(dueDate).toISOString();
     console.log(startTimestamp)
     console.log(endTimestamp)
     if (!startDate || !dueDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(dueDate).getTime())) {
        return res.status(400).json({error: "Invalid date format"});
     }
     const task= await service.createTask(title, description, status, priority,assignedUserId, projectId  ,startTimestamp, endTimestamp)
     res.status(201).json(task)
  } catch(error){
     res.status(500).json({error: error.message})
  }
}
const getAllTask=async(req, res)=>{
   try{
      const result1=await service.getAllTaskByProjectId(req.params.project_id)
      const result2= await Promise.all(
         result1.map(item => service.getTaskMember(item.id))
     );
     console.log(result2)
     res.status(200).json({tasks:result1, members:result2})
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const updateTaskStatus=async(req, res)=>{
   try{
      const {task}=req.body
      console.log(task)
      const result= await Promise.all(
         task.map(item => service.updateTaskStatus(item.id, item.status))
     );
      res.status(201).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const getTodayTask=async(req, res)=>{
   try{
      const result= await service.getTodayTask(req.user.id)
      res.status(201).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}

module.exports={
    createTask, 
    getAllTask, 
    updateTaskStatus,
    getTodayTask
}