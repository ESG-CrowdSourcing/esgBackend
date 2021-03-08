var mongoose = require('mongoose');
var schema = mongoose.Schema;

var zscoreSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    zScore: {
        type: Number,
        required: true
    },
    values:{
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('ZTABLE', zscoreSchema);