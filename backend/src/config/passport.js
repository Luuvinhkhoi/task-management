const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db=require('../Model/models')
const service=require('../Services/userService')
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' }, // Đặt tên trường cho email và password
  service.loginUser // Gọi hàm login để xác thực
));
passport.serializeUser((user, done) => {
    //console.log(`Serilize user:`, user)
    try{
      done(null, user.id);
    }catch(error){
      console.log(error)
    }
});
  
passport.deserializeUser(async (id, done) => {
    //console.log("Deserialized user:")
    try {
        const user = await db.User.findByPk(id); // Gọi findById
        //console.log("Deserialized user:", user); // Log user
        done(null, user); // Hoặc done(null, false) nếu không tìm thấy user
    } catch (error) {
        done(error); // Kích hoạt lỗi nếu có lỗi
    }
});
module.exports = passport;