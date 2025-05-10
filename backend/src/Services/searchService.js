const { where } = require('sequelize')
const db =require('../Model/models')
const { Sequelize, Op } = require('sequelize');
const search=async(userId,query)=>{
  try{
    const projectByUserId=await db.ProjectMember.findAll(
      {
        where:{
          userId:userId
        }
      }
    )
    const plainResult3=projectByUserId?projectByUserId.map(project=>project.get({plain:true})):null
    
    const projectResult=await Promise.all(plainResult3.map(item=>
      db.Project.findOne({
        where: {
          id: item.projectId,
          title: { [Op.iLike]: `%${query}%` }
        },
        include: [{
          model: db.ProjectMember,
          as: 'projectMembers',
          attributes: [],
        }],
        attributes: {
          include: [
            [Sequelize.fn("COUNT", Sequelize.col("projectMembers.userId")), "memberCount"]
          ]
        },
        group: ['Project.id'],
      })
    ))
    console.log(projectResult)
    const plainResult = projectResult.filter(project => project !== null).map(project => project.get({ plain: true }));
    console.log(plainResult)
    const taskByUserId=await db.TaskMember.findAll(
      {
        where:{
          user_id:userId
        }
      }
    )
    const plainResult4=taskByUserId?taskByUserId.map(task=>task.get({plain:true})):null
    const taskResult=await Promise.all(plainResult4.map(item=>
      db.Task.findOne(
        {
            where:{
              id: item.task_id,
              title: {
                [Op.iLike]: `%${query}%`, // tìm title có chứa query, không phân biệt hoa thường (PostgreSQL)
              }
            }
        }
      )
    ))
    const plainResult2=taskResult.filter(task => task !== null).map(task => task.get({ plain: true }));
    const combinedResults = {
      project: plainResult,
      task: plainResult2,
    };
    return combinedResults
  } catch(error){
    throw new Error(`check error ${error}`)
  }
}
module.exports={
  search
}