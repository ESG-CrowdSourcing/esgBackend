var mongoose = require('mongoose');
var schema = mongoose.Schema;

var employeeSchema = new schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
 
});

module.exports = mongoose.model('employee', employeeSchema);