var mongoose = require('mongoose');
var schema = mongoose.Schema;

var dataSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    keyIssuesID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Key'
    },
    DPCode: {
        type: String,
        required: true
    },
    DPType:{
        type: String,
        required: true
    },
    DPName: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    fiscalYear: {
        type: String,
        required: false
    },
    indicator: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: false
    },
    fiscalYearEnddate:{
        type:String,
        required:false
    },
    directors:{
        type:String,
        required:false
    },
    percentile: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Data', dataSchema);