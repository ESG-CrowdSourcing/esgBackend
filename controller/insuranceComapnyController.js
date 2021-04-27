var insuranceCompanySchema=require('../model/insuranceCompanyList.model')


exports.addInsurance=async(req,res)=>{
   
    try{
 let company= await insuranceCompanySchema.find({companyName:req.body.companyName}).exec()
if(company.length==0){
   new insuranceCompanySchema({
       companyName:req.body.companyName
   }).save()
   return res.status(200).json({
    message: 'company added successfully'
});

}
else{
    return res.status(200).json({
        message: 'company already exist'
    }); 
}

}
catch(error){
    return res.status(401).json({
        message: error.message
    });
}
}


exports.getInsurance=async(req,res)=>{
    try{
let companyList=await insuranceCompanySchema.find({}).exec()

return res.status(200).json({
    message: 'company list',
    data:companyList
}); 

    }
catch(error){
    return res.status(401).json({
        message: error.message
    });
}

}