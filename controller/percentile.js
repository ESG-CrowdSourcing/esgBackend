var company = require('../model/companyTitle');
var data = require('../model/dpCode');
var clientData = require('../model/data');
const { isNumber } = require('lodash');
var ztable = require('../model/zTable')
var zscoreCal = require('ztable');
const dpCode = require('../model/dpCode');
const { response } = require('express');
var polaritySchema = require('../model/polarity')
var debug = require('debug')

async function average(arr) {
    return new Promise(async (resolve, reject) => {
        try {
            let Arr = arr.filter(e => String(e).trim());
            let rr = Arr.filter(e => e != 'NA');
            let a = rr.filter(Boolean)
            let result = a.map(i => Number(i));

            if (result.length > 0) {
                var value = result.reduce((a, x) => a + x)
                let avg = value / result.length
                resolve(avg)
            }
            else {
                resolve(0)
            }
        }
        catch (error) {
            reject(error)

        }

    })
}
async function standardDeviation(value) {
    return new Promise(async (resolve, reject) => {

        // var avg = await average(value);
        let Arr = value.filter(e => String(e).trim());
        let values = Arr.filter(e => e != 'NA');
        let result = values.map(i => Number(i));

        const n = result.length
        if (n > 1) {
            const mean = result.reduce((a, x) => a + x) / n
            let stdDev = Math.sqrt(result.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1))
            resolve(stdDev)
        }
        else {
            resolve('NA')
        }
    })
}
async function positive(values ,response, stdDev) {
    return new Promise(async (resolve, reject) => {
        if (stdDev == 'NA') {
            resolve('NA')

        } else {

            var avg = await average(values);
            let positiveValue = (response - avg) / stdDev;
            var avg = 6482.348364

            resolve(positiveValue)
        }

    })
}

async function negative(values,response, stdDev) {
    return new Promise(async (resolve, reject) => {
        if (stdDev == 'NA') {
            resolve('NA')

        } else {

            var avg = await average(values);
            // var avg = 6482.348364

            let negativeValue = (avg - response) / stdDev
            resolve(negativeValue)
        }
    })
}
exports.percentile = function (req, res) {
    return new Promise(async (resolve, reject) => {

        try {
            var NIC = req.params.NIC
            let companyName = await company.find({ NIC_Code: NIC }).distinct('_id').exec()
            let year = await clientData.find({ companyName: companyName[0] }).distinct('fiscalYear').exec()
            let dpCodes = await data.find({ percentile: 'Yes' }).distinct('DPCode').exec()
            //  await resValue(NIC)
            year.forEach(async (y) => {
                dpCodes.forEach(async (dp) => {
                    companyName.forEach(async (companyData) => {
                        percentileCalc(dp, companyData, y)
                        //percentileCalc(14484.09232, 'MACR004', '60435d460e4b652b0c71b71f', '2019-2020')

                    })

                });
            })

            setTimeout(() => {
                 return res.status(200).json({
                     message: "percentile calculated",
                 })
               }, 81500)

        } catch (error) {
            return res.status(405).json({
                message: error.message
            })
        }
    })

}

async function percentileCalc(dp, companyData, y) {
    let percentile;
    let dpValues = await clientData.find({ DPCode: dp, fiscalYear: y }).distinct('response').exec()
    let std = await standardDeviation(dpValues);
    let polarityCheck = await data.find({ DPCode: dp, percentile: 'Yes' }).distinct('polarity').exec()
    let response = await clientData.find({ DPCode: dp, companyName: companyData, fiscalYear: y }).distinct('response').exec();
    if (response[0] === 'NA' || response[0] === " ") {
        let responseValue = { $set: { performance: 'NA' } }
        await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()

    } else {

        if (polarityCheck[0] === 'Positive') {

            let value = await positive(dpValues, Number(response[0]), std)

            if (value == 'NA' || value == 'NaN') {

                let responseValue = { $set: { performance: 'NA' } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }
            else if (value > 4) {
                percentile = '100%'
            }
            else if (value < -4) {
                percentile = '0%'
            }
            else {

                let s = value.toFixed(2) + 0.01
                var lastDigit = s.toString().slice(-1);
                let v = Number(lastDigit)
                let zt = await ztable.find({ zScore: value.toFixed(1) }).exec()
                let ztValues = zt[0].values;
                let ztl = ztValues[v]
                percentile = ztl * 100
            }
            //console.log("DP : ", dp, "Response : ", response[0], "Zscore : ", value, "Percentile : ", percentile)

            let responseValue = { $set: { performance: percentile } }
            await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
        }
        else if (polarityCheck[0] === 'Negative') {

            let value = await negative(dpValues,Number(response[0]), std)
            if (value == 'NA') {

                let responseValue = { $set: { performance: 'NA' } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }
            else if (value > 4) {
                percentile = '100%'
            }
            else if (value < -4) {

                percentile = '0%'
            }
            else {
                let s = value.toFixed(2) + 0.01
                var lastDigit = s.toString().slice(-1);
                let v = Number(lastDigit)
                let zt = await ztable.find({ zScore: value.toFixed(1) }).exec()
                let ztValues = zt[0].values;
                let ztl = ztValues[v]
                percentile = ztl * 100
            }
          // console.log("DP : ", dp, "Response : ", response[0], "Zscore : ", value, "Percentile : ", percentile)
            let responseValue = { $set: { performance: percentile } }

            await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
        }
    }

}

async function positivecheck(dp, companyData, y) {
    return new Promise(async (resolve, reject) => {
        let responseValue = { $set: { performance: 'Positive' } }
        await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
        resolve('updated')

    })

}

async function negativecheck(dp, companyData, y) {
    return new Promise(async (resolve, reject) => {

        let responseValue = { $set: { performance: 'Negative' } }
        await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
        resolve('updated')

    })
}

async function inRange(x, min, max) {
    return new Promise(async (resolve, reject) => {
        resolve((x - min) * (x - max) <= 0);
    })
}
async function polarityChec(dp, companyData, y) {
    return new Promise(async (resolve, reject) => {
        try {

            let response = await clientData.find({ DPCode: dp, companyName: companyData, fiscalYear: y }).distinct('response').exec();

            let polarityChe = await polaritySchema.find({ DPCode: dp }).exec()
            if (response[0] == 'NA' || response[0] === " ") {
                let responseValue = { $set: { performance: 'NA', response: 'NA' } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }
            else {
                //  console.log(dp === 'ESGP003' , dp === 'BOSR007' , dp === 'ESGP003' && dp === 'BOSR007')

                if (polarityChe.length >= 1) {
                    if (Number(response[0]) >= Number(polarityChe[0].value)) {

                        if (polarityChe[0].condition == 'greater' || polarityChe[0].condition == 'atleast' || polarityChe[0].condition == 'lesserthan') {
                            await positivecheck(dp, companyData, y)

                        }
                        else if (polarityChe[0].condition == 'greaterthan' || polarityChe[0].condition == 'lesser') {

                            await negativecheck(dp, companyData, y)


                        }
                    }
                    else if (Number(response[0]) <= Number(polarityChe[0].value)) {

                        if (polarityChe[0].condition == 'greater' || polarityChe[0].condition == 'lesserthan' || polarityChe[0].condition == 'atleast') {

                            await negativecheck(dp, companyData, y)

                        }
                        else if (polarityChe[0].condition == 'greaterthan' || polarityChe[0].condition == 'lesser') {

                            await positivecheck(dp, companyData, y)

                        }
                    }
                    else {
                        if (polarityChe[0].condition == 'range') {

                            let param = polarityChe[0].value.split(',');
                            let bool = await inRange(Number(response[0]), Number(param[0]), Number(param[1]))
                            if (bool) {

                                await positivecheck(dp, companyData, y)

                            } else {
                                await negativecheck(dp, companyData, y)
                            }

                        }
                        else if (polarityChe[0].condition == 'rangeCheck') {
                            let params = polarityChe[0].value.split(',')

                            if (response[0] < params[0] || response[0] > params[1]) {
                                await negativecheck(dp, companyData, y)

                            } else {
                                await positivecheck(dp, companyData, y)
                            }
                        }
                    }
                }
            }


            resolve('updated')
        } catch (error) {
            reject(error)
        }
    })

}
function resValue(NIC) {
    return new Promise(async (resolve, reject) => {
        try {
            let companyName = await company.find({ NIC_Code: NIC }).distinct('_id').exec()
            let year = await clientData.find({ companyName: companyName[0] }).distinct('fiscalYear').exec()
            let dpCodes = await data.find({}).distinct('DPCode').exec()
            year.forEach(async (y) => {
                dpCodes.forEach(async (dp) => {
                    let polarityCheck = await data.find({ DPCode: dp }).distinct('polarity').exec()
                    let polarityChecks = await data.find({ DPCode: dp }).distinct('polarityCheck').exec()
                    let numberCheck = await data.findOne({ DPCode: dp }).exec()
                    companyName.forEach(async (companyData) => {

                        if (polarityChecks[0] == "true") {


                            await polarityChec(dp, companyData, y)
                        }
                        else {
                            let response = await clientData.find({ DPCode: dp, companyName: companyData, fiscalYear: y }).distinct('response').exec();
                            if (response[0] === 'Y' || response[0] == 'y') {
                                if (polarityCheck[0] === 'Negative') {
                                    let responseValue = { $set: { performance: 'N' } }
                                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                }
                                else if (polarityCheck[0] === 'Positive') {
                                    let responseValue = { $set: { performance: 'Y' } }
                                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                }
                                else if (polarityCheck[0] === 'Neutral') {
                                    let responseValue = { $set: { performance: 'NA' } }
                                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                }
                            }
                            else if (response[0] === 'N') {
                                if (polarityCheck[0] === 'Negative') {
                                    let responseValue = { $set: { performance: 'Y' } }
                                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                }
                                else if (polarityCheck[0] === 'Positive') {
                                    let responseValue = { $set: { performance: 'N' } }
                                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                }
                                else if (polarityCheck[0] === 'Neutral') {
                                    let responseValue = { $set: { performance: 'NA' } }
                                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                }

                            }
                            else if (response[0] == 'NA' || response[0] === " ") {
                                // if (polarityCheck[0] === 'Positive' || polarityCheck[0] === 'Negative' || polarityCheck[0] === 'Neutral') {
                                let responseValue = { $set: { performance: 'NA', response: 'NA' } }
                                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                                // }
                            }
                            else if (numberCheck.finalUnit === 'Number' || numberCheck.finalUnit === 'Number (Tonne)' || numberCheck.finalUnit === 'Number (tCO2e)' || numberCheck.finalUnit === 'Currency' || numberCheck.finalUnit === 'Days' || numberCheck.finalUnit === 'Hours' || numberCheck.finalUnit === 'Miles' || numberCheck.finalUnit === 'Million Hours Worked' || numberCheck.finalUnit === 'No/Low/Medium/High/Very High' || numberCheck.finalUnit === 'Number (tCFCe)' || numberCheck.finalUnit === 'Number (Cubic meter)' || numberCheck.finalUnit === 'Number (KWh)' || numberCheck.finalUnit === 'Percentage' && polarityChecks[0] != "true" && numberCheck.finalUnit != 'Percentile') {
                                let responseValue = { $set: { performance: response[0] } }
                                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()

                            }
                        }
                    })
                });
            })
            resolve('updated')
        } catch (error) {
            reject(error)
        }
    });
}