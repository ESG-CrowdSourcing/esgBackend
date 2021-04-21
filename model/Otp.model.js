var mongoose = require('mongoose');
var schema = mongoose.Schema;
 
var otpSchema = new schema({
   
    email :{
        type : String,
        reqiured : false
    },
    otp:{
        type:Number,
        required:false
    }
 
});
 
module.exports = mongoose.model('otp', otpSchema);