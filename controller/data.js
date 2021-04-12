var dataSchema = require('../model/modelData')
var mongoose = require('mongoose')
var matrix = require('../model/dpCode')
var dpSchema = require('../model/dpCode');
const { result } = require('lodash');


exports.getDirectors = (director) => {
    return new Promise(async (resolve, reject) => {
        dataSchema.find({ directors: director.directors }).exec().then(data => {
            director.keys = data
            resolve(director)
        })
    })
}

async function file(company, derviedValues, fiscal, matrix) {
    return new Promise(async (resolve, reject) => {

        var dataValues = [], datapoints = {}, missed = [], result = []

        for (let fi = 0; fi < fiscal.length; fi++) {
            if (matrix.includes(fiscal[fi].DPCode)) {

            }
            else {
                missed.push(fiscal[fi].DPCode);
                datapoints = {
                    Year: fiscal[fi].fiscalYear,
                    DPCode: fiscal[fi].DPCode,
                    Response: fiscal[fi].response,
                    PerformanceResponse: fiscal[fi].performance,
                }
                dataValues.push(datapoints);
            }
        }
        result.push(missed)
        result.push(dataValues)
        resolve(result);
    })
}

async function compare(arr1, arr2) {
    return new Promise(async (resolve, reject) => {
        var res = arr1.filter(x => !arr2.includes(x));
        resolve(res);
    })

}
exports.getAllData = (company) => {
    var yearValues = [], yearData = {};
    return new Promise(async (resolve, reject) => {
        // let data=await dataSchema.find({keyIssuesID:keyIssues._id}).exec()
        let year = await dataSchema.find({ companyName: company }).distinct('fiscalYear')
        for (let yr = 0; yr < year.length; yr++) {

            let matrixValue = await matrix.find({ standaloneMatrix: 'Matrix' }).distinct('DPCode').exec();
            let fiscal = await dataSchema.find({ companyName: company, fiscalYear: year[yr] }).exec()

            let dpValueCheck = await dpSchema.find({ dataCollection: 'No', }).distinct('DPCode').exec();
            let f = await file(company, dpValueCheck, fiscal, matrixValue);

            yearData = {
                year: year[yr],
                Data: f[1]
            }
            await compare(dpValueCheck, f[0])
            yearValues.push(yearData)

        }
        resolve(yearValues)


    });
}

