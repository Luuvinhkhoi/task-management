const express=require('express')
const commentRouter=express.Router()
const commentController=require('../Controller/commentController')

commentRouter.get('/:taskId', commentController.getAllComment)
commentRouter.post('/',commentController.createComment)
module.exports=commentRouter