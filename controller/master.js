var mongoose = require('mongoose')
var masterSchema = require('../model/masterTaxonomy')

exports.master = function (req, res) {
    const master = new masterSchema({
        _id: new mongoose.Types.ObjectId(),
        companyName: "indium",
        sourceURL: "",
        sourcePublicationDate: "",
        pageNumber: "34",
        snapshot: "",
        comments: "",
        title: {
            assetID: "0123",
            companyName: "indium",
            year: "2010",
            analystName: "governance",
            completionDate: "",
            economicSector: "",
            NIC_Code: "",
            openFigiIdentifier: "",
            commonComment: "",
            QCanalyst: "",
            QCCompletionDate: ""
        }
    }).save().then(data => {
        return res.status(200).json({
            message: 'Value is inserted ',
            status: 200
        })
    });
}

