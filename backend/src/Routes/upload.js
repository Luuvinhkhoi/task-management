const express = require('express');
const uploadRouter = express.Router();
const uploadController = require('../Controller/uploadController');
const upload = require('../middleware/multer');

uploadRouter.post('/image', upload.single('image'), uploadController.uploadImage);
uploadRouter.post('/file', upload.single('file'), uploadController.uploadToS3);
module.exports = uploadRouter;
