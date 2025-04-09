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
module.exports={
    createProject,
    getAllProject
}