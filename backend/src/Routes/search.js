const searchController=require('../Controller/searchController')
const express=require('express')
const searchRouter=express.Router()
searchRouter.get('/', searchController.search)
module.exports=searchRouter