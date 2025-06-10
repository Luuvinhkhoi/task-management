const service=require('../Services/settingService')
const getSetting=async(req, res)=>{
   try{
        const result=await service.getSetting(req.user.id)
        res.status(201).json(result)
   }catch(error){
        res.status(500).json({error: error.message})
   }
}
const updateSetting=async(req, res)=>{
     try{
          const {language, theme, timezone}=req.body.updateData
          const result=await service.updateSetting(req.user.id, language, theme, timezone)
          res.status(201).json('success')  
     }catch(error){
          res.status(500).json({error: error.message})
     }
}
module.exports={
    getSetting,
    updateSetting
}