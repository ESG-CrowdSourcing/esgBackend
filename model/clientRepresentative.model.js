var mongoose = require('mongoose');
var schema = mongoose.Schema

const clientRepresentativeSchema = new schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    created_By : {
        type : String,
        required : false
    },
    created_Date : {
        type : Date,
        default : Date.now
    }
});
module.exports = mongoose.model("ClientRep",clientRepresentativeSchema);