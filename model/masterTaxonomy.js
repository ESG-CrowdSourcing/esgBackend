var mongoose = require('mongoose');
var schema = mongoose.Schema;

var masterSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    dataID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data'
    },
    sourceName:{type: String,
        required:false},
    sourceURL:{
        type: String,
        required:false
    },
    sourcePublicationDate:{
        type: String,
        required:false
    },
    pageNumber:{
        type: String,
        required:false
    },
    snapshot:{
        type: String,
        required:false
    },
    comments:{
        type: String,
        required:false
    },
    
});

module.exports = mongoose.model('MasterTaxonomy', masterSchema);