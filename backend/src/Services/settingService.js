const { where } = require('sequelize')
const db =require('../Model/models')
const getSetting=async(userId)=>{
  try{
    const result=await db.UserSetting.findOne(
        {
            where:{
                userId:userId
            }
        }
    )
    const plainResult=await result.get({plain:true})
    return plainResult
  } catch(error){
    throw new Error(`check error ${error}`)
  }
}
const updateSetting=async(userId, language, theme, timezone)=>{
  try{
    const result=await db.UserSetting.findOne(
        {
            where:{
                userId:userId
            }
        }
    )
    const plainResult=await result.get({plain:true})
    const update=await db.UserSetting.update(
      {language:language,
        theme:theme,
        timezone:timezone
      },
      {
          where:{
             userId:userId
          }
      }
    )
  } catch(error){
    throw new Error(`check error ${error}`)
  }
}
module.exports={
    getSetting,
    updateSetting
}