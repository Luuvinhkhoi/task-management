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
      const result=await service.getAllTask()
      res.status(201).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const updateTaskStatus=async(req, res)=>{
   try{
      const {id, status}=req.body
      const result=await service.updateTaskStatus(id, status)
      res.status(201).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
module.exports={
    createTask, 
    getAllTask, 
    updateTaskStatus
}