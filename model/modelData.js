var mongoose = require('mongoose');
var schema = mongoose.Schema;
const shortId = require('shortid')


var dataSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyTitle'
    },
    DPCode: {
        type: String,
        required: false
    },
    DPType:{
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
    unit: {
        type: String,
        required: false
    },
    performance: {
        type: String,
        required: false
    },
    fiscalYear: {
        type: String,
        required: false
    },
    indicator: {
        type: String,
        required: false
    },
    response: {
        type: String,
        required: false
    },
    fiscalYearEnddate:{
        type:String,
        required:false
    },
    percentile: {
        type: String,
        required: false
    },
    sourceName:{type: String,
        required:false},
    sourceURL:{
        type: String,
        required: false,
        default: shortId.generate
    },
    sourcePublicationDate:{
        type: String,
        required:false
    },
    pageNumber:{
        type: String,
        required:false
    },
    snapshot:{
        type: String,
        required:false
    },
    comments:{
        type: String,
        required:false
    },

    
});

module.exports = mongoose.model('ClientData', dataSchema);