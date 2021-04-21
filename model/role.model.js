var mongoose = require('mongoose');
var schema = mongoose.Schema;

var roleSchema = new schema({

    roleName: {
        type: String
    }   
 
});

module.exports = mongoose.model('role', roleSchema);