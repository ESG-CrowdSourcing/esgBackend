var mongoose = require('mongoose');
var schema = mongoose.Schema;

var yearSchema = new schema({
    year:{
        type:String,

    },
    companyName:{ type: String}
    
 
});

module.exports = mongoose.model('Year', yearSchema);