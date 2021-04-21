var mongoose = require('mongoose');
var schema = mongoose.Schema;
 
var userSchema = new schema({
    onBoardingType :{
        type : String,
        required : false
    },
    onBoardedBy :{
        type : String,
        required : false
    },
    onBoardedStatus : {
        type : String,
        required : false
    },
    onBoardedDate :{
        type : Date,
        required : false,
        trim : false
    },
    firstName : {
        type: String,
        required: false
    },
    lastName:{
        type : String,
        required : false
    },
    middelName:{
        type : String,
        required : false
    },
    email :{
        type : String,
        reqiured : false
    },
    password:{
        type: String,
        required:false
    },
    roleName:{ type: schema.Types.ObjectId, ref: 'role',required:false },
    phoneNumber : {
        type : String,
        required : false
    },
    adharCard : {
        type : Number,
        required : false
    },
    PANCard : {
        type : String,
        requored : false
    },
    bankAccountNumber : {
        type : Number,
        required : false
    },
    bankIFSCCode : {
        type : String,
        required : false
    },
    nameOfTheAccountHolder : {
        type : String,
        required : false
    },
    name:{
        type : String,
        required : false
    },
    companyName : {
        type : String,
        required : false
    },
    uploadPanCard:{
        type : String,
        required : false
    },
    uploadAdhar:{
        type : String,
        required : false
    },
    uploadCancelled:{
        type : String,
        required : false
    },
    uploadAuthendicationLetterClient:{
        type : String,
        required : false
    },
    uploadCompanyIdClient:{
        type : String,
        required : false
    },
    uploadAuthendicationLetterCompany:{
        type : String,
        required : false
    },
    uploadCompanyIdCompany:{
        type : String,
        required : false
    }
 
});
 
module.exports = mongoose.model('user', userSchema);