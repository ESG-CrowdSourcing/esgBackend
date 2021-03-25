var category = require('../controller/category')
var categorySchema = require('../model/modelCategory')
var theameController = require('../controller/theme')
var keyController = require('../controller/keyIssues')
var dataController = require('../controller/data')
var multipleFileuploadController = require('../controller/multipleFileupload')
var subcriptionController = require('../controller/subcription')

var titleSchema = require('../model/companyTitle');
var masterSchema = require('../model/modelMaster')
var packageSchema = require('../model/package')
var mongoose = require('mongoose');
var _ = require('lodash');

// Taxonomy file upload method
exports.masterFileLoad = async function (req, res) {
    try {
        for (let fi = 0; fi < req.files.length; fi++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[fi].path);
            for (let i = 0; i < standardData.companyArr.length; i++) {
                let company = await category.companyTitle(standardData.companyArr[i]);
                for (let j = 0; j < standardData.resultArr.length; j++) {
                    
                    for (let i = 0; i < standardData.resultArr[j].length; i++) {
                        let catagoty = await category.fileUploadCategory(standardData.companyArr[0], standardData.resultArr[j][i]);
                        let dir = await category.getDirectives(standardData.resultArr[j][i])

                        if (dir.length != 0) {
                            let directive = await category.directive(dir, company);
                            if (catagoty.category != null) {
                                let keyIssue = await category.fileUploadKeyIssue(standardData.resultArr[j][i]);
                                if (keyIssue.keyIssues) {
                                    let master = await category.fileUploadMaster(standardData.companyArr[0],dir, standardData.resultArr[j][i]);
                                    if (master.DPCode) {
                                        let taxonomy = await category.masterTaxonomy(standardData.resultArr[j][i]);
                                    }
                                }
                            }

                        }
                        else {

                            if (catagoty.category != null) {
                                let keyIssue = await category.fileUploadKeyIssue(standardData.resultArr[j][i]);
                                if (keyIssue.keyIssues) {
                                    let master = await category.fileUploadMaster(standardData.companyArr[0],dir, standardData.resultArr[j][i]);
                                    if (master.DPCode) {
                                        let taxonomy = await category.masterTaxonomy(standardData.resultArr[j][i]);
                                    }
                                }
                            }
                        }
                    }
                }

                let subcription = await subcriptionController.checkAndUpdateSubcription(company);

            }
        }
        return res.status(200).json({
            message: 'Master file upload has been completed.',
            status: 200,
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            status: 404
        })
    }

}

// Taxonomy fetch new company new data method
exports.fetchNewCompanynewData = async function (req, res) {
    var companyName = req.params.companyName;
    let titleData = await titleSchema.find({ companyName: companyName });
    let package = await packageSchema.find({ companyName: titleData[0]._id });
    return res.status(200).json({
        message: package,
        message: "Success.",
        status: 200,
        data: package

    })
}

// Taxonomy fetch xxising company data method
exports.fetchExisingCompanyData = async function (req, res) {
    var companyName = req.params.companyName;
    let titleData = await titleSchema.find({ companyName: companyName });
    let subscriptionDate = await subscriptionSchema.find({ companyName: titleData[0]._id, flag: req.body.flag })
    let package = await packageSchema.find({ companyName: titleData[0]._id });
    return res.status(200).json({
        message: package,
        message: "Success.",
        status: 200,
        data: package

    })
}

// Store package data
exports.package = async function (req, res) {
    try {
        let companyData = await titleSchema.find({ companyName: req.params.companyName })
        let masterData = await masterSchema.find({ companyName: companyData[0]._id });
        let catagotyData = await categorySchema.find({ companyID: companyData[0]._id });
        for (let i = 0; i < catagotyData.length; i++) {
            let themeData = await theameController.getAllTheme(catagotyData[i]);
            for (let j = 0; j < themeData.themes.length; j++) {
                let keysData = await keyController.getAllKey(themeData.themes[j]);
                for (let k = 0; k < keysData.keys.length; k++) {
                    let dataVal = await dataController.getAllData(keysData.keys[k]);
                }
            }
        }
        var data = {

            masterTaxonomy: masterData[0],
            Category: catagotyData
        }
        // console.log(companyData[0].id)
        var package = new packageSchema({
            _id: new mongoose.Types.ObjectId(),
            createdDate: Date.now(),
            updatedDate: Date.now(),
            fileData: data,
            companyName: companyData[0]._id
        }).save().then(data => {
            return res.status(200).json({ message: 'Success.', status: 200 })
        })
    } catch (error) {
        return error;
    }

}

exports.getAllCompany = async function (req, res) {
    try {
        await titleSchema.find({}).distinct('companyName').then(companyData => {
            if (companyData.length > 0) {
                return res.status(200).json({
                    message: 'Success.', status: 200, data: companyData
                })
            }
            else {
                return res.status(400).json({
                    message: 'company not found ', status: 400
                })
            }
        })
    } catch (error) {
        console.log('error=====>', error);
        return error;

    }
}

exports.getAllNIC = async function (req, res) {
    try {
        await titleSchema.find({}).distinct('NIC_Code').then(nic => {
            if (nic.length > 0) {
                return res.status(200).json({
                    message: 'Success.', status: 200, data: nic
                })
            }
            else {
                return res.status(400).json({
                    message: 'NIC code not found ', status: 400
                })
            }
        })
    } catch (error) {
        console.log('error=====>', error);
        return error;

    }
}


// Fetch new company data
exports.getNewData = async function (req, res) {
    try {
        let companyData = await titleSchema.find({ companyName: req.params.companyName })
        let result = []
    
                let dataVal = await dataController.getAllData(companyData[0]._id);
                result.push(dataVal);
                return res.status(200).json({
                    message: 'Success.', status: 200, data: {
                        companyName: companyData[0].companyName,
                        companyID: companyData[0].CIN,
                        NIC_CODE: companyData[0].NIC_Code,
                        NIC_industry: companyData[0].NIC_industry,
                        fiscalYear: result
                    }
                })
              
    } catch (error) {
        console.log('error=====>', error);
        return error;

    }


}



exports.getNewDataDir = async function (req, res) {
    try {
        let companyData = await titleSchema.find({ companyName: req.params.companyName })
        let result = [], dirName = {}, dirVal = [];
        let directiveData = await category.getAllDirectives(companyData[0]);

        for (let i = 0; i < directiveData.directors.length; i++) {
            let keysData = await dataController.getDirectors(directiveData.directors[i]);
            for (let k = 0; k < keysData.keys.length; k++) {

                let dataVal = await dataController.getAllData(keysData.keys[k]);
                result.push(dataVal);
            }
            dirName = {
                directive: directiveData.directors[i].directors,
                data: result
            }

            dirVal.push(dirName)


        }
        var re = res.status(200).json({
            message: 'Success.', status: 200, data: {
                companyName: companyData[0].companyName,
                companyID: companyData[0].CIN,
                NIC_CODE: companyData[0].NIC_Code,
                NIC_industry: companyData[0].NIC_industry,
                directors: dirVal
            }
        })

        return re;


    } catch (error) {
        console.log('error=====>', error);
        return error;

    }


} 