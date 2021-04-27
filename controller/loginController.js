const userModel=require('../model/user.model');
var config = require('../config');
var jwt=require('jsonwebtoken');
var nodemailer = require('nodemailer');
var OTP=require('../model/Otp.model');
const MailComposer = require("nodemailer/lib/mail-composer");
var CryptoJS = require("crypto-js");
const { findByIdAndUpdate, findOneAndUpdate } = require('../model/user.model');


exports.login=async(req,res)=>{
try{
   userModel.findOne({email:req.body.email}).populate('roleName').exec(async function(err,user){
       
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        
        var bytes  = CryptoJS.AES.decrypt(user.password, 'secret key 123');
        var password = bytes.toString(CryptoJS.enc.Utf8)

        if(password==req.body.password){

            if(user.roleName.roleName=="SuperAdmin"){

                var otp = Math.floor(1000 + Math.random() * 9000);
                let otpCheck=await OTP.findOneAndRemove({email:req.body.email}).exec()

                let otpdetals=  new OTP({
                    email : req.body.email,
                    otp : otp
                   }).save()
               
        
               var token = jwt.sign({email:user.email,name:user.name,role:user.roleName.roleName},config.secret ,{
                    expiresIn: 600 // expires in 24 hours
                  });
        
            
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'testmailer09876@gmail.com',
                        pass: 'ijsfupqcuttlpcez'
                    }
                });
                
                transporter.sendMail({
                from: 'testmailer09876@gmail.com',
                to: user.email,
                subject: 'OTP',
                text:otp.toString()
                });
               
                return res.status(200).json({
                    token: token,
                    status: 200,
                });

            }
            else{
                var token = jwt.sign({email:user.email,name:user.name,role:user.roleName.roleName},config.secret ,{
                    expiresIn: 600 
                  });

                  return res.status(200).json({
                    token: token,
                    status: 200,
                });
            }

        }else{
            return res.status(401).send({ auth: false });
        }

        
       
      
})
}
catch(error){
    return res.status(402).json({
        message: error.message,
        status: 402,
    });

}
}


 async function sendotp(req,res,user){

    try{
        var otp = Math.floor(1000 + Math.random() * 9000);

        var token = jwt.sign({ name: user.name,email:user.email}, config.secret, {
            expiresIn: 600 // expires in 24 hours
          });
    
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'testmailer09876@gmail.com',
                pass: 'ijsfupqcuttlpcez'
            }
        });
        
        transporter.sendMail({
        from: 'testmailer09876@gmail.com',
        to: user.email,
        subject: 'OTP',
        text:otp.toString()
        });

        return res.status(200).json({
            token: token,
            status: 200,
        });

    }

    catch(error){
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
   
}

exports.otpCheck=(req,res)=>{

    OTP.findOne({email:req.body.email,otp:req.body.otp},function(err,data){
    if(data){

        OTP.deleteOne({email:req.body.email,otp:req.body.otp}).exec()
        return res.status(200).json({
            message:'authendication success',
            status:200
        })
    }
    else{
        return res.status(401).json({
            message:'authendication failed',
            status:401
        })

    }

    })


}


exports.forgotPassword=(req,res)=>{
    try{
        userModel.findOne({email:req.body.email},function(err,data){

            if(data){
                var bytes  = CryptoJS.AES.decrypt(data.password, 'secret key 123');
                var password = bytes.toString(CryptoJS.enc.Utf8);
    
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'testmailer09876@gmail.com',
                        pass: 'ijsfupqcuttlpcez'
                    }
                });
                
                transporter.sendMail({
                from: 'testmailer09876@gmail.com',
                to: data.email,
                subject: 'Forgot Password',
                text:password.toString()
                });


                return res.status(200).json({
                    message:'password sent',
                    status:200
                })
    
            }
           else{
               return res.status(401).json({
                   message:'invalidEMail',
                   status:401
               })
           }

    })
    

    }

    catch(err){

    }

}
