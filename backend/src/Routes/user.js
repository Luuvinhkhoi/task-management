const express = require('express')
const userRouter=express.Router()
const userController=require('../Controller/userController')
userRouter.post('/', userController.createUser)
module.exports=userRouter