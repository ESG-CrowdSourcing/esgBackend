var mongoose = require('mongoose');
var schema = mongoose.Schema;

var insuranceCompanySchema = new schema({
  companyName:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('insurance', insuranceCompanySchema);