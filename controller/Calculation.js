var clientData = require('../model/data')
var companytitle = require('../model/companyTitle')
var rule = require('../model/rule');
const { updateOne } = require('../model/data');
debugger
async function ratio(Num, Den) {
    return new Promise(async (resolve, reject) => {
        var value;
        try {
            if (Num == 0 ) {
                value = 0
                resolve(value)
            }
            else if ( Num == '' || Num == 'Y'){
                value = NA
                resolve(value)
            }
            else if (Den == 0 || Den == 'Y') {
                value = 'Invalid'
                resolve(value)
            }
            else {
                value = Num / Den;
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
            if (Num == 0 ) {
                value = 0
                resolve(value)
            }else if ( Num == '' || Num == 'Y'){
                value = NA
                resolve(value)
            }
            else if (Den == 0 || Den == 'Y') {
                value = 'Invalid'
                resolve(value)
            }
            else {
                value = Num - Den;
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
            if (Num == 0 ) {
                value = 0
                resolve(value)
            }
            else if (Num == '' || Num == 'Y'){
                value = NA
                resolve(value)
            }
            else if (Den == 0 || Den == '' || Den == 'Y') {
                value = 'Invalid'
                resolve(value)
            }
            else {
                var value = Num / Den * 100
                resolve(value)
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

                let Arr = arr.filter(e => String(e).trim());
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

async function count(arr, criteria) {
    return new Promise(async (resolve, reject) => {
        let Arr = arr.filter(e => String(e).trim());

        try {
            if (!Array.isArray(arr)) {
                resolve('NA')
            }
            else {
                if(criteria == '2%'){
                    if (Arr.length > 0) {
                        var value = Arr.filter(item => item >= criteria).length;
                        resolve(value)
                    }
                    else {
                        resolve('NA')
                    }
                }
                else{
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

async function ratioAddPer(num,den){
    return new Promise(async (resolve, reject) => {
     
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
async function sumMethod(company, year, value ,dpcode) {
    return new Promise(async (resolve, reject) => {
        let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: value }).exec();
        let sumValue = await sum(arr[0].directors)
        let update = { $set: { response: sumValue } }
        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: dpcode }, update).exec();
        resolve('success')
    })
}

async function Percentage(ruleValue, company, year, value) {
    return new Promise(async (resolve, reject) => {

        let params = ruleValue[0].parameter.split(',')
        let num = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[0] }).distinct('response').exec();
        let Den = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[1] }).distinct('response').exec();
        let response = await percent(num[0], Den[0])

        let update = { $set: { response: response } }
        await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
        resolve('updated')
    })
}

async function Countof(ruleValue, company, year,numparams, value) {
    return new Promise(async (resolve, reject) => {

        if (ruleValue[0].methodType == 'composite') {
            let total = 0;
            let params = ruleValue[0].parameter.split(',')
            for (let p = 0; p < params.length; p++) {
                let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: params[p] }).exec();
                let respon = await count(arr[0].directors, ruleValue[0].criteria)
                total += respon
            }
            let update = { $set: { response: total } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
        }
        else {
            let arr = await clientData.find({ companyName: company, fiscalYear: year, DPCode: numparams }).exec();
            let countValue = await count(arr[0].directors, ruleValue[0].criteria)
            let update = { $set: { response: countValue } }
            await clientData.updateOne({ companyName: company, fiscalYear: year, DPCode: value }, update).exec();
        }
        resolve('updated')
    })
}

async function Minus( ruleValue, company,year,value ){
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
exports.calc = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Company Name : " ,req.params.companyName);
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
                        if (ruleValue[0].methodName == 'Ratio' || ruleValue[0].methodName == 'Average') {
                            let params = ruleValue[0].parameter.split(',')
                            let checknum = await rule.find({ DPCode: params[0] }).exec();
                            let checkDen = await rule.find({ DPCode: params[1] }).exec();
                            if (checknum.length > 0) {
                                if (checknum[0].methodName == 'Sum') {
                                    let numparams = checknum[0].parameter.split(',')
                                    await sumMethod(company[0]._id, year[y], numparams[0], checknum[0].DPCode);

                                } else if (checknum[0].methodName == 'count of') {
                                    let numparams = checknum[0].parameter.split(',')
                                        await Countof(ruleValue, company[0]._id, year[y], numparams[0],value);
                                }

                            }
                            else if (checkDen.length > 0) {
                                if (checkDen[0].methodName == 'Sum') {
                                    let numparams = checkDen[0].parameter.split(',')
                                    await sumMethod(company[0]._id, year[y], numparams[0],checkDen[0].DPCode);

                                } else if (checkDen[0].methodName == 'count of') {
                                    let numparams = checkDen[0].parameter.split(',')
                                        await Countof(ruleValue, company[0]._id, year[y], numparams[0],value);
                                }

                            }
                            let num = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[0] }).distinct('response').exec();
                            let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[1] }).distinct('response').exec();
                            let response = await ratio(num[0], Den[0])
                            let update = { $set: { response: response } }
                            await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();

                        }
                        else if (ruleValue[0].methodName == 'Sum') {
                           let numparams = ruleValue[0].parameter.split(',')
                            await sumMethod(company[0]._id, year[y], numparams[0] , ruleValue[0].DPCode);
                        }
                        else if (ruleValue[0].methodName == 'Percentage') {
                          //  console.log(value)
                            await Percentage(ruleValue,company[0]._id,year[y],value)

                        }
                        else if (ruleValue[0].methodName == 'count of') {
                            let numparams = ruleValue[0].parameter.split(',')

                           await Countof(ruleValue,company[0]._id,year[y],numparams[0] , value)
                        }
                        else if(ruleValue[0].methodName =='Minus' ){

                            await Minus(ruleValue,company[0]._id,year[y],value)
                        }
                       else if( ruleValue[0].methodName == 'Avg/Per'){
                        let params = ruleValue[0].parameter.split(',')
                        let checknum = await rule.find({ DPCode: params[0] }).exec();
                        let checkDen = await rule.find({ DPCode: params[1] }).exec();
                        if (checknum.length > 0) {
                            if (checknum[0].methodName == 'Sum') {
                                let numparams = checknum[0].parameter.split(',')
                                await sumMethod(company[0]._id, year[y], numparams[0], checknum[0].DPCode);
                            }
                        }
                        else if (checkDen.length > 0) {
                            if (checkDen[0].methodName == 'Sum') {
                                let numparams = checkDen[0].parameter.split(',')
                                await sumMethod(company[0]._id, year[y], numparams[0],checkDen[0].DPCode);
                            }
                        }
                        let num = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[0] }).distinct('response').exec();
                        let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[1] }).distinct('response').exec();
                        let response = await percent(num[0], Den[0])
                        let update = { $set: { response: response } }
                        await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();
                       }  
                       else if (ruleValue[0].methodeName== 'RatioAdd/Per')
                       {
                        let params = ruleValue[0].parameter.split(',')
                        
                        let num = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[0] }).distinct('response').exec();
                        let Den = await clientData.find({ companyName: company[0]._id, fiscalYear: year[y], DPCode: params[1] }).distinct('response').exec();
                        
                        let denValue = num[0]+Den[0];                        
                        let result=  await percent(num[0],denValue);
                        let update = { $set: { response: result } }
                        await clientData.updateOne({ companyName: company[0]._id, fiscalYear: year[y], DPCode: value }, update).exec();
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
