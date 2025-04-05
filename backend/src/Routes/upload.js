const express = require('express');
const uploadRouter = express.Router();
const uploadController = require('../Controller/uploadController');
const upload = require('../middleware/multer');

uploadRouter.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = uploadRouter;
