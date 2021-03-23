var mongoose = require('mongoose');
var schema = mongoose.Schema;
mongoose.Schema.Types.Boolean.convertToFalse.add('');
mongoose.Schema.Types.Boolean.convertToTrue.add('TRUE')

var dataSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    keyIssuesID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KeyIssues'
    },
    DPCode: {
        type: String,
        required: false
    },
    dataCollection:{
        type: String,
        required: false
    },
    DPName: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    functions: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    polarity: {
        type: String,
        required: false
    },
    polarityCheck: {
        type: String,
        required: false
    },
    signal: {
        type: String,
        required: false
    },
    
    normalizedBy:{
        type:String,
        required:false
    },
    Weighted:{
        type:String,
        required:false
    },
    percentile: {
        type: String,
        required: false
    },
    relevantForIndia:{type: String,
        required:false},
    finalUnit:{
        type: String,
        required:false
    },
    standaloneMatrix:{
        type: String,
        required:false
    },
    reference:{
        type: String,
        required:false
    },
    industryRelevancy:{
        type: String,
        required:false
    }
});

module.exports = mongoose.model('DPDetails', dataSchema);