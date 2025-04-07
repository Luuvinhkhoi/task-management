const connection = require ('./src/config/connectDb');
const express=require('express');
const authRouter=require('./src/Routes/auth')
const session = require("express-session")
const passport=require('./src/config/passport')
const cors = require('cors');
const userRouter = require('./src/Routes/user');
const projectRouter = require('./src/Routes/project');
const taskRouter = require('./src/Routes/task');
const uploadRouter = require('./src/Routes/upload');
const port=4001
const app=express()
const store = new session.MemoryStore();
connection()
app.use(express.json())
app.use(
    session({
      secret: "f4z4gs$Gcg",
      cookie: { maxAge: 1000 * 60 *60 * 24, secure: false, sameSite: "lax" },
      saveUninitialized: false,
      resave: false,
      store,
    })
);
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE'], // Chỉ cho phép các phương thức này
  credentials: true, // Nếu cần gửi cookie hoặc thông tin xác thực
}));
app.use(passport.initialize());
app.use(passport.session());
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

app.use('/auth', authRouter)
app.use('/user',isAuthenticated,userRouter)
app.use('/project',projectRouter)
app.use('/task',taskRouter)
app.use('/upload', isAuthenticated,uploadRouter)
app.listen(port,()=>{
    console.log(`Sever is listening on port ${port}`)
})
