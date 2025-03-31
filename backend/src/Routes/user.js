const express = require('express')
const userRouter=express.Router()
const passport=require('../config/passport')
const userController=require('../Controller/userController')
userRouter.get('/', (req, res) => { 
    console.log(req.session)
    if (req.isAuthenticated()) { 
      res.json({ user_name: req.user.username, email: req.user.email }); 
    } else { 
      res.status(401).json({ message: 'Not authenticated' }); 
    } 
});
module.exports=userRouter