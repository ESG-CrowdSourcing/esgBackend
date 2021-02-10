
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var prodSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    Category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterTaxonomy'
    },
    Theme:{type:String},
    KeyIssues:{type:String,},
    Function:{type:String},
    IndicatorID:{type:String},
    IndicatorName:{type:String},
    IndicatorDescription:{type:String},
    Unit:{type:String},
    DataInput:{type:String},
    SourceURL:{type:String},
    PageNumber:{type:String},
    Signal:{type:String},
    snippet:{type:String}

});

module.exports = mongoose.model('production', prodSchema);