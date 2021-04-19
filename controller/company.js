'use strict';
var multipleFileuploadController = require('../controller/multipleFileupload')
var category = require('../controller/category')
var data = require('../model/dpCode');
var clientData = require('../model/modelData');
var companyTitle = require('../model/companyTitle');


exports.companyDetails = async function (req, res) {

    try {
        let companyName;
        let missedDP
        for (let f = 0; f < req.files.length; f++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);
            let company = await category.companyTitle(standardData.companyArr[0]);

            for (let i = 0; i < standardData.resultArr.length; i++) {
                for (let j = 0; j < standardData.resultArr[i].length; j++) {
                    if (standardData.resultArr[i][j].Category == undefined) {

                    } else {
                        let dir = await category.getDirectives(standardData.resultArr[i][j])
                        let c = await category.fileUploadMaster(dir, company, standardData.resultArr[i][j]);
                    }
                }
            }
             missedDP = await compare(company._id);

        }


        setTimeout(function () {
            values(missedDP)
        }, 100);

        function values(missedDP) {
            return res.status(200).json({
                message: 'file upload has been completed.',
                missedDPCodes: missedDP,
                status: 200,
            });
         }


    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }

}

async function compare(companyName) {
    return new Promise(async (resolve, reject) => {
        let dpCodes = await data.find({ dataCollection: 'Yes', functions: { "$ne": 'Negative News' } }).distinct('DPCode').exec()

        let yearData = [], yearValue = {}
    let companyData=  await companyTitle.find({_id : companyName}).distinct('companyName').exec()

        let year = await clientData.find({ companyName: companyName }).distinct('fiscalYear').exec()

        year.forEach(async (y) => {

            let clientdp = await clientData.find({ companyName: companyName, fiscalYear: y }).distinct('DPCode').exec()
            let missedExcel = await compareExcel(clientdp, dpCodes)
            yearValue = {
                CompanyName:companyData[0],
                Year: y,
                MissedDPInExcel: missedExcel,
            }
            yearData.push(yearValue)
        })
        console.log(yearData)

        resolve(yearData)

    })
}


async function compareExcel(arr1, arr2) {
    return new Promise(async (resolve, reject) => {
        var res = arr2.filter(x => !arr1.includes(x));
        resolve(res);
    })

}



exports.rule = async function (req, res) {
    try {
        let standardData = await multipleFileuploadController.masterSheets(req.file.path);
        for (let i = 0; i < standardData.length; i++) {
            let c = await category.logic(standardData[i]);
        }
        return res.status(200).json({
            message: ' rule file upload has been completed.',
            status: 200,
        });

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}

exports.Ztable = async function (req, res) {
    try {
        let standardData = await multipleFileuploadController.masterSheets(req.file.path);
        for (let i = 0; i < standardData.length; i++) {
            let c = await category.Zscore(standardData[i]);
        }
        return res.status(200).json({
            message: 'percentile file upload has been completed.',
            status: 200,
        });

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}

exports.polarityCheck = async function (req, res) {
    try {
        let standardData = await multipleFileuploadController.masterSheets(req.file.path);
        console.log(standardData.length)
        for (let i = 0; i < standardData.length; i++) {
            let c = await category.polarity(standardData[i]);
        }
        return res.status(200).json({
            message: ' polarity file upload has been completed.',
            status: 200,
        });

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}
