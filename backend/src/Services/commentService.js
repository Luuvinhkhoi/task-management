const db= require('../Model/models');

class CommentService {
  static async createComment(taskId, content , userId) {
    try{
      console.log(taskId, content, userId)

      const newComment = await db.Comment.create({
        taskId,
        userId,
        content,
      });
      return newComment
    } catch(error){
      throw new Error(error)
    };
  }

  static async getCommentsByTaskId(taskId) {
    return db.Comment.find({ taskId }).sort({ createdAt: 1 });
  }
}

module.exports = CommentService;
