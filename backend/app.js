const express=require('express');
const authRouter=require('./src/Routes/auth')
const session = require("express-session")
const passport=require('./src/config/passport')
const http=require('http')
const { Server } = require('socket.io')
const attachUserToRequest = require('./src/middleware/attachUserToRequest')
const socketJwtMiddleware = require('./src/middleware/socketJwtMiddleware');
const cors = require('cors');
const userRouter = require('./src/Routes/user');
const projectRouter = require('./src/Routes/project');
const taskRouter = require('./src/Routes/task');
const uploadRouter = require('./src/Routes/upload');
const commentRouter=require('./src/Routes/comment')
const notificationRouter=require('./src/Routes/notification')
const settingRouter=require('./src/Routes/setting')
const dotenv = require("dotenv");
const Socket=require('./src/Controller/socketController')
const s3Router=require('./src/Routes/s3')
const searchRouter=require('./src/Routes/search')
const db=require('./src/Model/models')
const app=express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  }
});
global._io=io
app.use(express.json())

dotenv.config()
app.use(cors());

socketJwtMiddleware(io);
global._io.on('connection',Socket.connection)

app.use('/auth', attachUserToRequest,authRouter)
app.use('/user',attachUserToRequest,userRouter)
app.use('/project',attachUserToRequest,projectRouter)
app.use('/task',attachUserToRequest,taskRouter)
app.use('/upload',attachUserToRequest,uploadRouter)
app.use('/s3', s3Router)
app.use('/setting', attachUserToRequest, settingRouter)
app.use('/comment', attachUserToRequest,commentRouter)
app.use('/search',attachUserToRequest,searchRouter)
app.use('/notification', attachUserToRequest, notificationRouter)
server.listen(process.env.PORT||4001, () => console.log(`Server listening on port ${process.env.PORT}`));

