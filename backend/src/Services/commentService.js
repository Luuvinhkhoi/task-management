const { where } = require('sequelize');
const db= require('../Model/models');

class CommentService {
  static async createComment(taskId, content , userId) {
    try{

      const newComment = await db.Comment.create({
        task_id:taskId,
        user_id:userId,
        content:content,
      });
      return newComment
    } catch(error){
      throw new Error(error)
    };
  }

  static async getCommentsByTaskId(taskId) {
    const result=await db.Comment.findAll(
      {
        where:{task_id:taskId},
        order: [['createdAt', 'ASC']],
      }
    );
    const plainResult=await Promise.all(result.map(item=>item.get({plain:true})))
    const result2=await Promise.all(plainResult.map(item=>db.User.findByPk(item.user_id)))
    const plainResult2=await Promise.all(result2.map(item=>item.get({plain:true})))
    const mergedResult=plainResult.map((item, index)=>{
        return{
          ...item,
          user:{
            id:plainResult[index].id,
            firstname: plainResult2[index].firstname,
            lastname: plainResult2[index].lastname,
            avatar: plainResult2[index].avatar          
          }
        }
    }
    )
    return mergedResult
  }
}

module.exports = CommentService;
