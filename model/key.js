var mongoose = require('mongoose');
var schema = mongoose.Schema;

var keySchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    themeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme'
    },
    keyIssues:{
        type:String,
        required:false
    },
    keyIssuesCode:{
        type:String,
        required:false
    },
    function:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('KeyIssues', keySchema);