const express=require('express')
const notificationRouter=express.Router()
const notificationController=require('../Controller/notificationController')

notificationRouter.get('/', notificationController.getAllNotification)
notificationRouter.post('/',notificationController.createNotification)
notificationRouter.patch('/',notificationController.updateNotificationStatus)
module.exports=notificationRouter