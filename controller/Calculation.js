var clientData = require('../model/data')
var companytitle = require('../model/companyTitle')
var rule = require('../model/rule');
const { updateOne } = require('../model/data');
const { response } = require('express');
const { values } = require('lodash');
// debugger
async function ratio(Num, Den) {
    return new Promise(async (resolve, reject) => {
        var value;
        try {
            if (Num === " " || Num == 'Y' || Num == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else if (Num == 0) {
                value = 0
                resolve(value)
            }
            else if (Den == 0 || Den == 'Y' || Den == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else {
                var num = Number(Num), den = Number(Den)

                value = num / den;
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }
    })
}

async function minus(Num, Den) {
    return new Promise(async (resolve, reject) => {
        var value;
        try {
            if (Num === " " || Num == 'NA' || Num == 'N') {
                value = 'NA'
                resolve(value)
            }
            else if (Num == 0) {
                value = 0
                resolve(value)
            }
            else if (Den == 0 || Den == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else {
                var num = Number(Num), den = Number(Den)

                value = num - den;
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }
    })
}
async function percent(Num, Den) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Num === " " || Num == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else if (Num == 0) {
                value = 0
                resolve(value)
            }
            else if (Den == 0 || Den == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else {
                var num = Number(Num), den = Number(Den)
                var value = (num / den) * 100
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }

    })
}

async function add(Num1, Num2) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Num1 == 'NA' || Num2 == 'NA') {
                resolve('NA')
            }
            else {
                var value = Num1 + Num2
                resolve(value)
            }
        } catch (err) {
            reject(err)
        }

    })
}

async function multiply(Num, Den) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Num === " " || Den == 0 || Den == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else if (Num == 0) {
                value = 0
                resolve(value)
            }
            else {
                var num = Number(Num), den = Number(Den)
                var value = (num / den) * 2000 * 1000000
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }

    })
}
async function sumCount(arr) {
    return new Promise(async (resolve, reject) => {
        let arrValue = []
        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                let a = arr.filter(e => String(e).trim());
                let Arr = a.map(i => Number(i));
                if (Arr.length > 0) {
                    var value = Arr.reduce((a, x) => a + x)
                    arrValue.push(value)
                    var length = Arr.length
                    arrValue.push(length)
                    resolve(arrValue)
                }
                else {
                    resolve('NA')
                }
            }
        } catch (error) {
            reject(error)

        }

    })
}

async function sum(arr) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!Array.isArray(arr)) {
                console.log(" value is 0")
            }
            else {
                let a = arr.filter(e => String(e).trim());
                let Arr = a.map(i => Number(i));
                if (Arr.length > 0) {
                    var value = Arr.reduce((a, x) => a + x)
                    resolve(value)
                }
                else {
                    resolve('NA')
                }
            }
        } catch (error) {
            reject(error)

        }

    })

}

async function compositeCount(arr1, arr2, criteria) {
    return new Promise(async (resolve, reject) => {
        let count = 0;
        try {
            for (let i = 0; i < arr1.length; i++) {

                if (arr1[i] == criteria && arr2[i] == criteria) {
                    count++
                }

            }
            resolve(count)


        } catch (error) { reject(error) }
    })
}

async function count(arr, criteria) {
    return new Promise(async (resolve, reject) => {
        let Arr = arr.filter(e => String(e).trim());

        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                if (criteria == '0.02') {
                    if (Arr.length > 0) {
                        var value = Arr.filter(item => item >= criteria).length;
                        resolve(value)
                    }
                    else {
                        resolve('NA')
                    }
                }
                else if (criteria == 'D') {
                    if (Arr.length > 0) {
                        var value = Arr.length;
                        resolve(value)
                    }
                    else {
                        resolve('NA')
                    }
                }
                else {
                    if (Arr.length > 0) {
                        var value = Arr.filter(item => item === criteria).length;
                        resolve(value)
                    }
                    else {
                        resolve('NA')
                    }
                }
            }
        } catch (error) {
            reject(error)

        }

    })
}


async function compare(arr1, arr2) {
    return new Promise(async (resolve, reject) => {

        const dpcode = [];

        arr1.forEach((e1) => arr2.forEach((e2) => {
            if (e1 === e2) {
                dpcode.push(e1);
            }
        }
        ));
        resolve(dpcode)
    })
}
async function sumMethod(company, year, value, dpcode) {
    return new Promise(async (resolve, reject) => {
        let sumValue;
        let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: value }).exec();
        if (arr.length === 0) {
            sumValue = 0;
        } else {
            sumValue = await sum(arr[0].directors)
        }
        let update = { $set: { response: sumValue } }
        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: dpcode }, update).exec();
        resolve('success')
    })
}

async function Percentage(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {

        let params = ruleValue[0].parameter.split(',')
        let checknum = await rule.find({ DPCode: params[0] }).exec();
        let checkDen = await rule.find({ DPCode: params[1] }).exec();


        if (checknum.length > 0) {
            if (checknum[0].methodName == 'Sum' || checknum[0].methodName == 'sum') {
                let numparams = checknum[0].parameter.split(',')
                await sumMethod(company, year, numparams[0], checknum[0].DPCode);
            }
            else if (checknum[0].methodName == 'count of') {
                let numparams = checknum[0].parameter.split(',')
                await Countof(checknum, company, year, numparams[0], checknum[0].DPCode);
            }
        }
        else if (checkDen.length > 0) {
            if (checkDen[0].methodName == 'Sum' || checkDen[0].methodName == 'sum') {
                let numparams = checkDen[0].parameter.split(',')
                await sumMethod(company, year, numparams[0], checkDen[0].DPCode);
            }
            else if (checkDen[0].methodName == 'count of') {
                let numparams = checkDen[0].parameter.split(',')
                await Countof(checkDen, company, year, numparams[0], checkDen[0].DPCode);
            }
        }
        let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).distinct('response').exec();
        let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).distinct('response').exec();
        let response = await percent(num[0], Den[0])

        let update = { $set: { response: response } }
        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
        resolve('updated')

    })
}

async function Countof(ruleValue, company, year, numparams, value) {
    return new Promise(async (resolve, reject) => {

        if (ruleValue[0].methodType == 'composite') {
            let total = 0;
            let params = ruleValue[0].parameter.split(',')
            if (params.length == 2) {
                let arr1 = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).exec();
                let arr2 = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).exec();

                let response = await compositeCount(arr1[0].directors, arr2[0].directors, ruleValue[0].criteria)

                // console.log("DPCoDE : ", value, " year : ", year, " response : ", response)

                let update = { $set: { response: response } }
                await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();

                resolve('updated')

            }
            else {
                for (let p = 0; p < params.length; p++) {
                    let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[p] }).exec();
                    let respon = await count(arr[0].directors, ruleValue[0].criteria)

                    if (respon == 'NA') {
                        total += 0
                    } else {
                        total += respon
                    }
                }

                let update = { $set: { response: total } }
                await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
                resolve('updated')
            }
        }
        else {
            let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: numparams }).exec();
            let countValue = await count(arr[0].directors, ruleValue[0].criteria)
            let update = { $set: { response: countValue } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
            resolve('updated')
        }

    })
}

async function Minus(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {

        let params = ruleValue[0].parameter.split(',')
        let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).distinct('response').exec();
        let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).distinct('response').exec();
        let response = await minus(num[0], Den[0])

        let update = { $set: { response: response } }

        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
        resolve('updated')
    })
}


async function ifcondition(checkDen, company, year) {
    return new Promise(async (resolve, reject) => {
        if (checkDen.length > 0) {
            if (checkDen[0].methodName == 'count of') {
                let numparams = checkDen[0].parameter.split(',')
                await Countof(checkDen, company, year, numparams[0], checkDen[0].DPCode);
            }
        }
        resolve('updated')
    })
}
exports.calc = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Company Name : ", req.params.companyName);
            let company = await companytitle.find({ companyName: req.params.companyName }).exec()
            let year = await clientData.find({ companyName: company[0]._id }).distinct('fiscalYear').exec()
            var data = {}, dataValue = []
            for (let y = 0; y < year.length; y++) {
                if (year[y] == 'Fiscal Year') {

                }
                else {
                    let dpcode = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y] }).distinct('DPCode').exec()

                    let ruledp = await rule.find({}).distinct('DPCode').exec();
                    let dpvalue = await compare(dpcode, ruledp)
                    dpvalue.forEach(async (value) => {
                        let ruleValue = await rule.find({ DPCode: value }).exec()
    

                        if (ruleValue[0].methodName == 'Ratio') {
                            let param = ruleValue[0].parameter.split(',')
                            let checknum = await rule.find({ DPCode: param[0] }).exec();
                            let checkDen = await rule.find({ DPCode: param[1] }).exec();
                            if (checknum.length > 0) {
                                if (checknum[0].methodName == 'Sum' || checknum[0].methodName == 'sum') {
                                    let numparams = checknum[0].parameter.split(',')
                                    await sumMethod(company[0]._id, year[y], numparams[0], checknum[0].DPCode);

                                } else if (checknum[0].methodName == 'count of') {
                                    let numparams = checknum[0].parameter.split(',')
                                    await Countof(checknum, company[0]._id, year[y], numparams[0], checknum[0].DPCode);
                                }
                                else if (checknum[0].methodName == 'Ratio') {

                                    let para = checknum[0].parameter.split(',')

                                    let num = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: para[0] }).distinct('response').exec();
                                    let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: para[1] }).distinct('response').exec();
                                    let response = await ratio(num[0], Den[0])

                                    let update = { $set: { response: response } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: checknum[0].DPCode }, update).exec();
                                }

                            }
                            else if (checkDen.length > 0) {
                                if (checkDen[0].methodName == 'Sum' || checkDen[0].methodName == 'sum') {
                                    let numparams = checkDen[0].parameter.split(',')
                                    await sumMethod(company[0]._id, year[y], numparams[0], checkDen[0].DPCode);

                                } else if (checkDen[0].methodName == 'count of') {
                                    let numparams = checkDen[0].parameter.split(',')
                                    await Countof(checkDen, company[0]._id, year[y], numparams[0], checkDen[0].DPCode);
                                }
                                else if (checkDen[0].methodName == 'Ratio') {

                                    let para = checkDen[0].parameter.split(',')

                                    let num = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: para[0] }).distinct('response').exec();
                                    let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: para[1] }).distinct('response').exec();
                                    let response = await ratio(num[0], Den[0])

                                    let update = { $set: { response: response } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: checkDen[0].DPCode }, update).exec();
                                }

                            }
                            if (ruleValue[0].methodType == 'IF') {

                                await ifcondition(checkDen, company[0]._id, year[y])
                                let numerator = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: param[0] }).exec();

                                let numer = await sumCount(numerator[0].directors)
                                let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: param[1] }).distinct('response').exec();
                                let percentValue = 0.5 * Number(Den[0])
                                if (isNaN(numer[1]) || Den[0] === " ") {
                                    let update = { $set: { response: 'NA' } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();

                                }
                                else if (Number(numer[1]) < Number(percentValue)) {

                                    let update = { $set: { response: 'NA' } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();

                                } else {

                                    let response = await ratio(numer[0], numer[1])
                                    let update = { $set: { response: response } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();
                                }

                            }
                            else {

                                let num = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: param[0] }).distinct('response').exec();
                                let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: param[1] }).distinct('response').exec();
                                let response = await ratio(num[0], Den[0])

                                const updat = { $set: { response: response } }
                                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, updat).exec();
                            }

                        }
                        else if (ruleValue[0].methodName == 'Sum' || ruleValue[0].methodName == 'sum') {
                            let numparams = ruleValue[0].parameter.split(',')
                            await sumMethod(company[0]._id, year[y], numparams[0], ruleValue[0].DPCode);
                        }
                        else if (ruleValue[0].methodName == 'Percentage') {
                            if (ruleValue[0].methodType == 'sum,sum') {
                                let params = ruleValue[0].parameter.split(',')
                                let arr = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[0] }).exec();

                                let numer = await sum(arr[0].directors)
                                let arr1 = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[1] }).exec();
                                let deno = await sum(arr1[0].directors)
                                let respon = await percent(numer, deno)
                                let update = { $set: { response: respon } }
                                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();
                            }
                            else {
                                await Percentage(ruleValue, company[0]._id, year[y], value)

                            }


                        }
                        else if (ruleValue[0].methodName == 'count of') {
                            let numparams = ruleValue[0].parameter.split(',')
                            await Countof(ruleValue, company[0]._id, year[y], numparams[0], value)
                        }
                        else if (ruleValue[0].methodName == 'Minus') {

                            await Minus(ruleValue, company[0]._id, year[y], value)
                        }
                    })
                }

            }
            return res.status(200).json({
                message: "response updated",
            })

        } catch (error) {
            return res.status(405).json({
                message: error.message
            })
        }

    })
}
