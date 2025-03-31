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
module.exports=authRouter