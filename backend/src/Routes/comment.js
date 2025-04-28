const express=require('express')
const commentRouter=express.Router()
const commentController=require('../Controller/commentController')
commentRouter.get('/:taskId', commentController.getAllComment)
module.exports=commentRouter