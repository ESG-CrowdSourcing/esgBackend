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

async function average(dp, companyData, y, arr) {
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
async function positive(dp, companyData, y, values, response, stdDev) {
    return new Promise(async (resolve, reject) => {
        if (stdDev == 'NA') {
            resolve('NA')

        } else {

            var avg = await average(dp, companyData, y, values);
            let positiveValue = (response - avg) / stdDev;
            // if (companyData == '60435d460e4b652b0c71b71f' && dp == 'ANTR001' ){
            //     console.log('RELiance ' , dp ,"  ", y,"  positive " , " AVErage    " , avg , "  Std devation" ,stdDev)

            // }

            resolve(positiveValue)
        }

    })
}

async function negative(dp, companyData, y, values, response, stdDev) {
    return new Promise(async (resolve, reject) => {
        if (stdDev == 'NA') {
            resolve('NA')

        } else {

            var avg = await average(dp, companyData, y, values);
            // var avg = 6482.348364

            let negativeValue = (avg - response) / stdDev
            // if (companyData == '60435d460e4b652b0c71b71f' && dp == 'ANTR001' ){
            //     console.log('RELiance ' , dp , y ,"  negative    " , " AVErage    " , avg , "  Std devation" ,stdDev)

            // }
            resolve(negativeValue)
        }
    })
}
async function companyDetails(dp, y, companyName) {
    let dpValues = []
    return new Promise(async (resolve, reject) => {
        companyName.forEach(async (companys) => {
            let dpValu = await clientData.find({ DPCode: dp, fiscalYear: y, companyName: companys }).distinct('response').exec()
            dpValues.push(dpValu[0]);
        })
        resolve(dpValues)
    })
}
exports.percentile = function (req, res) {
    return new Promise(async (resolve, reject) => {

        try {
            var NIC = req.params.NIC

            let companyName = await company.find({ NIC_Code: NIC }).distinct('_id').exec()
            let year = await clientData.find({ companyName: companyName[0] }).distinct('fiscalYear').exec()
            let dpCodes = await data.find({ percentile: 'Yes' }).distinct('DPCode').exec()
            await resValue(NIC)
            year.forEach(async (y) => {
                dpCodes.forEach(async (dp) => {
                    let dpValues = await companyDetails(dp, y, companyName)

                    companyName.forEach(async (companyData) => {
                        let polarityCheck = await data.find({ DPCode: dp, percentile: 'Yes' }).distinct('polarity').exec()
                        let response = await clientData.find({ DPCode: dp, companyName: companyData, fiscalYear: y }).distinct('response').exec();
                        // if (companyData == '60435d460e4b652b0c71b71f' && dp == 'EQUR014' ){
                        //     console.log('RELiance ' , dp ,"      ", y , "  DP VALUES ::: " , dpValues )

                        // }
                        let std = await standardDeviation(dpValues);
                        if (response[0] === 'NA' || response[0] === " ") {
                            let responseValue = { $set: { performance: 'NA' } }
                            await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()

                        } else {

                            if (polarityCheck[0] === 'Positive') {

                                let value = await positive(dp, companyData, y, dpValues, Number(response[0]), std)
                                await percentileCalc(value, dp, companyData, y)
                            }
                            else if (polarityCheck[0] === 'Negative') {

                                let value = await negative(dp, companyData, y, dpValues, Number(response[0]), std)

                                if (dp == 'BOCR012') {

                                    console.log('///////pppppppppppp ', companyData, dp, "   ", dpValues, "   ", y, "     ", std, " ")

                                }
                                await percentileCalc(value, dp, companyData, y)
                            }
                        }
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
function percentileCalc(value, dp, companyData, y) {
    return new Promise(async (resolve, reject) => {

        let percentile;
        if (y == "Fiscal Year") {

        }
        else {

            if (value === 'NA' || isNaN(value)) {

                let responseValue = { $set: { performance: 'NA' } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }
            else if (value > 4) {
                percentile = '100%'

                let responseValue = { $set: { performance: percentile } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }
            else if (value < -4) {
                percentile = '0%'

                let responseValue = { $set: { performance: percentile } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }
            else {
                let s = value.toFixed(2) + 0.01
                var lastDigit = s.toString().slice(-1);
                let v = Number(lastDigit)
                let zt = await ztable.find({ zScore: value.toFixed(1) }).exec()
                let ztValues = zt[0].values;
                let ztl = ztValues[v]
                percentile = ztl * 100

                let responseValue = { $set: { performance: percentile } }
                await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
            }

            if (dp == 'BOCR012') {
                console.log('//////////////////////////////////////// ', companyData, dp, "      ", y, "     ", value, " ", percentile)

            }
            // if (companyData == '60435c540e4b652b0c71ac61' || dp == 'COSR009') {
            //     console.log('INDIAN OIL ', dp, "      ", y, "     ", value, " ", percentile)

            // }
        }
    })
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
function polarityChec(dp, companyData, y) {
    return new Promise(async (resolve, reject) => {
        try {

            let response = await clientData.find({ DPCode: dp, companyName: companyData, fiscalYear: y }).distinct('response').exec();

            let polarityChe = await polaritySchema.find({ DPCode: dp }).exec()
            if (y == 'Fiscal Year') {

            }
            else {
                if (response[0] == 'NA' || response[0] === " ") {
                    let responseValue = { $set: { performance: 'NA', response: 'NA' } }
                    await clientData.updateOne({ DPCode: dp, companyName: companyData, fiscalYear: y }, responseValue).exec()
                }
                else {

                    // if( companyData == '60435d460e4b652b0c71b71f') {

                    //     console.log("DPCODE :"+ dp ,"YEAR : ", y,  " REsponse : " + response[0] , " value  : " +polarityChe[0].value , response[0] >= polarityChe[0].value , Number(response[0]) >= Number(polarityChe[0].value))
                    // }

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

                                if (Number(response[0]) > Number(param[0]) && Number(response[0]) < Number(param[1])) {
                                    await positivecheck(dp, companyData, y)

                                } else {
                                    await negativecheck(dp, companyData, y)
                                }

                            }
                            else if (polarityChe[0].condition == 'rangeCheck') {
                                let params = polarityChe[0].value.split(',')

                                if (Number(response[0]) < Number(params[0]) || Number(response[0]) > Number(params[1])) {
                                    await negativecheck(dp, companyData, y)

                                } else {
                                    await positivecheck(dp, companyData, y)
                                }
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
                            else if (numberCheck.finalUnit === 'Number' || numberCheck.finalUnit === 'Number (Tonne)' || numberCheck.finalUnit === 'Number (tCO2e)' || numberCheck.finalUnit === 'Currency' || numberCheck.finalUnit === 'Days' || numberCheck.finalUnit === 'Hours' || numberCheck.finalUnit === 'Miles' || numberCheck.finalUnit === 'Million Hours Worked' || numberCheck.finalUnit === 'No/Low/Medium/High/Very High' || numberCheck.finalUnit === 'Number (tCFCe)' || numberCheck.finalUnit === 'Number (Cubic meter)' || numberCheck.finalUnit === 'Number (KWh)' || numberCheck.finalUnit === 'Percentage' && polarityChecks[0] != "true" && numberCheck.signal == 'No') {

                                //     if( companyData == '60435d460e4b652b0c71b71f' && dp == 'BOIR009') {
                                //        console.log( dp, y, " ppppppppppppp " , numberCheck , response[0])
                                //    }
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