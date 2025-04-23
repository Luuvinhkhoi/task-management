const express=require('express')
const s3Router = express.Router();
const s3Controller=require('../Controller/s3Controller')
s3Router.get('/download/*', s3Controller.generatePresignedUrl);
s3Router.delete('/delete/*', s3Controller.deleteAttachment)
module.exports=s3Router