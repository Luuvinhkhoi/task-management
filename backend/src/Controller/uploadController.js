const uploadService = require('../Services/uploadService');

const uploadImage = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await uploadService.uploadImageToCloudinary(req.file.path, userId);
    res.json({ url: result.url });
  } catch (error) {
    console.log(error);
    res.status(400).send('Error uploading and resizing file: ' + error.message);
  }
};

module.exports = {
  uploadImage,
};
