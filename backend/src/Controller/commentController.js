const commentService = require('../Services/commentService');

const getAllComment=async(req, res)=>{
  try {
    const{taskId}=req.params
    const getComment = await commentService.getCommentsByTaskId(taskId);
    res.status(200).json(getComment)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const createComment=async(req,res)=>{
  try {
    const {taskId, content}=req.body
    const getComment = await commentService.createComment(taskId,content, req.user.id)
    res.status(201).json(getComment)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
module.exports = {
  getAllComment,
  createComment
};