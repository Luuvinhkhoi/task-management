const connection = require ('./src/config/connectDb');
const express=require('express');
const userRouter=require('./src/Routes/user')
const port=4001
const app=express()
connection()
app.use(express.json())
app.use('/user',userRouter)
app.listen(port,()=>{
    console.log(`Sever is listening on port ${port}`)
})
