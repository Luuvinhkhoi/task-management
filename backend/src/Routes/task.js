const express=require('express')
const taskRouter=express.Router()
const taskController=require('../Controller/taskController')
taskRouter.get('/project/:project_id', taskController.getAllTask)
taskRouter.get('/user', taskController.getTodayTask)
taskRouter.post('/', taskController.createTask)
taskRouter.put('/', taskController.updateTaskStatus)
module.exports=taskRouter