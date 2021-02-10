var mongoose = require('mongoose');
var schema = mongoose.Schema;

var themeSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    theme:{
        type:String,
        required:false
    },
    keys:{
        type:Array,
        required:false
    }
});

module.exports = mongoose.model('theme', themeSchema);