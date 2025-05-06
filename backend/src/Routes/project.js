const express=require('express')
const projectRouter=express.Router()
const projectController=require('../Controller/projectController')
projectRouter.post('/', projectController.createProject)
projectRouter.get('/', projectController.getAllProject)
projectRouter.get('/progress',projectController.getProjectProgress)
projectRouter.get('/:id',projectController.getProjectById)
projectRouter.patch('/', projectController.updateProject)
module.exports=projectRouter