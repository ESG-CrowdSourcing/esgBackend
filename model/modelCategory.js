var mongoose = require('mongoose');
var schema = mongoose.Schema;

var categorySchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryCode: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    }
    
 
});

module.exports = mongoose.model('Category', categorySchema);