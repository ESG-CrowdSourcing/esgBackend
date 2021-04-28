const { create } = require('../model/batchAssignment.model');
var batchAssignmentSchema=require('../model/batchAssignment.model');
var groupSchema=require('../model/group.model');
var groupQA=require('../model/groupQA.model');
var groupAnalyst=require('../model/groupAnalyst.model');
var user=require('../model/user.model');


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
    return res.status(200).json({
        message:error.message
    })
}

}

exports.createGroup=(req,res)=>{

    try{
new groupSchema({
    groupName:req.body.groupName,
    batchId:req.body.batchId,
    groupAdmin:req.body.groupAdmin
}).save((err,data)=>{

})
    }
    catch(error){

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

