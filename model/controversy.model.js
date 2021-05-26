var mongoose = require('mongoose');
var schema = mongoose.Schema;
const shortid = require('shortid');

var subsSchema = new schema({
    controversyId: {
        type: String,
        default: shortid.generate
    },

    sourceURL: {
        type: String
    },
    sourcePublicationDate: {
        type: String
    },
    sourceName: {
        type: String
    },
    Textsnippet: {
        type: String
    }
}, { _id: 0 })

var controversySchema = new schema({

    data: [subsSchema],
    maxResponseValue: {
        type: String
    },
    year: {
        type: String
    },
    DPcode: {
        type: String
    },
    unit: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyTitle'
    },
    submittedDate: {
        type: String
    },
    submittedDate: {
        type: Date, default: Date.now
    },
    activeSatus: {
        type: String,
        default: 'active'
    },
    lastModifiedBy: {
        type: String
    },
    lastModifiedDate: {
        type: Date, default: Date.now
    },



});

module.exports = mongoose.model('controversy', controversySchema);