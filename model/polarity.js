var mongoose = require('mongoose');
var schema = mongoose.Schema;

var polaritySchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    DPCode:{
        type:String,
        required:false
    },
    polarity: {
        type: String,
        required: false
    },
    condition:{
        type: String,
        required: false
    },
    value:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Polarity', polaritySchema);