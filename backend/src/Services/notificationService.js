const { where } = require('sequelize')
const { Op } = require('sequelize');
const db =require('../Model/models');
const createNotification=async(actorId,taskId, projectId, message, assignedUserId)=>{
    try{
        const result=await db.Notification.create({
            actorId:actorId,
            taskId:taskId,
            projectId:projectId,
            message:message
        })
        let array=[]
        const notiMembers = await assignedUserId.filter(memberId => memberId!=actorId);
        array=await notiMembers.map(memberId=>({
            notificationId: result.id,
            userId:memberId
        }))
        await db.NotificationRecipient.bulkCreate(array)
        return result.id
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const getAllNotification=async(userId)=>{
    try{
        const result=await db.NotificationRecipient.findAll(
            {
                where:{
                    userId:userId
                },
                order: [['createdAt', 'DESC']]
            }
        )
        const plainResult=await Promise.all(result.map(item=>item.get({plain:true})))
        const result2=await Promise.all(plainResult.map(item=>db.Notification.findByPk(item.notificationId)))
        const plainResult2=await Promise.all(result2.map(item=>item.get({plain:true})))
        const result3=await Promise.all(plainResult2.map(item=>db.User.findByPk(item.actorId)))
        const plainResult3=await Promise.all(result3.map(item=>item.get({plain:true})))
        const mergedResult=plainResult2.map((item, index)=>{
            return {
                ...item,
                isRead:plainResult[index].isRead,
                user: {
                    id: plainResult3[index].id,
                    firstname: plainResult3[index].firstname,
                    lastname: plainResult3[index].lastname,
                    avatar: plainResult3[index].avatar
                }
            }
        })
        return mergedResult
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const updateNotificationStatus=async (userId, notiId)=>{
    try{
        const result=await db.NotificationRecipient.update(
            {isRead:true},
            {
                where:{
                    notificationId:notiId,
                    userId:userId
                }
            }
        )
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
module.exports={
    createNotification,
    getAllNotification,
    updateNotificationStatus
}