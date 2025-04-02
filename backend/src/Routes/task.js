const express=require('express')
const taskRouter=express.Router()
const taskController=require('../Controller/taskController')
taskRouter.post('/', taskController.createTask)
module.exports=taskRouter