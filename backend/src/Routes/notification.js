const express=require('express')
const notificationRouter=express.Router()
const notificationController=require('../Controller/notificationController')

notificationRouter.get('/', notificationController.getAllNotification)
notificationRouter.post('/',notificationController.createNotification)
module.exports=notificationRouter