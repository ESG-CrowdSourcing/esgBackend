var category = require('../controller/category')
var multipleFileuploadController = require('../controller/multipleFileupload')
var company = require('../model/companyTitle')
var controversySchema = require('../model/modelcontroversy')
exports.controversy = async function (req, res) {

    try {
        for (let f = 0; f < req.files.length; f++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);
            let company = await category.companyTitle(standardData.companyArr[0]);
            for (let i = 0; i < standardData.resultArr.length - 1; i++) {
                for (let j = 0; j < standardData.resultArr[i].length; j++) {
                    let c = await category.fileUploadControversy(company, standardData.resultArr[i][j]);

                }
            }
        }
        return res.status(200).json({
            message: 'Controversy file upload has been completed.',
            status: 200,
        });
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}

async function file(fiscals){
    var dataValues =[], datapoints={};
    fiscals.forEach(fiscal=>{
        datapoints={
            Year:fiscal.fiscalYear,
            DPCode : fiscal.DPCode,
            Unit: fiscal.unit,
            Response:fiscal.response,
            SourceURL:fiscal.sourceURL,
            SourcePublicationDate:fiscal.sourcePublicationDate
        }
        dataValues.push(datapoints);
    })
    return dataValues
}

exports.getControvery = async function (req, res) {
    let data=[];
    try {

        let companyName = await company.find({ companyName: req.body.companyName }).exec()
        let year = await controversySchema.find({ companyName: companyName[0]._id }).distinct('fiscalYear')
        for (let yr = 0; yr < year.length; yr++) {
            let controversy = await controversySchema.find({ companyName: companyName[0]._id , fiscalYear : year[yr]}).exec()
            let fileData = await file(controversy);
            let dataValue = {
                year : year[yr],
                data: fileData
            }
            data.push(dataValue);
        }
        return res.status(200).json({
            companyName:companyName[0].companyName,
            data: data,
            status: 200,
        });
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}