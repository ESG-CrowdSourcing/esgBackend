var themeSchema = require('../model/theme')
var mongoose = require('mongoose')
var keySchema = require('../model/key')

exports.key = function (req, res) {
    themeSchema.findOne({ theme: req.body.theme }).exec().then(data => {
        const key = new keySchema({
            _id: new mongoose.Types.ObjectId(),
            theme: data._id,
            keyIssues: req.body.keyIssue
        }).save().then(themed => {
            return res.status(200).json({
                message: 'keyIssue is inserted',
                status: 200
            })
        });
    })
}

exports.getAllKey = (theme) => {
    return new Promise(async (resolve, reject) => {
    
        keySchema.find({ themeID: theme._id }).exec().then(data => {
            if (data.length >= 1) {
                theme.keys = data;
                resolve(theme);
            } else {
                reject;
            }
        })

    });
}