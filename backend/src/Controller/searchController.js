const service=require('../Services/searchService')
const search=async(req, res)=>{
   try{
      const {name}=req.query
      const result= await service.search(req.user.id,name)
      res.status(201).json(result)
   } catch(error){
      res.status(500).json({error: error.message})
   }
}
module.exports={
    search
}