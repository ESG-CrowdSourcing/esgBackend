var mongoose = require('mongoose');
var schema = mongoose.Schema;

var dirSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    companyID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyTitle'
        },
        fiscalYear:{
            type:String,
            required:false
        },
        companyDirectors:{
            type:Array,
            required:false
        }
});

module.exports = mongoose.model('Directors', dirSchema);