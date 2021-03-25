'use strict';
var clientData = require('../model/modelData')
var companytitle = require('../model/companyTitle')
var rule = require('../model/rule');
const { updateOne } = require('../model/modelData');
const { response } = require('express');
const { values } = require('lodash');
var data = require('../model/dpCode')
var mongoose = require('mongoose');
const { getJsDateFromExcel } = require("excel-date-to-js")
var moment = require('moment')

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

async function ADD(company, year, ruleValue) {
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


async function AsPercentage(company, year, ruleValue, value) {
    return new Promise(async (resolve, reject) => {
        let res = await clientData.find({ companyName: company, fiscalYear: year, DPCode: ruleValue[0].DPCode }).exec();
        if (res[0].response === " ") {
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


        }
        else {

            const updat = { $set: { response: res[0].response } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, updat).exec();
            resolve('updated')

        }

    })

}


exports.AsReported = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {

            let company = await companytitle.find({ companyName: req.params.companyName }).exec()
            let year = await clientData.find({ companyName: company[0]._id }).distinct('fiscalYear').exec()
            year.forEach(async (y) => {
                let datadp = await data.find({ dataCollection: 'Yes' }).distinct('DPCode').exec();
                datadp.forEach(async (value) => {
                    let ruleValue = await rule.find({ DPCode: value }).exec()

                    if (ruleValue.length >= 1) {

                            if (ruleValue[0].methodName == 'AsPercentage') {
                                await AsPercentage(company[0]._id, y, ruleValue, value)                            }


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

                                        const updat = { $set: { response: 'Yes' } }
                                        await clientData.updateOne({ companyName: company[0]._id, fiscalYear: y, DPCode: value }, updat).exec();
                                    }
                                    else {
                                        const updat = { $set: { response: 'NO' } }
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
