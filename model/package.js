var mongoose = require('mongoose');
var schema = mongoose.Schema;

var packageSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdDate: {
        type: Date,
        default: Date.now
    },
    companyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyTitle'
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    fileData: {
        type: JSON,
        required: true
    }

});

module.exports = mongoose.model('Package', packageSchema);