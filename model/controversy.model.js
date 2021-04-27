var mongoose = require('mongoose');
var schema = mongoose.Schema;
const shortid = require('shortid');

var subsSchema=new schema({
    controversyId:{
        type: String,
  default: shortid.generate
    },
    
    sourceURL:{
        type: String
    },
    sourcePublicationDate:{
        type: String
    },
    sourceName:{
        type: String
    },
},{_id:0})

var controversySchema = new schema({
   
    data:[subsSchema],
    year: {
        type: String
    },
    DPcode:{
        type: String
    },
    unit:{
        type: String
    },
    response:{
        type: Number
    },
    companyId:{
        type: String
    },
    submittedDate:{
        type: String
    },
    submittedDate:{
        type: Date, default: Date.now
    },
    activeSatus:{
        type: String,
        default:'active'
    },
    lastModifiedBy:{
        type: String
    },
    lastModifiedDate:{
        type: Date, default: Date.now
    },
    Textsnippet:{
        type: String
    }
    
 
});

module.exports = mongoose.model('controversy', controversySchema);