var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ruleSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    ruleID: {
        type:String,
        required:false
    },
    DPCode:{
        type:String,
        required:false
    },
    aidDPLogic: {
        type: String,
        required: false
    },
    methodName:{
        type: String,
        required: false
    },
    methodType:{
        type: String,
        required: false
    },
    criteria:{
        type: String,
        required: false
    },
    parameter:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Rule', ruleSchema);