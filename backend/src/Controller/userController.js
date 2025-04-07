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
const updateUser=async(req, res)=>{
   try{
      const {updateData}=req.body      
      const user=await service.updateUser(req.user.id, updateData)
      res.status(201).json({message: 'sucess update'})
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
module.exports={
    createUser,
    getAllUser,
    updateUser
}