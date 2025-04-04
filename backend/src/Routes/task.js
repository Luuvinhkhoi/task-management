const express=require('express')
const taskRouter=express.Router()
const taskController=require('../Controller/taskController')
taskRouter.get('/', taskController.getAllTask)
taskRouter.post('/', taskController.createTask)
taskRouter.put('/', taskController.updateTaskStatus)
module.exports=taskRouter