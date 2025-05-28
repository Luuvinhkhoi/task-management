const service=require('../Services/userService')
const createUser= async(req, res)=>{
  try{
     const {email, password, firstname, lastname}=req.body
     const user= await service.createUser(email, password, firstname, lastname)
     res.status(201).json(user)
  } catch(error){
     res.status(500).json({error: error.message})
  }
}
const getAllUser=async(req, res)=>{
   try{
      const user= await service.getAllUser()
      res.status(201).json(user)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const getUserByProjectId=async(req,res)=>{
   try{
      const {projectId}=req.params
      const user= await service.getUserByProjectId(projectId)
      res.status(201).json(user)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const updateUser=async(req, res)=>{
   try{
      const {updateData}=req.body      
      const user=await service.updateUser(req.user.id, updateData)
      res.status(201).json({message: 'sucess update'})
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
const getUserRole=async(req, res)=>{
   try{
      const {projectId}=req.params   
      const result=await service.getUserRole(req.user.id, projectId)
      res.status(201).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
module.exports={
    createUser,
    getAllUser,
    updateUser,
    getUserByProjectId,
    getUserRole
}