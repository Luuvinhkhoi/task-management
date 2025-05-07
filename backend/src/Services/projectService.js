const { where } = require('sequelize')
const { Op } = require('sequelize');
const db =require('../Model/models')
const createProject=async(title, startDate, dueDate, assignedUserId)=>{
    try{
        const result=await db.Project.create({
            title:title,
            createdAt:startDate,
            endedAt:dueDate
        })
        const taskMembers = assignedUserId.map(memberId => ({
            projectId: result.id,
            userId:memberId
        }));
        await db.ProjectMember.bulkCreate(taskMembers);
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const updateProject=async(id,title, startDate, dueDate, assignedUserId)=>{
    try{
        const result=await db.Project.update(
            {
                title:title,
                createdAt:startDate,
                endedAt:dueDate
            },
            {
                where:{
                  id:id
                }
            }
        )
        await db.ProjectMember.destroy({
            where: {
                projectId: id,
                userId: { [Op.notIn]: assignedUserId} 
            }
        })
        const existing = await db.ProjectMember.findAll({
                where: { projectId: id }
        });
        const existingMemberIds = existing.map(row => row.userId);
        console.log(existingMemberIds)
        const newMembers = assignedUserId.filter(id => !existingMemberIds.includes(id));
        console.log(newMembers)
         await db.ProjectMember.bulkCreate(
            newMembers.map(user_id => ({
                projectId: id,
                userId: user_id,
            }))
        );
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const getAllProject=async()=>{
    try{
      let result= await db.Project.findAll()
      const plainResult =await result.map(project => project.get({ plain: true }))    
      return plainResult
    } catch (error){
      throw new Error(`check error ${error}`)
    }
}
const getProjectById=async(id)=>{
    try{
        let result= await db.Project.findByPk(id)
        const plainResult =await result.get({ plain: true })  
        return plainResult
      } catch (error){
        throw new Error(`check error ${error}`)
      }
}
const getProjectProgress=async(projectId)=>{
    try{
        let result1= await db.Task.findAndCountAll(
            {
                where:{
                    project_id:projectId
                }
            }
        )
        let result2= await db.Task.findAndCountAll(
            {
                where:{
                    project_id:projectId,
                    status:'Complete'
                }
            }
        )
        let result3=await db.Project.findByPk(projectId)
        const plainResult =await result3.get({ plain: true })
        return {projectId:projectId, projectName:plainResult.title ,totalTask:result1.count, completeTask:result2.count}
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const deleteProject=async(projectId)=>{
    try{
       await db.Project.destroy({
        where:{
            id:projectId
        }
       })
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
module.exports={
    createProject,
    getAllProject,
    getProjectProgress,
    getProjectById, 
    updateProject,
    deleteProject
}