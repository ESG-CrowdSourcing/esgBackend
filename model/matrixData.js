var mongoose = require('mongoose');
var schema = mongoose.Schema;


var dataSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyTitle'
    },
    DPCode: {
        type: String,
        required: false
    },

    fiscalYear: {
        type: String,
        required: false
    },
    dirName: {
        type: String,
        required: false
    },
    value: {
        type: String,
        required: false
    },
    isActive: {
        type: String,
        required: false
    },  
    fiscalYearEnddate:{
        type:String,
        required:false
    }

    
});

module.exports = mongoose.model('MatrixData', dataSchema);