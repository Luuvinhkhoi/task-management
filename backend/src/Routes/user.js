const express = require('express')
const userRouter=express.Router()
const passport=require('../config/passport')
const userController=require('../Controller/userController')
userRouter.get('/role', userController.getAllUserRole)
userRouter.get('/role/:projectId', userController.getUserRole)
userRouter.get('/:projectId', userController.getUserByProjectId)
userRouter.get('/', userController.getAllUser);
userRouter.patch('/', userController.updateUser)
module.exports=userRouter