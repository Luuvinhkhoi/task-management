// services/s3Service.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${uuidv4()}-${file.originalname}`, // unique filename
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise(); // returns a promise
};

module.exports = { uploadFile };
