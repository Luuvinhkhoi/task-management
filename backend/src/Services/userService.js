const { where } = require('sequelize')
const db = require('../Model/models')
const bcrypt=require('bcryptjs');
const createUser=async(email, password, firstname, lastname)=>{
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const result=await db.User.create({
        email: email,
        password:hashedPassword,
        firstname:firstname,
        lastname: lastname,
    })
    const plainResult=await result.get({plain:true})
    await db.UserSetting.create({
        language:'English',
        theme:'dark',
        timezone:'Asia/Ho_Chi_Minh',
        userId:plainResult.id
    })
  } catch(error){
    throw new Error(`check error ${error}`, error)
  }
}
const loginUser = async (email, password, done) => {
  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const matchFound = await bcrypt.compare(password, user.password);
    if (!matchFound) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
const getAllUser= async()=>{
  try {
    let result= await db.User.findAll()
    const plainResult =await result.map(user => user.get({ plain: true }))    
    return plainResult
  } catch (error) {
    throw new Error(`check error ${error}`, error)  
  }
}
const getUserByProjectId= async(projectId)=>{
  try {
    let result= await db.ProjectMember.findAll(
      {where:{
        projectId:projectId
      }}
    )
    const plainResult =await result.map(user => user.get({ plain: true }))
    console.log(plainResult)
    const result2= await Promise.all(plainResult.map(item=>db.User.findByPk(item.userId)))
    const plainResult2 =await result2.map(user => user.get({ plain: true }))
    const merge=plainResult2.map((user, index)=>
        {
            return{
                ...user,
                role:plainResult[index].role
            }
        }
      )  
    return merge
  } catch (error) {
    throw new Error(`check error ${error}`, error)  
  }
}
const updateUser=async(id,updateData)=>{
  try{
    let result= await db.User.update(
      updateData,
      {
        where:{
          id: id
        }
      }
    )
  } catch (error){
    throw new Error(`check error ${error}`, error)  

  }
}
const getUserRole=async(userId, projectId)=>{
  try{
    let result= await db.ProjectMember.findAll(
      {
        where:{
          projectId: projectId,
          userId:userId
        }
      }
    )
    console.log(result)
    const plainResult=await result.map(item=>item.get({plain:'true'}))
    return plainResult
  } catch (error){
    throw new Error(`check error ${error}`, error)  

  }
}
const getAllUserRole=async(userId)=>{
  try{
    let result= await db.ProjectMember.findAll(
      {
        where:{
          userId:userId
        }
      }
    )
    const plainResult=await result.map(item=>item.get({plain:'true'}))
    return plainResult
  } catch (error){
    throw new Error(`check error ${error}`, error)  

  }
}
module.exports={
    createUser,
    loginUser,
    getAllUser,
    updateUser,
    getUserByProjectId,
    getUserRole, 
    getAllUserRole
}
