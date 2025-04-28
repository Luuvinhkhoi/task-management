const commentService = require('../Services/commentService');
const getAllComment=async(req, res)=>{
  try {
    const {taskId}=req.params
    const getComment = await commentService.getCommentsByTaskId(taskId);
    res.status(201).json(getComment)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
module.exports = {
  getAllComment
};