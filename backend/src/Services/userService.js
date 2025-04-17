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
const updateUser=async(id,updateData)=>{
  try{
    console.log(updateData)
    let result= await db.User.update(
      updateData,
      {
        where:{
          id: id
        }
      }
    )
    console.log(result)
  } catch (error){
    throw new Error(`check error ${error}`, error)  

  }
}
module.exports={
    createUser,
    loginUser,
    getAllUser,
    updateUser
}
