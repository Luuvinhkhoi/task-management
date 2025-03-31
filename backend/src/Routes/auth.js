const express = require('express')
const authRouter=express.Router()
const passport=require('../config/passport')
const userController=require('../Controller/userController')
authRouter.post('/login',passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful', user: req.user });
})
authRouter.post('/signUp',userController.createUser)
module.exports=authRouter