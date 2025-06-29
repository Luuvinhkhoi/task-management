const service=require('../Services/projectService')
const createProject= async(req, res)=>{
  try{
     const {title, assignedUserId}=req.body
     const project= await service.createProject(title,assignedUserId)
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
      const {id,title,assignedUserId,role}=req.body.updateData
      const task= await service.updateProject(req.user.id,id, title,assignedUserId, role)
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