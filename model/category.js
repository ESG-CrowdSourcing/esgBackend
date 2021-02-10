var mongoose = require('mongoose');
var schema = mongoose.Schema;

var categorySchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: {
        type: String,
        required: true
    },
    companyID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyTitle'
        },
 
});

module.exports = mongoose.model('Category', categorySchema);