const uploadService = require('../Services/uploadService');
const {uploadFile}=require('../Services/awsS3Service')
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
const uploadToS3 = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadFile(file);
    res.status(200).json({
      message: 'File uploaded successfully!',
      url: result.Location, // S3 public URL
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};
module.exports = {
  uploadImage,
  uploadToS3
};
