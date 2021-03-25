var themeSchema = require('../model/modeltheme')
var mongoose = require('mongoose')
var categorySchema = require('../model/modelCategory')

exports.theme = function (req, res) {
    categorySchema.findOne({ category: req.body.category }).exec().then(data => {
        const theme = new themeSchema({
            _id: new mongoose.Types.ObjectId(),
            categoryID: data._id,
            theme: req.body.theme
        }).save().then(categoryd => {
            return res.status(200).json({
                message: 'theme is inserted',
                status: 200
            })
        });
    })
}

exports.getAllTheme = (category) => {
    return new Promise(async (resolve, reject) => {
        themeSchema.find({ categoryID: category._id }).exec().then(data => {
            if (data.length >= 1) {
                category.themes = data;
                resolve(category);
            }
            else {
                reject;
            }
        })
    });
}

exports.getNewAllTheme = (category) => {
    return new Promise(async (resolve, reject) => {
        themeSchema.find({ categoryID: category._id }).exec().then(data => {
            if (data.length >= 1) {
                category.themes = data;
                resolve(category);
            }
            else {
                reject;
            }
        })
    });
}


