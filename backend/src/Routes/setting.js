const express=require('express')
const settingRouter=express.Router()
const settingController=require('../Controller/settingController')
settingRouter.get('/', settingController.getSetting)
settingRouter.patch('/', settingController.updateSetting)
module.exports=settingRouter