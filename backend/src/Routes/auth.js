const express = require('express')
const authRouter=express.Router()
const passport=require('../config/passport')
const userController=require('../Controller/userController')
authRouter.post('/login',passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful', user: req.user });
})
authRouter.post('/signUp',userController.createUser)
authRouter.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({message:'Logout sucess'})
    });
});
authRouter.get('/', (req, res) => { 
  if (req.isAuthenticated()) { 
    res.json({ firstname: req.user.firstname,lastname: req.user.lastname , email: req.user.email, avatar:req.user.avatar, phone:req.user.phonenumber  }); 
  } else { 
    res.status(401).json({ message: 'Not authenticated' }); 
  } 
})
module.exports=authRouter