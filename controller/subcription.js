var subcriptionSchema = require('../model/subcription')
var titleSchema = require('../model/companyTitle');
var mongoose = require('mongoose')

exports.checkAndUpdateSubcription = (companyData) => {
    return new Promise(async (resolve, reject) => {
        titleSchema.find({ companyName: companyData._id, }).exec().then(titleData => {
            if (titleData.length == 1) {
                const subcription = new subcriptionSchema({
                    _id: new mongoose.Types.ObjectId(),
                    subscriptionDate: new Date(),
                    companyName: companyData.companyName,
                    subscriptionStartDate: new Date(),
                    flag: 'NCD'
                }).update().then(response => {
                    resolve(response);
                });
            } else {
                const subcription = new subcriptionSchema({
                    _id: new mongoose.Types.ObjectId(),
                    subscriptionDate: new Date(),
                    companyName: companyData.companyName,
                    subscriptionStartDate: new Date(),
                    flag: 'ECD'
                }).save().then(response => {
                    resolve(response);
                });
            }
        })

    });
}

