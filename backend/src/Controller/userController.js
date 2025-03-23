const db=require('../Services/userService')
const createUser= async(req, res)=>{
  try{
     const {email, password, username}=req.body
     const user= await db.createUser(email, password, username)
     res.status(201).json(user)
  } catch(error){
     res.status(500).json({error: error.message})
  }
}
module.exports={
    createUser
}