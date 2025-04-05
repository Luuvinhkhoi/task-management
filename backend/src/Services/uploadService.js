const cloudinary = require('../config/cloudinary');
const db = require('../Model/models');

const uploadImageToCloudinary = async (filePath, userId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, async (err, result) => {
      if (err) return reject(err);
      
      await db.User.update( // nhớ đúng model
        { avatar: result.url },
        { where: { id: userId } }
      );

      resolve(result);
    });
  });
};

module.exports = {
  uploadImageToCloudinary,
};
