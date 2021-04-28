var mongoose = require('mongoose');
var schema = mongoose.Schema;

var groupQASchema = new schema({


  /*  qaName: {
        type: String
    },
    qaEmail:{
        type: String
    },*/

    qaDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },

    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    }
 
});

module.exports = mongoose.model('groupQA', groupQASchema);