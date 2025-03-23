const db = require('../Model/models')
const createUser=(email, password, username)=>{
  try{
    db.User.create({
        email: email,
        password:password,
        username:username
    })
  } catch(error){
    throw new Error('check error', error)
  }
}
module.exports={
    createUser
}
