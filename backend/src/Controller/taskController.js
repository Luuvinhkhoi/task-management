const service=require('../Services/taskService')
const createTask= async(req, res)=>{
  try{
     const {title, description,status, priority ,assignedUserId,projectId,startDate, dueDate}=req.body
     const startTimestamp = new Date(startDate).toISOString(); 
     const endTimestamp = new Date(dueDate).toISOString();
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
     res.status(200).json({tasks:result1, members:result2})
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const updateTaskStatus=async(req, res)=>{
   try{
      const {task}=req.body
      const result= await Promise.all(
         task.map(item => service.updateTaskStatus(item.id, item.status))
     );
      res.status(200).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const getTodayTask=async(req, res)=>{
   try{
      const result= await service.getTodayTask(req.user.id)
      res.status(200).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const getUpcomingTask=async(req, res)=>{
   try{
      const result= await service.getUpcomingTask(req.user.id)
      res.status(200).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const getAllTaskByUserId=async(req, res)=>{
   try{
      const result= await service.getAllTaskByUserId(req.user.id)
      res.status(200).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
} 
const getTaskDetail=async(req, res)=>{
   try{
      const result= await service.getTaskDetail(req.params.task_id)
      res.status(200).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const updateTaskDetail=async(req, res)=>{
   try{
      const {id,title, description,status, priority ,assignedUserId,projectId,startDate, dueDate}=req.body.updateData
      const startTimestamp = new Date(startDate).toISOString(); 
      const endTimestamp = new Date(dueDate).toISOString();
      if (!startDate || !dueDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(dueDate).getTime())) {
         return res.status(400).json({error: "Invalid date format"});
      }
      const task= await service.updateTaskDetail(req.user.id,id, title, status, priority, description, projectId  ,startTimestamp, endTimestamp,assignedUserId)
      res.status(200).json('success')
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const deleteTask=async(req, res)=>{
   try{
      const {id}=req.params
      const task= await service.deleteTask(req.user.id,id)
      res.status(200).json('success')
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
module.exports={
    createTask, 
    getAllTask, 
    updateTaskStatus,
    getTodayTask,
    getUpcomingTask,
    getAllTaskByUserId,
    getTaskDetail,
    updateTaskDetail,
    deleteTask
}