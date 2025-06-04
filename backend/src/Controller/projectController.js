const service=require('../Services/projectService')
const createProject= async(req, res)=>{
  try{
     const {title, startDate, endDate, assignedUserId}=req.body
     console.log(req.body)
     const startTimestamp = new Date(startDate).toISOString(); 
     const endTimestamp = new Date(endDate).toISOString();
     console.log(startTimestamp)
     console.log(endTimestamp)
     if (!startDate || !endDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({error: "Invalid date format"});
     }
     const project= await service.createProject(title, startTimestamp, endTimestamp, assignedUserId)
     res.status(201).json(project)
  } catch(error){
     res.status(500).json({error: error.message})
  }
}
const getAllProject=async(req, res)=>{
    try{
        const project= await service.getAllProject(req.user.id)
        res.status(201).json(project)
    } catch(error){
        res.status(500).json({error: error.message})
    }
}
const getProjectById=async(req,res)=>{
    try{
        const {id}=req.params
        const project= await service.getProjectById(id)
        res.status(201).json(project)
    } catch(error){
        res.status(500).json({error: error.message})
    }
}
const getProjectProgress=async(req, res)=>{
    try{
        const project1= await service.getAllProject(req.user.id)
        const project2= await Promise.all (project1.map(project=>service.getProjectProgress(project.id)))
        res.status(201).json(project2)
    } catch(error){
        res.status(500).json({error: error.message})
    }
}
const updateProject=async(req, res)=>{
   try{
      const {id,title,assignedUserId,startDate, dueDate, role}=req.body.updateData
      console.log(req.body)
      const startTimestamp = new Date(startDate).toISOString(); 
      const endTimestamp = new Date(dueDate).toISOString();
      console.log(startTimestamp)
      console.log(endTimestamp)
      if (!startDate || !dueDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(dueDate).getTime())) {
         return res.status(400).json({error: "Invalid date format"});
      }
      const task= await service.updateProject(req.user.id,id, title,startTimestamp, endTimestamp,assignedUserId, role)
      res.status(201).json('success')
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const deleteProject=async(req, res)=>{
    try{
        const {id}=req.params
        const project1= await service.deleteProject(req.user.id,id)
        res.status(201).json({message:'success'})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}
module.exports={
    createProject,
    getAllProject,
    getProjectProgress,
    getProjectById,
    updateProject,
    deleteProject
}