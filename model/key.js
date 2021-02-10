var mongoose = require('mongoose');
var schema = mongoose.Schema;

var keySchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    themeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    keyIssues:{
        type:String,
        required:false
    },
    data:{
        type:Array,
        required:false
    }
});

module.exports = mongoose.model('Key', keySchema);