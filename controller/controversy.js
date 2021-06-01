var category = require('../controller/category')
var multipleFileuploadController = require('../controller/multipleFileupload')
var companySchema = require('../model/companyTitle')
var yearSchema = require('../model/year.model')
var controversySchema = require('../model/controversy.model')
const { result } = require('lodash')
const { find, populate, db } = require('../model/companyTitle')
//const controversy = require('../model/controversy')

exports.controversy = async function (req, res) {
    try {
        let companyID ;
        for (let f = 0; f < req.files.length; f++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);
            let company = await category.companyTitle(standardData.companyArr[0]);
            let companyValue = await companySchema.find({ companyName: company.companyName }).exec()
            if (companyValue.length < 0) {
                companySchema.create({
                    companyName: company.companyName,
                    CIN: company.CIN,
                    NIC_Code: company.NIC_Code,
                    ISIN_Code: company.ISIN_Code,
                    NIC_industry: company.NIC_industry,
                    CMIE_ProwessCode: company.CMIE_ProwessCode,
                    NIC_industry: company.NIC_industry
                })
            }
            else {
                var update = {
                    $set: {
                        companyName: company.companyName,
                        CIN: company.CIN,
                        NIC_Code: company.NIC_Code,
                        ISIN_Code: company.ISIN_Code,
                        NIC_industry: company.NIC_industry,
                        CMIE_ProwessCode: company.CMIE_ProwessCode,
                        NIC_industry: company.NIC_industry
                    }
                }
                await companySchema.updateOne({ companyName: company.companyName, CIN: company.CIN }, update)
            }
            // standardData.resultArr[0].forEach( async( result ) => {
            companyID = await companySchema.find({ companyName: company.companyName }).exec()

            for (let index = 0; index < standardData.resultArr[0].length; index++) {

                const result = standardData.resultArr[0][index];
                // await Promise.all(standardData.resultArr[0].map( async( result ) => {

                //   let responseCheck = await controversySchema.find({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: company.companyName })

                await controversySchema.find({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: companyID[0]._id })
                    .then(async (data) => {
                        var dateValue = result['Source Publication Date']


                        if (data.length > 0) {
                            let maxResponseValue = ''

                            const currentMaxResponse = data.maxResponseValue ? data.maxResponseValue : ' ';
                            let maxResponse = '';
                            let resRank = 0;
                            let resRankValue = '';

                            if (result['Response'] == 'Low') {
                                result['Response'] = 1
                                resRank = 1;
                                resRankValue = 'Low';
                            }
                            else if (result['Response'] == 'Medium') {
                                result['Response'] = 2
                                resRank = 2;
                                resRankValue = 'Medium';
                            }
                            else if (result['Response'] == 'High') {
                                result['Response'] = 3
                                resRank = 3;
                                resRankValue = 'High';
                            }
                            else if (result['Response'] == 'Very high') {
                                result['Response'] = 4
                                resRank = 4;
                                resRankValue = 'Very high';
                            }
                            else {
                                result['Response'] = 0
                                resRank = 0;
                                resRankValue = '';
                            }

                            if (result['DP Code'] == 'DATN001') {
                                console.log(" .............gggggghhhhh ", result['Response'], currentMaxResponse, resRankValue, maxResponseValue)
                            }
                            if (currentMaxResponse > resRank) {
                                maxResponse = currentMaxResponse;
                                maxResponseValue = resRankValue;
                            } else {
                                maxResponse = resRank;
                                maxResponseValue = resRankValue;
                            }

                            if (maxResponse != 0) {
                                var sourcePublicationDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000)).toLocaleDateString()
                                let sourceDate = await controversySchema.find({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: companyID[0]._id, data: { $elemMatch: { sourcePublicationDate: sourcePublicationDate } } })
                                console.log(" ............ ", sourceDate.length, sourcePublicationDate)
                                if (sourceDate.length < 1) {
                                    var update = {
                                        maxResponseValue: maxResponseValue,
                                        $push: {
                                            data: {
                                                // response: result['Response'],
                                                sourceName: result['Source name'],
                                                sourceURL: result.URL,
                                                Textsnippet: result['Text snippet'],
                                                sourcePublicationDate: sourcePublicationDate

                                            }
                                        }
                                    }
                                    await controversySchema.updateMany({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: companyID[0]._id }, update)
                                }

                            }
                            else {
                                var update = {
                                    maxResponseValue: maxResponseValue,
                                    $push: {
                                        data: []
                                    }
                                }
                                await controversySchema.updateMany({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: companyID }, update)

                            }
                        } else {

                            if (result['Source name'] == " " || result['Source name'] == "") {
                                await controversySchema.create({

                                    companyId: companyID[0]._id,
                                    year: result['Fiscal Year'],
                                    DPcode: result['DP Code'],
                                    unit: result['Unit'],
                                    // response: result['Response'],
                                    maxResponseValue: result['Response'],
                                    data: []

                                });
                            }
                            else {
                                var sourcePublicationDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000)).toLocaleDateString()
                                // console.log("//////",dateValue  , new Date(Math.round((dateValue - 25569)*86400*1000)).toLocaleDateString())

                                await controversySchema.create({

                                    companyId: companyID[0]._id,
                                    year: result['Fiscal Year'],
                                    DPcode: result['DP Code'],
                                    unit: result['Unit'],
                                    // response: result['Response'],
                                    maxResponseValue: result['Response'],
                                    data: [{
                                        sourceName: result['Source name'],
                                        Textsnippet: result['Text snippet'],
                                        sourceURL: result.URL,
                                        sourcePublicationDate: sourcePublicationDate
                                    }]

                                });
                            }
                        }
                    })
                    .catch((err) => {
                        console.log("catch block", err);
                    })

            }

        }

        return res.status(200).json({
            message: 'Controversy file upload has been completed.',
            companyID: companyID[0]._id,
            status: 200,
        });
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}

async function file(fiscal) {
    return new Promise(async (resolve, reject) => {

        var dataValues = [], datapoints = {};
        for (let fi = 0; fi < fiscal.length; fi++) {            
            datapoints = {
                Dpcode: fiscal[fi].DPcode,
                Year: fiscal[fi].year,
                ResponseUnit: fiscal[fi].maxResponseValue,
                controversy: fiscal[fi].data
            }
            dataValues.push(datapoints);

        }
        resolve(dataValues)
    })
}

exports.getControvery = async function (req, res) {
    var yearValues = [], yearData = {};
    try {

        let companyDetails = await companySchema.find({ _id: req.params.companyID }).exec()
        let year = await controversySchema.find({ companyId: req.params.companyID }).distinct('year').exec()
        
        for (let yr = 0; yr < year.length; yr++) {
        let fiscal = await controversySchema.find({ companyId: req.params.companyID, year: year[yr] }).exec()
        let f = await file(fiscal)
          yearData = {
               year: year[yr],
              companyName:companyDetails[0].companyName,
               Data: f
           }
           yearValues.push(yearData)
           
         }
        return res.status(200).json({
            data: yearValues,
            status: 200,
        });
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}
