const express = require('express')
const userRouter=express.Router()
const passport=require('../config/passport')
const userController=require('../Controller/userController')
userRouter.get('/:projectId', userController.getUserByProjectId)
userRouter.get('/', userController.getAllUser);
userRouter.patch('/', userController.updateUser)
module.exports=userRouter