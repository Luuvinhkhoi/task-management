const express=require('express');
const authRouter=require('./src/Routes/auth')
const session = require("express-session")
const passport=require('./src/config/passport')
const http=require('http')
const { Server } = require('socket.io')
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
const store = new session.MemoryStore();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true,
  }
});
global._io=io
app.use(express.json())

const sessionMiddleware=session({
      secret: "f4z4gs$Gcg",
      cookie: { maxAge: 1000 * 60 *60 * 24, secure: false, sameSite: "lax" },
      saveUninitialized: false,
      resave: false,
      store,
})
dotenv.config()
app.use(sessionMiddleware)
app.use(cors({
  origin: [
    'https://master.d2jsu35to5wcgl.amplifyapp.com',
    'http://localhost:5173', // Cho development
  ],
  methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE'], // Chỉ cho phép các phương thức này
  credentials: true, // Nếu cần gửi cookie hoặc thông tin xác thực
}));
app.use(passport.initialize());
app.use(passport.session());
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, () => {
    if (!socket.request.session.passport) {
      console.log('unauthorized')
      return next(new Error("Unauthorized"));
    }
    socket.user = socket.request.session.passport.user;
    next();
  });
}); 
global._io.on('connection',Socket.connection)

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

app.use('/auth', authRouter)
app.use('/user',isAuthenticated,userRouter)
app.use('/project',projectRouter)
app.use('/task',isAuthenticated,taskRouter)
app.use('/upload',uploadRouter)
app.use('/s3', s3Router)
app.use('/setting', isAuthenticated, settingRouter)
app.use('/comment', commentRouter)
app.use('/search',isAuthenticated,searchRouter)
app.use('/notification', isAuthenticated, notificationRouter)
server.listen(process.env.PORT||4001, () => console.log(`Server listening on port ${process.env.PORT}`));

