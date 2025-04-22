const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl}=require('@aws-sdk/s3-request-presigner')
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const db=require('../Model/models');
const { where } = require("sequelize");

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (file, taskId) => {
  const fileStream = fs.createReadStream(file.path);
  const key = `uploads/${Date.now()}-${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  const url= `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  await db.Attachment.create(
    {url: url, taskId:taskId}
  )
};
const getPresignedUrlForDownload = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 phút
  return url;
};
module.exports = { uploadFileToS3, getPresignedUrlForDownload }