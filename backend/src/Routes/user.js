const express = require('express')
const userRouter=express.Router()
const passport=require('../config/passport')
const userController=require('../Controller/userController')
userRouter.get('/', userController.getAllUser);
module.exports=userRouter