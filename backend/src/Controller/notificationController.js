const notificationService=require('../Services/notificationService')
const createNotification=async(req, res)=>{
    try{
       const{actorId, taskId, projectId, message, assignedUserId}=req.body
       const create = await notificationService.createNotification(actorId, taskId, projectId, message, assignedUserId)
       res.status(201).json({message:'success'})
    } catch (error) {
       res.status(500).json({error: error.message})
    }
}
const getAllNotification=async(req, res)=>{
     try{
       const create = await notificationService.getAllNotification(req.user.id)
       res.status(201).json(create)
    } catch (error) {
       res.status(500).json({error: error.message})
    }
}
module.exports={
    createNotification,
    getAllNotification
}