const uploadService = require('../Services/uploadService');
const awsS3Service=require('../Services/awsS3Service')
const uploadImage = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await uploadService.uploadImageToCloudinary(req.file.path, userId);
    res.json({ url: result.url });
  } catch (error) {
    res.status(400).send('Error uploading and resizing file: ' + error.message);
  }
};
const uploadToS3 = async (req, res) => {
  try {
    const taskId=req.body.task_id
    const fileUrl = await awsS3Service.uploadFileToS3(req.file,taskId);
    res.status(200).json({ success: true, url:fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

module.exports = {
  uploadImage,
  uploadToS3
};
