const { where } = require('sequelize')
const db =require('../Model/models')
const createProject=async(title, startDate, dueDate)=>{
    try{
        await db.Project.create({
            title:title,
            createdAt:startDate,
            endedAt:dueDate
        })
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
module.exports={
    createProject,
    getAllProject,
    getProjectProgress
}