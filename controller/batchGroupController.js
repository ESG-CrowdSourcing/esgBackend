const { create } = require('../model/batchAssignment.model');
var batchAssignmentSchema=require('../model/batchAssignment.model');
var groupSchema=require('../model/group.model');
var groupQA=require('../model/groupQA.model');
var groupAnalyst=require('../model/groupAnalyst.model');
var user=require('../model/user.model');
var companyTitle=require('../model/companyTitle');


exports.createBatch=async(req,res)=>{

    try{
        let batch= await batchAssignmentSchema.find({batchName:req.body.batchName}).exec()


        if(batch.length==0){
       
           new batchAssignmentSchema({
               batchName:req.body.batchName,
               companyList:req.body.companyList,
               batchSLA:req.body.batchSLA,
               createdBy:req.body.user
           }).save()
       
           return res.status(200).json({
               message:'Batch created successfully'
           })
       
        }else{
            return res.status(200).json({
                message:'Batch name already exist'
            })
        }
       

    }
catch(error){
    return res.status(400).json({
        message:error.message
    })
}

}

exports.createGroup=async(req,res)=>{

    try{
let group=await groupSchema.find({groupName:req.body.groupName}).exec()

if(group.length==0){
    new groupSchema({
        groupName:req.body.groupName,
        batchId:req.body.batchId,
        groupAdmin:req.body.groupAdmin
    }).save((err,data)=>{
    
     req.body.analyst.forEach((value)=>{
      
        new groupAnalyst({
            analystDetails:value,
            groupId:data._id
    }).save()
     
       })
      
       req.body.qa.forEach((value)=>{
        new groupQA({
            qaDetails:value,
            groupId:data._id
           }).save()
    })
      
    return res.status(200).json({
        message:'group created successfully'
    })
    
    })
}else{
    return res.status(200).json({
        message:'Group aleady exist'
    })
}


    }
    catch(error){
        return res.status(400).json({
            message:error.message
        })
    }

}

exports.getUsers=async(req,res)=>{

try{
let groupAdmin=await user.find({roleName:'607e67ce83805b1450022856'}).select('name email rolename -_id').populate('roleName').exec();
let QA=await user.find({roleName:'607e681283805b1450022857'}).select('name email rolename -_id').populate('roleName').exec(); 
let analyst=await user.find({roleName:'607e682483805b1450022858'}).select('name email rolename -_id').populate('roleName').exec(); 
return res.status(200).json({
    groupAdmin:groupAdmin,
    QA:QA,
    analyst:analyst
})


}
catch(error){
    return res.status(400).json({
        message:error.message,
       
    })

}

}

exports.getCompanies=async(req,res)=>{
    try{
let company=await companyTitle.find().exec()

return res.status(200).json({
    message:"success",
    companyList:company

})

    }
    catch(error){
    return res.status(400).json({
     message:error.message,
           
        })
    
    }
}

