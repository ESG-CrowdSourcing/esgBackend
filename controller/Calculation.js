'use strict';
var clientData = require('../model/data')
var companytitle = require('../model/companyTitle')
var rule = require('../model/rule');
const { updateOne } = require('../model/data');
const { response } = require('express');
const { values } = require('lodash');
var data = require('../model/dpCode')
var mongoose = require('mongoose');
const { getJsDateFromExcel } = require("excel-date-to-js")
var moment = require('moment')

// debugger

async function comma(value) {
    return new Promise(async (resolve, reject) => {
        if (typeof (value) == 'string') {
            if (value.includes(',')) {
                var resolvedValue = value.replace(/,/g, '');

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


async function arrComma(arr) {
    return new Promise(async (resolve, reject) => {
        var data = [];

        arr.forEach(async (value) => {

            if (typeof (value) == 'string') {
                if (value.includes(',')) {
                    var resolvedValue = value.replace(/,/g, '');

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
            else if (Den == 0 || Den === " ") {
                value = 'NA'
                resolve(value)
            }
            else {
                let numer = await comma(Num)
                let deno = await comma(Den)
                var num = Number(numer), den = Number(deno)

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

async function add(Num1, Num2) {
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

async function multiply(Num, Den) {
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
async function sumCount(arr) {
    return new Promise(async (resolve, reject) => {
        let arrValue = []
        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                let ar = arr.filter(e => String(e).trim());
                let a = ar.filter(e => e!='NA');

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

async function sum(arr) {
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

async function compositeCount(arra1, arra2, criteria) {
    return new Promise(async (resolve, reject) => {
        let count = 0;
        let arr1 = arra1.filter(e => String(e).trim());
        let arr2 = arra2.filter(e => String(e).trim());
        try {
            if (criteria == 'Y') {
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1.includes('Yes')) {
                        if (arr1[i] == 'Yes' && arr2[i] == 'Yes') {
                            count++
                        }

                    }
                    else {
                        if (arr1[i] == 'Y' && arr2[i] == 'Y') {
                            count++
                        }
                    }
                }
                resolve(count)
            }



        } catch (error) { reject(error) }
    })
}

async function count(arr, criteria) {
    return new Promise(async (resolve, reject) => {
        let aarr = arr.filter(e => String(e).trim());
        let Arr = aarr.filter(e => e != 'NA')

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

        if (arr.length > 0) {
            if (arr.length === 0) {
                sumValue = 0;
            } else {
                sumValue = await sum(arr[0].directors)
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
async function DEN(checkDen, company, year) {
    return new Promise(async (resolve, reject) => {
        try {
            if (checkDen.length > 0) {
                if (checkDen[0].methodName == 'Sum' || checkDen[0].methodName == 'sum') {
                    let numparams = checkDen[0].parameter.split(',')

                    await sumMethod(company, year, numparams[0], checkDen[0].DPCode);
                    resolve('Updated')


                } else if (checkDen[0].methodName == 'count of') {
                    let numparams = checkDen[0].parameter.split(',')
                    await Countof(checkDen, company, year, numparams[0], checkDen[0].DPCode);
                    resolve('Updated')

                }
                else if (checkDen[0].methodName == 'Ratio') {

                    let para = checkDen[0].parameter.split(',')

                    let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: para[0] }).distinct('response').exec();
                    let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: para[1] }).distinct('response').exec();
                    let response = await ratio(num[0], Den[0])
                    let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: checkDen[0].DPCode }).exec();

                    if (dpCheck.length == 0) {
                        const category = new clientData({
                            _id: new mongoose.Types.ObjectId(),
                            companyName: company,
                            fiscalYear: year,
                            DPCode: checkDen[0].DPCode,
                            response: response,
                            performance: ''
                        }).save()
                        resolve('Updated')


                    }
                    else {
                        let update = { $set: { response: response } }
                        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: checkDen[0].DPCode }, update).exec();
                        resolve('Updated')

                    }
                }
                else if (checkDen[0].methodName == 'ADD') {
                    await ADD(company, year, checkDen)
                    resolve('Updated')

                }
                else if (checkDen[0].methodName == 'As') {
                    await As(company, year, checkDen)
                    resolve('Updated')

                }
                else if (checkDen[0].methodName == 'Minus') {
                    await Minus(checkDen, company, year, checkDen[0].DPCode)
                    resolve('Updated')
                }

            }
        } catch (err) {
            reject(err)
        }
    })

}
async function NUM(checknum, company, year) {
    return new Promise(async (resolve, reject) => {
        try {
            if (checknum.length > 0) {
                if (checknum[0].methodName == 'Sum' || checknum[0].methodName == 'sum') {
                    let numparams = checknum[0].parameter.split(',')
                    await sumMethod(company, year, numparams[0], checknum[0].DPCode);
                    resolve('Updated')


                } else if (checknum[0].methodName == 'count of') {
                    let numparams = checknum[0].parameter.split(',')
                    await Countof(checknum, company, year, numparams[0], checknum[0].DPCode);
                    resolve('Updated')

                }
                else if (checknum[0].methodName == 'Ratio') {

                    let para = checknum[0].parameter.split(',')

                    let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: para[0] }).distinct('response').exec();
                    let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: para[1] }).distinct('response').exec();
                    let response = await ratio(num[0], Den[0])

                    let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: checknum[0].DPCode }).exec();
                    if (dpCheck.length == 0) {
                        const category = new clientData({
                            _id: new mongoose.Types.ObjectId(),
                            companyName: company,
                            fiscalYear: year,
                            DPCode: checknum[0].DPCode,
                            response: response,
                            performance: ''
                        }).save()
                        resolve('Updated')


                    }
                    else {
                        let update = { $set: { response: response } }
                        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: checknum[0].DPCode }, update).exec();
                        resolve('Updated')
                    }

                }
                else if (checknum[0].methodName == 'ADD') {
                    await ADD(company, year, checknum)
                    resolve('Updated')

                }
                else if (checknum[0].methodName == 'As') {
                    await As(company, year, checknum)
                    resolve('Updated')

                }
                else if (checknum[0].methodName == 'Minus') {
                    await Minus(checknum, company, year, checknum[0].DPCode)
                    resolve('Updated')
                }

            }

        } catch (err) {
            reject(err)
        }
    })

}
async function Percentage(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {

        let params = ruleValue[0].parameter.split(',')
        let checknum = await rule.find({ DPCode: params[0] }).exec();
        let checkDen = await rule.find({ DPCode: params[1] }).exec();


        if (checknum.length > 0) {
            await NUM(checknum, company, year)
            resolve('success')

        }
        if (checkDen.length > 0) {
            await DEN(checkDen, company, year)
            resolve('success')

        }

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

async function DPCHECK(company, year, value, response) {
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

async function Countof(ruleValue, company, year, numparams, value) {
    return new Promise(async (resolve, reject) => {

        if (ruleValue[0].methodType == 'composite') {
            let total = 0;
            let params = ruleValue[0].parameter.split(',')
            if (params.length == 2) {
                let arr1 = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).exec();
                let arr2 = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).exec();

                if (arr1.length > 0 || arr2.length > 0) {
                    let response = await compositeCount(arr1[0].directors, arr2[0].directors, ruleValue[0].criteria)
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

            let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: numparams }).exec();

            if (arr.length > 0) {
                let countValue = await count(arr[0].directors, ruleValue[0].criteria)

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

async function minusValue (arrNum,arrDen , Den,num){
    return new Promise(async (resolve, reject) => {
        let directors = []

        for (let i =0 ; i< arrNum.length ; i++) {
            if( arrNum[i] == ' '){
                directors.push('NA')
            }
            else{
             let ss1 = getJsDateFromExcel(arrNum[i])
             let ss2 ;
             if(arrDen[i] == ' '){
                ss2 = getJsDateFromExcel( Den[0].fiscalYearEnddate)
             }
             else{
                 ss2 = getJsDateFromExcel(arrDen[i]) 
             }
             var response = moment([ss2.getUTCFullYear() ,ss2.getUTCMonth() ,ss2.getUTCDate()]).diff(moment([ss1.getUTCFullYear() ,ss1.getUTCMonth() ,ss1.getUTCDate()]), 'years', true)
             directors.push(response)
 
            }
        }
        resolve(directors)
    
    })
}

async function Minus(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {

        let params = ruleValue[0].parameter.split(',')
        let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).exec();
        let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).exec();
        
        let arrNum = num[0].directors;
        let arrDen = Den[0].directors;
        let directors = await minusValue(arrNum,arrDen,Den,num)
       let dpCheck = await clientData.find({ companyName: company, fiscalYear: year, DPCode: value }).exec();
       if (dpCheck.length == 0) {
           const category = new clientData({
               _id: new mongoose.Types.ObjectId(),
               companyName: company,
               fiscalYear: year,
               DPCode: value,
               directors: directors,
               performance: ''
           }).save()
           resolve('success')

       }
       else {
           let update = { $set: { directors:directors } }
           await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
           resolve('success')

       }

    })
}

async function ADD(company, year, ruleValue) {
    return new Promise(async (resolve, reject) => {
        let res = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();
        if (res[0] == undefined){
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
        
        else  {
            const updat = { $set: { response: res[0].response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }, updat).exec();
            resolve('updated')


        }
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

async function As(company, y, ruleValue) {
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

async function AsRatio(company, year, ruleValue) {
    return new Promise(async (resolve, reject) => {

        let res = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();

        if (res[0].response === " ") {
            let param = ruleValue[0].parameter.split(',')
            let checknum = await rule.find({ DPCode: param[0] }).exec();
            let checkDen = await rule.find({ DPCode: param[1] }).exec();
            if (checknum.length > 0) {
                await NUM(checknum, company, year)
            }
            if (checkDen.length > 0) {
                await DEN(checkDen, company, year)
            }
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

async function AsPercentage(company, year, ruleValue, value) {
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
async function Ratio(company, y, ruleValue, value) {
    return new Promise(async (resolve, reject) => {
        let param = ruleValue[0].parameter.split(',')
        let checknum = await rule.find({ DPCode: param[0] }).exec();
        let checkDen = await rule.find({ DPCode: param[1] }).exec();
        if (checknum.length > 0) {
            await NUM(checknum, company[0]._id, y)
        }
        if (checkDen.length > 0) {
            await DEN(checkDen, company[0].id, y)
        }

        if (ruleValue[0].methodType == 'IF') {


                await ifcondition(checkDen, company[0]._id, y)
                let numerator = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: param[0] }).exec();

                let numer = await sumCount(numerator[0].directors)
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

async function RatioADD(company, y, ruleValue, value) {
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
async function PercentageValue(company, y, value, ruleValue) {
    return new Promise(async (resolve, reject) => {
        if (ruleValue[0].methodType == 'sum,sum') {
            let params = ruleValue[0].parameter.split(',')
            let arr = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: params[0] }).exec();

            let numer = await sum(arr[0].directors)
            let arr1 = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: params[1] }).exec();
            let deno = await sum(arr1[0].directors)
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
exports.calc = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {

            let company = await companytitle.find({ companyName: req.params.companyName }).exec()
            let year = await clientData.find({ companyName: company[0]._id }).distinct('fiscalYear').exec()
            year.forEach(async (y) => {

                // let dpcode = await clientData.find({ companyName: company[0]._id, fiscalYear:y }).distinct('DPCode').exec()
                //    let dpcode = await data.find({}).distinct('DPCode').exec();
                let datadp = await data.find({ dataCollection: 'No' }).distinct('DPCode').exec();
                // let dpvalue = await compare(dpcode, ruledp)
                datadp.forEach(async (value) => {
                    let ruleValue = await rule.find({ DPCode: value }).exec()

                    if (ruleValue.length >= 1) {

                        if (ruleValue[0].methodName == 'count of') {
                            let numparams = ruleValue[0].parameter.split(',')
                            await Countof(ruleValue, company[0]._id, y, numparams[0], value)
                        }
                        else if (ruleValue[0].methodName == 'Sum' || ruleValue[0].methodName == 'sum') {
                            let numparams = ruleValue[0].parameter.split(',')
                            await sumMethod(company[0]._id, y, numparams[0], ruleValue[0].DPCode);
                        }
                        else if (value == 'MACR002' || value == 'MACR007' || value == 'MACR010') {
                            await Ratio(company, y, ruleValue, value)

                        }

                        else if (ruleValue[0].methodName == 'Minus') {

                            await Minus(ruleValue, company[0]._id, y, value)
                        }
                        setTimeout(async () => {


                            if (ruleValue[0].methodName == 'Ratio') {

                                await Ratio(company, y, ruleValue, value)

                            }
                            else if (ruleValue[0].methodName == 'RatioADD') {
                                await RatioADD(company, y, ruleValue, value)

                            }

                            else if (ruleValue[0].methodName == 'AsPercentage') {
                                await AsPercentage(company[0]._id, y, ruleValue, value)
                            }
                            else if (ruleValue[0].methodName == 'Percentage') {

                                await PercentageValue(company, y, value, ruleValue)
                            }

                            else if (ruleValue[0].methodName == 'ADD') {

                                await ADD(company[0]._id, y, ruleValue)
                            }
                            else if (ruleValue[0].methodName == 'AsRatio') {
                                await AsRatio(company[0]._id, y, ruleValue)

                            }
                            else if (ruleValue[0].methodName == 'Multiply') {
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
                                        }
                                        else {
                                            const updat = { $set: { response: response } }
                                            await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                                        }

                                    }
                                    else {
                                        const updat = { $set: { response: response } }
                                        await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                                    }

                                }
                                else {
                                    const updat = { $set: { response: res[0].response } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();

                                }
                            }
                            else if (ruleValue[0].methodName == 'Condition') {
                                let res = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: ruleValue[0].DPCode }).exec();

                                if (res[0].response === " ") {
                                    let numparams = ruleValue[0].parameter.split(',')

                                    let value = await clientData.find({ companyName: company[0]._id, fiscalYear: y, DPCode: numparams[0] }).distinct('response').exec();

                                    if (Number(value[0]) >= 50) {

                                        const updat = { $set: { response: 'Y' } }
                                        await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                                    }
                                    else {
                                        const updat = { $set: { response: res[0].response } }
                                        await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                                    }

                                }
                                else {
                                    const updat = { $set: { response: res[0].response } }
                                    await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();

                                }

                            }
                            else if (ruleValue[0].methodName == 'As') {

                                await As(company[0]._id, y, ruleValue)

                            }
                        }, 2900)

                    }
                })


            })
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
