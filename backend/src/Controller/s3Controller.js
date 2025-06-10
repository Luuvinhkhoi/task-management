const awsS3Service=require('../Services/awsS3Service')
const generatePresignedUrl = async (req, res) => {
  const key = req.params[0];
  try {
    const url = await awsS3Service.getPresignedUrlForDownload(key);
    res.json({ url });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Could not generate URL' });
  }
};
const deleteAttachment=async(req, res)=>{
  try {
    const id=req.body.id
    const key = req.params[0];
    await awsS3Service.deleteFileFromS3(key, id);
    res.json({ message: 'success'});
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Could not generate URL' });
  }
}
module.exports={generatePresignedUrl, deleteAttachment}
