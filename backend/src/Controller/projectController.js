const service=require('../Services/projectService')
const createProject= async(req, res)=>{
  try{
     const {title, startDate, endDate}=req.body
     console.log(req.body)
     const startTimestamp = new Date(startDate).toISOString(); 
     const endTimestamp = new Date(endDate).toISOString();
     console.log(startTimestamp)
     console.log(endTimestamp)
     if (!startDate || !endDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({error: "Invalid date format"});
     }
     const project= await service.createProject(title, startTimestamp, endTimestamp)
     res.status(201).json(project)
  } catch(error){
     res.status(500).json({error: error.message})
  }
}
const getAllProject=async(req, res)=>{
    try{
        const project= await service.getAllProject()
        res.status(201).json(project)
    } catch(error){
        res.status(500).json({error: error.message})
    }
}
module.exports={
    createProject,
    getAllProject
}