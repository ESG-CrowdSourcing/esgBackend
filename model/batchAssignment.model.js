var mongoose = require('mongoose');
var schema = mongoose.Schema;

var batchAssignmentSchema = new schema({
    batchName: {
        type: String
    },
    companyList:[],
    batchSLA:{
        type: String
    },
    createdBy:{
        type: String
    },
    createdOn:{
        type:Date
    }
    
 
});

module.exports = mongoose.model('batchAssignment', batchAssignmentSchema);