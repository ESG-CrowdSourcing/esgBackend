'use strict';
var clientData = require('../model/modelData')
var companytitle = require('../model/companyTitle')
var rule = require('../model/rule');
var data = require('../model/dpCode')
var mongoose = require('mongoose');
const { getJsDateFromExcel } = require("excel-date-to-js")
var moment = require('moment')
var matrixData = require('../model/matrixData')
var BPromise = require('bluebird');
const { resolve } = require('bluebird');

// debugger

function comma(value) {
    return new Promise(async (resolve, reject) => {
        if (typeof (value) == 'string') {
            if (value.includes(',')) {
                var resolvedValue = value.replace(/,/g, '').trim();
                resolve(resolvedValue)
            }
            else {

                resolve(value)
            }
        }
        else {
            resolve(value)
        }
    })
}


function arrComma(arr) {
    return new Promise(async (resolve, reject) => {
        var data = [];

        arr.forEach(async (value) => {

            if (typeof (value) == 'string') {
                if (value.includes(',')) {
                    var resolvedValue = value.replace(/,/g, '').trim();
                    data.push(resolvedValue)
                }
                else {
                    data.push(value)
                }
            }
            else {
                data.push(value)
            }
        })
        resolve(data)
    })
}

function ratio(Num, Den) {
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
            else if (Den == 0 || Den === " " || Den == 'NA') {
                value = 'NA'
                resolve(value)
            }
            else {

                let numer = await comma(Num)
                let deno = await comma(Den)

                var num = Number(numer), den = Number(deno)

                value = num / den;
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }
    })
}

function percent(Num, Den) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Num === " " || Num == 'NA') {

                resolve('NA')
            }
            else if (Num == 0) {
                resolve(0)
            }
            else if (Den == 0 || Den == 'NA') {
                resolve("NA")
            }
            else {
                let numer = await comma(Num)
                let deno = await comma(Den)
                var num = Number(numer), den = Number(deno)

                var value = (num / den) * 100;
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }

    })
}

function add(Num1, Num2) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Num1 === " " || Num2 === " ") {
                resolve('NA')
            }
            else {
                let numer = await comma(Num1)
                let deno = await comma(Num2)
                var num = Number(numer), den = Number(deno)

                var value = num + den;
                resolve(value)
            }
        } catch (err) {
            reject(err)
        }

    })
}

function multiply(Num, Den) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Num === " " || Den == 0 || Den === " ") {
                resolve('NA')
            }
            else if (Num == 0) {
                resolve(0)
            }
            else {
                let numer = await comma(Num)
                let deno = await comma(Den)
                var num = Number(numer), den = Number(deno)

                var value = (num / den) * 2000 * 1000000
                resolve(value)
            }
        } catch (error) {
            reject(error)

        }

    })
}
function sumCount(arr) {
    return new Promise(async (resolve, reject) => {
        let arrValue = []
        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                let ar = arr.filter(e => String(e).trim());
                let a = ar.filter(e => e != 'NA');

                let Arra = await arrComma(a);
                let Arr = Arra.map(i => Number(i));

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

function activeData(company, y, dp) {
    return new Promise(async (resolve, reject) => {
        let value = []
        let values = await matrixData.find({ companyName: company, fiscalYear: y, DPCode: dp, isActive: "true" }).exec();
        values.forEach(async (data) => {
            value.push(data.value)
        })
        resolve(value)

    })
}
function sum(arr) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                let a = arr.filter(e => String(e).trim());
                let Arra = await arrComma(a);
                let Arr = Arra.map(i => Number(i));
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

function compositeCount(arra1, arra2, criteria) {
    return new Promise(async (resolve, reject) => {
        let count = 0;
        let arr1 = arra1.filter(e => String(e.value).trim());
        let arr2 = arra2.filter(e => String(e.value).trim());
        try {
            if (criteria == 'Y') {
                for (let i = 0; i < arr1.length; i++) {
                    for (let j = 0; j < arr2.length; j++) {

                        if (arr1[i].dirName == arr2[j].dirName) {
                            if (arr1[i].value == 'Yes' && arr2[j].value == 'Yes') {
                                count++
                            }
                        }
                    }
                }
            }
            resolve(count)

        } catch (error) { reject(error) }
    })
}

function count(arr, criteria) {
    return new Promise(async (resolve, reject) => {
        let aarr = arr.filter(e => String(e).trim());
        let Arr = aarr.filter(e => e != 'NA')

        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                if (criteria == '2') {
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
                else if (criteria == 'Y') {
                    if (Arr.length > 0) {
                        if (Arr.includes('Yes')) {
                            var value = Arr.filter(item => item == 'Yes').length;
                            resolve(value)
                        }
                        else {
                            var value = Arr.filter(item => item == 'Y').length;
                            resolve(value)
                        }

                    }
                    else {
                        resolve('NA')
                    }
                }

                else {
                    if (Arr.length > 0) {
                        var value = Arr.filter(item => item == criteria).length;
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

function sumMethod(company, year, value, dpcode) {
    return new Promise(async (resolve, reject) => {
        let sumValue;
        let arr = await activeData(company, year, value)

        if (arr.length > 0) {
            if (arr.length === 0) {
                sumValue = 0;
            } else {
                sumValue = await sum(arr)
            }
            await DPCHECK(company, year, dpcode, sumValue)
            resolve('Sucess')

        }
        else if (arr[0] == undefined) {
            await DPCHECK(company, year, dpcode, 'NA')
            resolve('Sucess')


        }

    })
}
function Percentage(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {

        console.log(".................." , ruleValue)
        let params = ruleValue[0].parameter.split(',')
        let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).distinct('response').exec();
        let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).distinct('response').exec();
        let response = await percent(num[0], Den[0])
        let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: value }).exec();
        if (dpCheck.length == 0) {
            const category = new clientData({
                _id: new mongoose.Types.ObjectId(),
                companyName: company,
                fiscalYear: year,
                DPCode: value,
                response: response,
                performance: ''
            }).save()
            resolve('success')
        }
        else {
            let update = { $set: { response: response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
            resolve('success')
        }
    })
}

function DPCHECK(company, year, value, response) {
    return new Promise(async (resolve, reject) => {
        let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: value }).exec();
        if (dpCheck.length == 0) {
            const category = new clientData({
                _id: new mongoose.Types.ObjectId(),
                companyName: company,
                fiscalYear: year,
                DPCode: value,
                response: response,
                performance: ''
            }).save()
            resolve('success')
        }
        else {
            let update = { $set: { response: response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
            resolve('success')
        }
    })
}

function Countof(ruleValue, company, year, numparams, value) {
    return new Promise(async (resolve, reject) => {

        if (ruleValue.methodType == 'composite') {
            let total = 0;
            let params = ruleValue.parameter.split(',')
            if (params.length == 2) {

                let arr1 = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[1], isActive: "true" }).exec();
                let arr2 = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[0], isActive: "true" }).exec();

                if (arr1.length > 0 || arr2.length > 0) {
                    let response = await compositeCount(arr1, arr2, ruleValue.criteria)
                    await DPCHECK(company, year, value, response)
                    resolve('success')

                }
                else if (arr1[0] == undefined || arr2[0] == undefined) {
                    await DPCHECK(company, year, value, 'NA')
                    resolve('success')

                }
            }
            else {
                for (let p = 0; p < params.length; p++) {
                    let respon = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[p] }).distinct('response').exec();

                    if (respon[0] == 'Yes' || respon[0] == 'Y') {
                        total++;
                    } else {
                        total;
                    }
                }

                let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: value }).exec();
                if (dpCheck.length == 0) {
                    const category = new clientData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company,
                        fiscalYear: year,
                        DPCode: value,
                        response: total,
                        performance: ''
                    }).save()
                    resolve('success')

                }
                else {
                    let update = { $set: { response: total } }
                    await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
                    resolve('success')
                }
            }
        }
        else {

            let arr = await activeData(company, year, numparams)


            if (arr.length > 0) {
                let countValue = await count(arr, ruleValue.criteria)

                await DPCHECK(company, year, value, countValue)
                resolve('success')


            }
            else if (arr[0] == undefined) {
                await DPCHECK(company, year, value, 'NA')
                resolve('success')


            }

        }

    })
}

function minusValue(arrNum, arrDen) {
    return new Promise(async (resolve, reject) => {
        let directors = []
        try {
            for (let i = 0; i < arrNum.length; i++) {
                for (let j = 0; j < arrDen.length; j++) {
                    if (arrNum[i].dirName == arrDen[j].dirName) {
                        if (arrNum[i].value == ' ') {
                            let data = {
                                dirName: arrNum[i].dirName,
                                value: 'NA'
                            }
                            directors.push(data)
                        }
                        else {
                            let ss1 = getJsDateFromExcel(arrNum[i].value)
                            let ss2;
                            if (arrDen[j].value == ' ') {
                                ss2 = getJsDateFromExcel(arrDen[j].fiscalYearEnddate)
                            }
                            else {
                                ss2 = getJsDateFromExcel(arrDen[j].value)
                            }
                            var response = moment([ss2.getUTCFullYear(), ss2.getUTCMonth(), ss2.getUTCDate()]).diff(moment([ss1.getUTCFullYear(), ss1.getUTCMonth(), ss1.getUTCDate()]), 'years', true)
                            let data = {
                                dirName: arrNum[i].dirName,
                                value: response
                            }
                            directors.push(data)

                        }
                    }
                }
            }
            resolve(directors)
        } catch (error) {
            reject(error)
        }
    })
}

function Minus(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {
        try {


            let params = ruleValue.parameter.split(',')
            let num = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[1], isActive: "true" }).exec();
            let Den = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[0], isActive: "true" }).exec();
            let directors = await minusValue(num, Den)

            directors.forEach(async (element) => {
                let dpCheck = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: value, dirName: element.dirName }).exec();
                if (dpCheck.length <= 0) {
                    const category = new matrixData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company,
                        fiscalYear: year,
                        DPCode: value,
                        dirName: element.dirName,
                        value: element.value,
                        isActive: 'true',
                    }).save()
                    resolve('success')

                }
                else {
                    let update = {
                        $set: {
                            DPCode: value,
                            dirName: element.dirName,
                            value: element.value,
                            isActive: 'true',
                        }
                    }
                    await matrixData.updateOne({ companyName: company, fiscalYear: year, DPCode: value, dirName: element.dirName }, update).exec();
                    resolve('success')
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

function dividearr(arr1, arr2) {
    return new Promise(async (resolve, reject) => {

        let directors = []

        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {

                if (arr1[i].dirName == arr2[j].dirName) {
                    let dir = await percent(arr1[i].value, arr2[j].value)
                    let data = {
                        dirName: arr1[i].dirName,
                        value: dir
                    }
                    directors.push(data)
                }
            }
        }
        resolve(directors)
    })

}

function divideValue(arr1, value) {
    return new Promise(async (resolve, reject) => {
        let directors = []
        for (let i = 0; i < arr1.length; i++) {
            let dir = await percent(arr1[i].value, value)
            let data = {
                dirName: arr1[i].dirName,
                value: dir
            }
            directors.push(data)
        }
        resolve(directors)

    })

}

function matrixPercentage(company, year, value, ruleValue) {
    return new Promise(async (resolve, reject) => {
        if (ruleValue.methodType == 'composite') {

            let params = ruleValue.parameter.split(',')
            let num = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[0], isActive: "true" }).exec();
            let Den = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[1], isActive: "true" }).exec();
            let directors = await dividearr(num, Den)


            directors.forEach(async (element) => {
                let dpCheck = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: value, dirName: element.dirName }).exec();

                if (dpCheck.length <= 0) {
                    const category = new matrixData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company,
                        fiscalYear: year,
                        DPCode: value,
                        dirName: element.dirName,
                        value: element.value,
                        isActive: 'true',
                    }).save()
                    resolve('success')

                }
                else {
                    let update = {
                        $set: {
                            DPCode: value,
                            dirName: element.dirName,
                            value: element.value,
                            isActive: 'true',
                        }
                    }
                    await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value, dirName: element.dirName }, update).exec();
                    resolve('success')
                }
            })

        }
        else {
            let params = ruleValue.parameter.split(',')
            let num = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: params[0], isActive: "true" }).exec();
            let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).exec();

            let directors = await divideValue(num, Den[0].response)


            directors.forEach(async (element) => {
                let dpCheck = await matrixData.find({ companyName: company, fiscalYear: year, DPCode: value, dirName: element.dirName }).exec();
                if (dpCheck.length <= 0) {
                    const category = new matrixData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company,
                        fiscalYear: year,
                        DPCode: value,
                        dirName: element.dirName,
                        value: element.value,
                        isActive: 'true',
                    }).save()
                    resolve('success')

                }
                else {
                    let update = {
                        $set: {
                            DPCode: value,
                            dirName: element.dirName,
                            value: element.value,
                            isActive: 'true',
                        }
                    }
                    await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value, dirName: element.dirName }, update).exec();
                    resolve('success')
                }
            })
        }
    })
}

function ADD(company, year, ruleValue) {
    return new Promise(async (resolve, reject) => {
        let res = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();
        if (res[0] == undefined) {
            const category = new clientData({
                _id: new mongoose.Types.ObjectId(),
                companyName: company,
                fiscalYear: year,
                DPCode: ruleValue[0].DPCode,
                response: 'NA',
                performance: ''
            }).save()
            resolve('updated')
        }

        else if (res[0].response === " ") {
            let numparams = ruleValue[0].parameter.split(',')

            let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: numparams[0] }).distinct('response').exec();
            let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: numparams[1] }).distinct('response').exec();
            let response = await add(num[0], Den[0])

            let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();

            if (dpCheck.length == 0) {
                const category = new clientData({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company,
                    fiscalYear: year,
                    DPCode: ruleValue[0].DPCode,
                    response: response,
                    performance: ''
                }).save()
                resolve('updated')

            }
            else {
                let update = { $set: { response: response } }
                await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }, update).exec();
                resolve('updated')

            }
        }

        else {
            const updat = { $set: { response: res[0].response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }, updat).exec();
            resolve('updated')


        }
    })
}


function ifcondition(checkDen, company, year) {
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

function As(company, y, ruleValue) {
    return new Promise(async (resolve, reject) => {
        let res = await clientData.find({ companyName: company, fiscalYear: y, DPCode: ruleValue[0].DPCode }).exec();

        if (res[0].response === " ") {
            let numparams = ruleValue[0].parameter.split(',')

            let value = await clientData.find({ companyName: company, fiscalYear: y, DPCode: numparams[0] }).distinct('response').exec();

            const updat = { $set: { response: value[0] } }
            await clientData.updateOne({ companyName: company, fiscalYear: y, DPCode: ruleValue[0].DPCode }, updat).exec();
            resolve('updated')
        } else {
            const updat = { $set: { response: res[0].response } }
            await clientData.updateOne({ companyName: company, fiscalYear: y, DPCode: ruleValue[0].DPCode }, updat).exec();
            resolve('updated')

        }
    })
}

function AsRatio(company, year, ruleValue) {
    return new Promise(async (resolve, reject) => {

        let res = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();

        if (res[0].response === " ") {
            let param = ruleValue[0].parameter.split(',')
           
            let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: param[0] }).distinct('response').exec();
            let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: param[1] }).distinct('response').exec();
            let response = await ratio(num[0], Den[0])

            let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();

            if (dpCheck.length == 0) {
                const category = new clientData({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company,
                    fiscalYear: year,
                    DPCode: ruleValue[0].DPCode,
                    response: response,
                    performance: ''
                }).save()
                resolve('success')

            }
            else {
                let update = { $set: { response: response } }
                await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }, update).exec();
                resolve('success')

            }

        }
        else {
            const updat = { $set: { response: res[0].response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }, updat).exec();
            resolve('success')

        }

    })
}

function AsPercentage(company, year, ruleValue, value) {
    return new Promise(async (resolve, reject) => {
        let res = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();
        if (res[0].response === " ") {
            await Percentage(ruleValue, company, year, value)
            resolve('updated')

        }
        else {

            const updat = { $set: { response: res[0].response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, updat).exec();
            resolve('updated')

        }

    })

}
function Ratio(company, y, ruleValue, value) {
    return new Promise(async (resolve, reject) => {

        let param = ruleValue[0].parameter.split(',')
        if (ruleValue[0].methodType == 'IF') {
            let numerator = await activeData(company[0]._id, y, param[0])

            let numer = await sumCount(numerator)
            let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: param[1] }).distinct('response').exec();
            let percentValue = 0.5 * Number(Den[0])
            let dpCheck = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: value }).exec();
            if (isNaN(numer[1]) || Den[0] === " ") {

                if (dpCheck.length == 0) {
                    const category = new clientData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company[0]._id,
                        fiscalYear: y,
                        DPCode: ruleValue[0].DPCode,
                        response: 'NA',
                        performance: ''
                    }).save()
                    resolve('updated')


                }
                else {
                    let update = { $set: { response: 'NA' } }
                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, update).exec();
                    resolve('updated')

                }
            }
            else if (Number(numer[1]) < Number(percentValue)) {
                if (dpCheck.length == 0) {
                    const category = new clientData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company[0]._id,
                        fiscalYear: y,
                        DPCode: ruleValue[0].DPCode,
                        response: 'NA',
                        performance: ''
                    }).save()
                    resolve('updated')
                }
                else {
                    let update = { $set: { response: 'NA' } }
                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, update).exec();
                    resolve('updated')

                }
            } else {

                let response = await ratio(numer[0], numer[1])
                if (dpCheck.length == 0) {
                    const category = new clientData({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company[0]._id,
                        fiscalYear: y,
                        DPCode: ruleValue[0].DPCode,
                        response: response,
                        performance: ''
                    }).save()
                    resolve('updated')


                }
                else {
                    let update = { $set: { response: response } }
                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: ruleValue[0].DPCode }, update).exec();
                    resolve('updated')

                }
            }

        }
        else {
            let num = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: param[0] }).distinct('response').exec();
            let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: param[1] }).distinct('response').exec();
            let response = await ratio(num[0], Den[0])

            let dpCheck = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: value }).exec();

            if (dpCheck.length == 0) {
                const category = new clientData({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company[0]._id,
                    fiscalYear: y,
                    DPCode: value,
                    response: response,
                    performance: ''
                }).save()
                resolve('updated')

            }
            else {
                let update = { $set: { response: response } }
                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, update).exec();
                resolve('updated')

            }
        }


    })
}

function RatioADD(company, y, ruleValue, value) {
    return new Promise(async (resolve, reject) => {

        let numpara = ruleValue[0].parameter.split(',')
        let num = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numpara[0] }).distinct('response').exec();
        let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numpara[1] }).distinct('response').exec();

        let addValue = await add(num[0], Den[0]);
        let response = await percent(num[0], addValue)

        let dpCheck = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: value }).exec();

        if (dpCheck.length == 0) {
            const category = new clientData({
                _id: new mongoose.Types.ObjectId(),
                companyName: company[0]._id,
                fiscalYear: y,
                DPCode: value,
                response: response,
                performance: ''
            }).save()
            resolve('updated')


        }
        else {
            let update = { $set: { response: response } }
            await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, update).exec();
            resolve('updated')

        }
    })
}
function YesNoValue(company, y, numpara) {
    return new Promise(async (resolve, reject) => {
        let C = 0;
        for (let i = 0; i < numpara.length; i++) {
            let num = await clientData.find({ companyName: company, fiscalYear: y, DPCode: numpara[i] }).distinct('response').exec();
            if (num[0].trim() == 'Yes' || num[0] == 'Y') {
                C++;
            }

        }
        resolve(C)
    })
}
function YesNO(company, y, value, ruleValue) {
    return new Promise(async (resolve, reject) => {
        let numpara = ruleValue[0].parameter.split(',')
        let count = await YesNoValue(company, y, numpara)
        if (count > 0) {

            let dpCheck = await clientData.find({ companyName: company, fiscalYear: y, DPCode: value }).exec();
            if (dpCheck.length == 0) {
                const category = new clientData({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company,
                    fiscalYear: y,
                    DPCode: value,
                    response: 'Yes',
                    performance: ''
                }).save()
                resolve('updated')
            }
            else {

                let update = { $set: { response: 'Yes' } }
                await clientData.updateOne({ companyName: company, fiscalYear: y, DPCode: value }, update).exec();
                resolve('updated')

            }
        }
        else {

            let dpCheck = await clientData.find({ companyName: company, fiscalYear: y, DPCode: value }).exec();

            if (dpCheck.length == 0) {
                const category = new clientData({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company,
                    fiscalYear: y,
                    DPCode: value,
                    response: 'No',
                    performance: ''
                }).save()
                resolve('success')


            }
            else {
                let update = { $set: { response: 'No' } }
                await clientData.updateOne({ companyName: company, fiscalYear: y, DPCode: value }, update).exec();
                resolve('success')

            }
        }

    })

}
function PercentageValue(company, y, value, ruleValue) {
    return new Promise(async (resolve, reject) => {
        if (ruleValue[0].methodType == 'sum,sum') {
            let params = ruleValue[0].parameter.split(',')
            let arr = await activeData(company[0]._id, y, params[0])
            let numer = await sum(arr)
            let arr1 = await activeData(company[0]._id, y, params[1])
            let deno = await sum(arr1)
            let respon = await percent(numer, deno)
            let dpCheck = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: value }).exec();

            if (dpCheck.length == 0) {
                const category = new clientData({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company[0]._id,
                    fiscalYear: y,
                    DPCode: value,
                    response: respon,
                    performance: ''
                }).save()
                resolve('updated')

            }
            else {
                let update = { $set: { response: respon } }
                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, update).exec();
                resolve('updated')

            }
        }
        else {
            await Percentage(ruleValue, company[0]._id, y, value)
            resolve('updated')


        }

    })
}


function derviedYesNo(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "YesNo" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await YesNO(company, y, data.DPCode, ruleValue)

        })
        resolve('sucess')
    })
}
function RatioCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "Ratio" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await Ratio(company, y, ruleValue, data.DPCode)
        })
        resolve('sucess')

    })
}

function PercentageCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "Percentage" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await PercentageValue(company, y, data.DPCode, ruleValue)
        })
        resolve('sucess')

    })
}

function RatioADDCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "RatioADD" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await RatioADD(company, y, ruleValue, data.DPCode)
        })
        resolve('sucess')

    })
}

function AsPercentageCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "AsPercentage" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await AsPercentage(company, y, ruleValue, data.DPCode)
        })
        resolve('sucess')

    })
}

function ADDCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "ADD" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await ADD(company, y, ruleValue)
        })
        resolve('sucess')

    })
}

function AsRatioCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "AsRatio" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await AsRatio(company, y, ruleValue)
        })
        resolve('sucess')

    })
}

function AsCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "As" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await As(company, y, ruleValue)
        })
        resolve('sucess')

    })
}

function AsMuliplyCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "Multiply" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await MultiplyCalc(company, y, ruleValue , data.DPCode)
        })
        resolve('sucess')

    })
}

function AsConditionCalc(company, y) {
    return new Promise(async (resolve, reject) => {
        let ruleV = await rule.find({ methodName: "Condition" }).exec()
        ruleV.forEach(async (data) => {
            let ruleValue = await rule.find({ DPCode: data.DPCode }).exec()
            await condition(company, y, ruleValue , data.DPCode)
        })
        resolve('sucess')

    })
}

function MultiplyCalc(company,y,ruleValue,value) {
    return new Promise(async (resolve, reject) => {

    let res = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: ruleValue[0].DPCode }).exec();

    if (res[0].response === " ") {
        let numparams = ruleValue[0].parameter.split(',')

        let num = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numparams[0] }).distinct('response').exec();
        let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numparams[1] }).distinct('response').exec();
        let response = await multiply(num[0], Den[0])
        if (ruleValue[0].methodType == 'composite') {
            if (response == 'NA') {
                let thirdParam = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numparams[2] }).distinct('response').exec();

                const updat = { $set: { response: thirdParam[0] } }
                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                resolve('success')
            }
            else {
                const updat = { $set: { response: response } }
                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                resolve('success')
            }

        }
        else {
            const updat = { $set: { response: response } }
            await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
            resolve('sucess')
        }
    }
    })
    }

    function condition (company , y, ruleValue , value){
        return new Promise(async (resolve, reject) => {

            let res = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: ruleValue[0].DPCode }).exec();

            if (res[0].response === " ") {
                let numparams = ruleValue[0].parameter.split(',')

                let value = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numparams[0] }).distinct('response').exec();

                if (Number(value[0]) >= 50) {

                    const updat = { $set: { response: 'Y' } }
                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                resolve('success')
                }
                else {
                    const updat = { $set: { response: res[0].response } }
                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                    resolve('success')
                }
            }
            else {
                const updat = { $set: { response: res[0].response } }
                await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                resolve('success')

            }



        })
    }

    function derivedCalc(companyName) {
        return new Promise(async (resolve, reject) => {

            let company = await companytitle.find({ companyName: companyName }).exec()
            let year = await clientData.find({ companyName: company[0]._id }).distinct('fiscalYear').exec()

            year.forEach(async (y) => {
                await AsRatioCalc(company[0]._id,y)
                await RatioADDCalc(company,y)
                await PercentageCalc(company,y)
                await AsPercentageCalc(company,y)
                await AsCalc(company[0]._id,y)
                await AsMuliplyCalc(company,y)
                await AsConditionCalc(company,y)
                await derviedYesNo(company[0]._id,y)
                await ADDCalc(company[0]._id,y)  
                await RatioCalc(company,y)
              
            })
            resolve('success')

        })

    }

    function activeDir(company, y) {
        return new Promise(async (resolve, reject) => {
            try {

                let value = await matrixData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: 'BOIR018' }).exec();
                
                for (let i = 0; i < value.length; i++) {
                    if (value[i].value != ' ') {
                        let cessaDate = getJsDateFromExcel(value[i].value)
                        let currentDate = new Date()
                        if (cessaDate < currentDate) {
                            let upadte = { $set: { isActive: 'false' } }
                            await matrixData.updateMany({ companyName: company[0]._id, fiscalYear: y, dirName: value[i].dirName }, upadte).exec();
                        }
                    }
                }
                resolve('updated')
            } catch (error) {
                reject(error)
            }

        })
    }

    function depCountOf(company, y) {
        return new Promise(async (resolve, reject) => {
            let ruleValue = await rule.find({ methodName: "count of" }).exec()
            ruleValue.forEach(async (data) => {
                let numparams = data.parameter.split(',')
                await Countof(data, company[0]._id, y, numparams[0], data.DPCode)
            })
            resolve('sucess')

        })
    }

    function depSum(company, y) {
        return new Promise(async (resolve, reject) => {
            let ruleValue = await rule.find({ methodName: "Sum" }).exec()
            ruleValue.forEach(async (data) => {
                let numparams = data.parameter.split(',')
                await sumMethod(company[0]._id, y, numparams[0], data.DPCode);
            })
            resolve('success')
        })
    }

    function depMatrix(company, y) {
        return new Promise(async (resolve, reject) => {
            let ruleValue = await rule.find({ methodName: "MatrixPercentage" }).exec()
            ruleValue.forEach(async (data) => {
                await matrixPercentage(company[0]._id, y, data.DPCode, data)

            })
            resolve('success')
        })

    }

    function depMinus(company, y) {
        return new Promise(async (resolve, reject) => {
            let ruleValue = await rule.find({ methodName: "Minus" }).exec()
            ruleValue.forEach(async (data) => {
                await Minus(data, company[0]._id, y, data.DPCode)
            })
            resolve('success')
        })

    }

    function depRatio(company, y) {
        return new Promise(async (resolve, reject) => {
            let values = ['MACR002', 'MACR007', 'MACR010', 'EMSR018']
            values.forEach(async (value) => {
                let ruleValue = await rule.find({ DPCode: value }).exec()

                if (value == 'MACR002' || value == 'MACR007' || value == 'MACR010') {
                    await Ratio(company, y, ruleValue, value)
                }
            })
            resolve('sucess')
        })
    }

    function depSumCount(companyName) {
        return new Promise(async (resolve, reject) => {
            let company = await companytitle.find({ companyName: companyName }).exec()
            let year = await clientData.find({ companyName: company[0]._id }).distinct('fiscalYear').exec()
            await year.forEach(async (y) => {
                await depCountOf(company, y)
                await depSum(company, y)
            })
            resolve('success')
        })
    }
    exports.calc = async function (req, res) {
        try {

            let company = await companytitle.find({ companyName: req.params.companyName}).exec()
            let year = await clientData.find({ companyName: company[0]._id }).distinct('fiscalYear').exec()

            await year.forEach(async (y) => {
                await activeDir(company, y)
                await depMatrix(company, y)
                await depMinus(company, y)
                await depRatio(company, y)
            })
            setTimeout(async () => {
                await depSumCount(req.params.companyName)

            }, 2000)
            setTimeout(async () => {
                await derivedCalc(req.params.companyName)

            }, 8000)

            // function myFunction() {
            //     setTimeout(function(){ depSumCount(req.params.companyName) }, 2000);
            //   }

            //   function myFunction1() {
            //     setTimeout(function(){ derivedCalc(req.params.companyName) }, 9000);
            //   }

            //   myFunction()
            //   myFunction1()
            setTimeout(async () => {

            return res.status(200).json({
                message: "response updated",
            })
        }, 18000)


        } catch (error) {
            return res.status(405).json({
                message: error.message
            })
        }
    }
