const db= require('../Model/models');

class CommentService {
  static async createComment(data) {
    const {taskId, userId, content}=data
    const newComment = await db.Comment.create({
      taskId,
      userId,
      content,
    });
    console.log(newComment)
    return newComment;
  }

  static async getCommentsByTaskId(taskId) {
    return db.Comment.find({ taskId }).sort({ createdAt: 1 });
  }
}

module.exports = CommentService;
