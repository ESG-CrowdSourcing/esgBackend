var mongoose = require('mongoose');
var schema = mongoose.Schema;

var dirSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    companyID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyTitle'
        },
        directors:{
            type:String,
            required:false
        }
});

module.exports = mongoose.model('Directors', dirSchema);