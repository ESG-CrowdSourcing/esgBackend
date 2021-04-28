var mongoose = require('mongoose');
var schema = mongoose.Schema;

var groupSchema = new schema({

    groupName: {
        type: String
    },
    batchId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'batchAssignment'
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
 
});

module.exports = mongoose.model('group', groupSchema);