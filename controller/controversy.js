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
        for (let f = 0; f < req.files.length; f++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);

            let company = await category.companyTitle(standardData.companyArr[0]);

            var array = standardData.resultArr[0]

            // var flags = [], output = [], l = array.length, i;
            // for (i = 0; i < l; i++) {
            //     if (flags[array[i]['Fiscal Year']]) continue;
            //     flags[array[i]['Fiscal Year']] = true;
            //     output.push(array[i]['Fiscal Year']);
            // }

            // output.forEach(result => {

            //     let years = new yearSchema({
            //         year: result,
            //         companyName: company.companyName
            //     })

            //     years.save(function (err, data) {
            //         if (err) {

            //         }
            //         else {

            //         }
            //     })
            // })


            let companyValue = await companySchema.find({ companyName: company.companyName }).exec()
            if (companyValue.length < 0) {
                let compayDetails = new companySchema({
                    companyName: company.companyName,
                    CIN: company.CIN,
                    NIC_Code: company.NIC_Code,
                    ISIN_Code: company.ISIN_Code,
                    NIC_industry: company.NIC_industry,
                    CMIE_ProwessCode: company.CMIE_ProwessCode,
                    NIC_industry: company.NIC_industry
                })

                compayDetails.save(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result)
                    }
                })
            }
            // standardData.resultArr[0].forEach( async( result ) => {
            let maxResponseValue = ''
            for (let index = 0; index < standardData.resultArr[0].length; index++) {
                const result = standardData.resultArr[0][index];
                // await Promise.all(standardData.resultArr[0].map( async( result ) => {

                //   let responseCheck = await controversySchema.find({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: company.companyName })

                await controversySchema.find({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: company.companyName })
                    .then(async (data) => {

                        if (data.length > 0) {
                            const currentMaxResponse = data.maxResponse ? data.maxResponse : '';
                            let maxResponse = '';
                            let resRank = 0;
                            let resRankValue = '';

                            if (result['Response'] == 'Low') {
                                result['Response'] = 1
                                resRank = 1;
                                resRank = 'Low';
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

                            if (currentMaxResponse > resRank) {
                                maxResponse = currentMaxResponse;
                                maxResponseValue = resRankValue;
                            } else {
                                maxResponse = resRank;
                                maxResponseValue = resRankValue;
                            }

                            var update = {
                                maxResponseValue: maxResponseValue,
                                $push: {
                                    data: {
                                        // response: result['Response'],
                                        sourceName: result['Source name'],
                                        sourceURL: result.URL,
                                        Textsnippet: result['Text snippet'],
                                        sourcePublicationDate: result['Source Publication Date']
                                    }
                                }
                            }
                            await controversySchema.updateMany({ DPcode: result['DP Code'], year: result['Fiscal Year'], companyId: company.companyName }, update)
                            // .then((response) => {
                            //  console.log('update response', response);
                            // });
                        } else {
                            await controversySchema.create({

                                companyId: company.companyName,
                                year: result['Fiscal Year'],
                                DPcode: result['DP Code'],
                                unit: result['Unit'],
                                // response: result['Response'],
                                maxResponseValue: maxResponseValue,
                                data: [{
                                    sourceName: result['Source name'],
                                    Textsnippet: result['Text snippet'],
                                    sourceURL: result.URL,
                                    sourcePublicationDate: result['Source Publication Date']
                                }]

                            });
                        }
                    })
                    .catch((err) => {
                        console.log("catch block", err);
                    })

            }



            //     for (let i = 0; i < standardData.resultArr.length - 1; i++) {
            //         for (let j = 0; j < standardData.resultArr[i].length; j++) {
            //             let c = await category.fileUploadControversy(company, standardData.resultArr[i][j]);
            //         }
            //     }
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

async function file(fiscal) {
    return new Promise(async (resolve, reject) => {

        var dataValues = [], datapoints = {};
        for (let fi = 0; fi < fiscal.length; fi++) {
            if (fiscal[fi].maxResponseValue == " " || fiscal[fi].maxResponseValue == ""){
                datapoints = {
                    Year: fiscal[fi].year,
                    DPCode: fiscal[fi].DPcode,
                    Response: fiscal[fi].maxResponseValue,
                    controversy: []
                }
                dataValues.push(datapoints);
            }
            else{
                datapoints = {
                    Year: fiscal[fi].year,
                    DPCode: fiscal[fi].DPcode,
                    Response: fiscal[fi].maxResponseValue,
                    controversy: fiscal[fi].data
                }
                dataValues.push(datapoints);
            }
            
        }
        resolve(dataValues)
    })
}

exports.getControvery = async function (req, res) {

    let data = [];
    var yearValues = [], yearData = {};

    try {

        let companyName = await companySchema.find({ companyName: req.body.companyName }).exec()
      //  let year = await controversySchema.find({ companyId: req.body.companyName }).distinct('year').exec()

       // for (let yr = 0; yr < year.length; yr++) {
            let fiscal = await controversySchema.find({ companyId: companyName[0].companyName, year: req.body.year }).exec()
            let f = await file(fiscal)
            yearData = {
                year: req.body.year,
                Data: f
            }
            yearValues.push(yearData)
       // }
        return res.status(200).json({
            companyName: companyName[0].companyName,
            CIN: companyName[0].CIN,
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