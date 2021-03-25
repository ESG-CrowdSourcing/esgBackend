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
    themeCode:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('Theme', themeSchema);