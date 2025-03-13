const connection = require ('./config/connectDb');
const express=require('express');
const port=4001
const app=express()
connection()
app.listen(port,()=>{
    console.log(`Sever is listening on port ${port}`)
})