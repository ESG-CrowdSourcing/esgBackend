const userModel=require('../model/user.model');
const emplyeeModel=require('../model/employee.model');
const { find } = require('../model/user.model');
const clientModel=require('../model/clientRepresentative.model');
const companyRepModel=require('../model/companyRepresentative.model');


exports.employee=async(req,res)=>{


try{

    let image = req.files.map(a => a.path);
   

let employee= await userModel.findOne({PANCard:req.body.PANCard,adharCard:req.body.adharCard}).exec()


if(!employee){
     let employee=new userModel({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        middleName:req.body.middleName,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        PANCard:req.body.PANCard,
        adharCard:req.body.adharCard,
        bankAccountNumber:req.body.bankAccountNumber,
        bankIFSCCode:req.body.bankIFSCCode,
        nameOfTheAccountHolder:req.body.nameOfTheAccountHolder,
        onBoardedStatus:'Not Approved',
        password:req.body.password,
        uploadPanCard:image[0],
        uploadAdhar:image[1],
        uploadCancelled:image[2]

    }).save(function(err,data){
if(data){
    let employee= new emplyeeModel({
        userId:data._id
    }).save()

    return res.status(200).json({
        message: 'This Employee is onboarded',
        status: 200,
    });


}
    })

}
else{
    return res.status(200).json({
        message: 'This Employee already onboarded',
        status: 200,
    });
}
    
}
catch(error){
    return res.status(403).json({
        message: error.message,
        status: 403,
    });
}

}

exports.client=async(req,res)=>{

    try{
        let image = req.files.map(a => a.path);
        let clientRep= await userModel.findOne({name:req.body.name,password:req.body.password}).exec()

    if(!clientRep){
        let clientDetails=new userModel({
            name:req.body.name,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            companyName:req.body.companyName,
            password:req.body.password,
            uploadAuthendicationLetterClient:image[0],
            uploadCompanyIdClient:image[1]
        }).save(function(err,data){
            if(data){
let clientdata= new clientModel({
    userId:data._id
}).save()

return res.status(200).json({
    message: 'This clientRep is onboarded',
    status: 200,
});


            }
        })
    }
    else{
        return res.status(200).json({
            message: 'This clientRep is  already onboarded',
            status: 200,
        });

    }

    }
    catch(error){
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
   



}


exports.company=async(req,res)=>{

    try{
        let image = req.files.map(a => a.path);
        let companyRep= await userModel.findOne({name:req.body.name,password:req.body.password}).exec()

        if(!companyRep){
            let companyDetails=new userModel({
                name:req.body.name,
                email:req.body.email,
                phoneNumber:req.body.phoneNumber,
                companyName:req.body.companyName,
                password:req.body.password,
                uploadAuthendicationLetterCompany:image[0],
                uploadCompanyIdCompany:image[1]
            }).save(function(err,data){
                if(data){
    let companydata= new companyRepModel({
        userId:data._id
    }).save()
    
    return res.status(200).json({
        message: 'This companyRep is onboarded',
        status: 200,
    });
    
    
                }
            })
        }
        else{
            return res.status(200).json({
                message: 'This companyRep is already onboarded',
                status: 200,
            });

        }

    }
    catch(error){
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}