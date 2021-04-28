var mongoose = require('mongoose');
var schema = mongoose.Schema;

var groupAnalystSchema = new schema({


  /*  analystName: {
        type: String
    },
    analystEmail:{
        type: String
    },*/
analystDetails:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},

    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    }
 
});

module.exports = mongoose.model('groupAnalyst', groupAnalystSchema);