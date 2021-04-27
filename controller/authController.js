const userModel=require('../model/user.model');
const roleModel=require('../model/role.model');
var CryptoJS = require("crypto-js");


exports.authdication=async(req,res)=>{

    try{
      
        var password = CryptoJS.AES.encrypt(req.body.password, 'secret key 123').toString();
      //  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

      let user=await userModel.findOne({name:req.body.name,email:req.body.email}).exec()

      if(!user){
        let user=new userModel({
            name : req.body.name,
            email : req.body.email,
            password : password,
            roleName:req.body.roleName
           }).save()
   
           return res.status(200).json({
               message: 'user added successfully.',
               status: 200,
           });

      }
      else{
        return res.status(200).json({
            message: 'user already exisit',
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


exports.role=async(req,res)=>{

    try{

     let role=await roleModel.findOne({roleName:req.body.roleName}).exec()

    if(!role){

        let user=new roleModel({
            roleName : req.body.roleName,
           
           }).save()

           return res.status(200).json({
            message:'role added successfully',
            status: 200,
        });

    }
    else{
        return res.status(200).json({
            message:'role already exist',
            status: 200,
        });
    }

       

    }
    catch(err){
        return res.status(403).json({
            message: error.message,
            status: 403,
        });

    }

}