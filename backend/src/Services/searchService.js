const { where } = require('sequelize')
const db =require('../Model/models')
const { Op } = require('sequelize');
const search=async(query)=>{
  try{
    const projectResult=await db.Project.findAll(
        {
            where:{
              title: {
                [Op.iLike]: `%${query}%`, // tìm title có chứa query, không phân biệt hoa thường (PostgreSQL)
              },
            }
        }
    )
    console.log(projectResult)
    const plainResult= projectResult?projectResult.map(project=>project.get({plain:true})):null
    console.log(plainResult)
    const taskResult=await db.Task.findAll(
        {
            where:{
              title: {
                [Op.iLike]: `%${query}%`, // tìm title có chứa query, không phân biệt hoa thường (PostgreSQL)
              },
            }
        }
    )
    const plainResult2=taskResult?taskResult.map(task=>task.get({plain:true})):null
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