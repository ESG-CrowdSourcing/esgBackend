var mongoose = require('mongoose');
var schema = mongoose.Schema;

var subcriptionSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    subscriptionDate: {
        type: Date,
        required: true
    },
    companyName: {
        type: String,
        ref: 'CompanyTitle'
    },
    subscriptionStartDate: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Subscription', subcriptionSchema);