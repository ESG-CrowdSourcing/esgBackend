var categorySchema = require('../model/modelCategory')
var themeSchema = require('../model/modeltheme')
var dataSchema = require('../model/modelData')
var keySchema = require('../model/key')
var mongoose = require('mongoose');
var masterSchema = require('../model/modelMaster')
var titleSchema = require('../model/companyTitle')
var dpcodeSchema = require('../model/dpCode')
var ruleSchema = require('../model/rule');
var ztableSchema = require('../model/zTable');
var polaritySchema = require('../model/polarity')
var dirSchema = require('../model/dir')
var clientData = require('../model/modelData')
var matrixData = require('../model/matrixData')

mongoose.Schema.Types.Boolean.convertToFalse.add('');
var dataCollectionSchema = require('../model/dpCode');
var controversySchema = require('../model/modelcontroversy');
const { resolve } = require('path');
exports.masterTaxonomy = (masterData) => {
    return new Promise(async (resolve, reject) => {
        dataSchema.find({ dataID: masterData._id }).exec().then(data => {
            if (masterData['URL'] == null) {
                resolve(data[0])
            }
            else {
                const master = new masterSchema({
                    _id: new mongoose.Types.ObjectId(),
                    dataID: data[0]._id,
                    sourceName: masterData['Source name'],
                    sourceURL: masterData['URL'].toString(),
                    sourcePublicationDate: masterData['Publication date'],
                    pageNumber: masterData['Page number'],
                    snapshot: masterData['Text snippet'],
                    comments: masterData['Comments/Calculations']
                }).save().then(response => {
                    resolve(response)
                });
            }

        })
    })
}

exports.companyTitle = (titleData) => {
    return new Promise(async (resolve, reject) => {
        let nic = titleData[0]['NIC Code'].toString()
        console.log("////////////////",nic.substring(0,1) )

        let data = await titleSchema.find({ companyName: titleData[0]['Company Name'] }).exec()
        if (data.length > 0) {
            if (!titleData[0]['Governance Analyst Name'] || !titleData[0]['Environment Analyst Name']) {
                var update = {
                    $set: {
                        SocialAnalystName: titleData[0]['Social Analyst Name'],
                        SocialQAName: titleData[0]['Social QA Name']
                    }
                }
                let updatedData = await titleSchema.updateMany({ companyName: titleData[0]['Company Name'] }, update).exec()
                resolve(data[0])
            } else if (!titleData[0]['Social Analyst Name'] || !titleData[0]['Environment Analyst Name']) {
                var update = {
                    $set: {
                        GovernanceAnalystName: titleData[0]['Governance Analyst Name'],
                        GovernanceQAName: titleData[0]['Governance QA Name'],
                    }
                }
                let updatedData = await titleSchema.updateMany({ companyName: titleData[0]['Company Name'] }, update).exec()
                resolve(data[0])
            }
            else {
                var update = {
                    $set: {
                        EnvironmentAnalystName: titleData[0]['Environment Analyst Name'],
                        EnvironmentQAName: titleData[0]['Environment QA Name'],

                    }
                }
                let updatedData = await titleSchema.updateMany({ companyName: titleData[0]['Company Name'] }, update).exec()
                resolve(data[0])
            }

        }
        else {
            const title = new titleSchema({
                _id: new mongoose.Types.ObjectId(),
                CIN: titleData[0].CIN,
                companyName: titleData[0]['Company Name'],
                NIC_Code: titleData[0]['NIC Code'],
                CMIE_ProwessCode: titleData[0]['CMIE/Prowess Code'],
                NIC_industry: titleData[0]['NIC industry'],
                ISIN_Code: titleData[0]['ISIN Code'],
                nic :nic.substring(0,2),
                NIC_Code: titleData[0]['NIC Code'],
                GovernanceAnalystName: titleData[0]['Governance Analyst Name'],
                GovernanceQAName: titleData[0]['Governance QA Name'],
                EnvironmentAnalystName: titleData[0]['Environment Analyst Name'],
                EnvironmentQAName: titleData[0]['Environment QA Name'],
                SocialAnalystName: titleData[0]['Social Analyst Name'],
                SocialQAName: titleData[0]['Social QA Name']
            }).save().then(response => {
                resolve(response)
            });
        }


    })

}

exports.fileUploadCategory = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        categorySchema.find({ category: caragoryData['Category'] }).exec().then(data => {
            if (data.length >= 1) {
                resolve(data[0])
            }
            else {
                const category = new categorySchema({
                    _id: new mongoose.Types.ObjectId(),
                    category: caragoryData['Category'],
                    categoryCode: caragoryData['Category Code']
                }).save().then(response => {
                    resolve(response);
                });
            }

        }).catch(err => {
            console.log(err)
        })


    });
}

exports.fileUploadTheme = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        categorySchema.findOne({ category: caragoryData['Category'] }).exec().then(data => {
            themeSchema.find({ theme: caragoryData['Theme'] }).exec().then(themeData => {
                if (themeData.length >= 1) {
                    resolve(themeData[0])
                }
                else {
                    const theme = new themeSchema({
                        _id: new mongoose.Types.ObjectId(),
                        categoryID: data._id,
                        theme: caragoryData['Theme'],
                        themeCode: caragoryData['Theme Code']
                    }).save().then(categoryd => {
                        resolve(categoryd);
                    });
                }
            })
        })
    });
}

exports.fileUploadKeyIssue = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        let data = await themeSchema.findOne({ theme: caragoryData['Theme'] }).exec()
        let keyData = await keySchema.find({ keyIssues: caragoryData['Key Issues'] }).exec()
        if (keyData.length > 1) {
            resolve(keyData[0])
        }
        else {
            const key = new keySchema({
                _id: new mongoose.Types.ObjectId(),

                themeID: data._id,
                keyIssues: caragoryData['Key Issues'],
                keyIssuesCode: caragoryData['Key issues Code'],
                function: caragoryData['Function']
            }).save().then(themed => {
                resolve(themed);
            });
        }
    });
}


exports.fileUploadData = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        let keyData = await keySchema.find({ keyIssues: caragoryData['Key Issues'] }).exec()
        let data = await dpcodeSchema.find({ DPCode: caragoryData['DP Code'] }).exec()
        if (data.length >= 1) {
            resolve(data[0])
        }
        else {
            const dataSche = new dpcodeSchema({
                _id: new mongoose.Types.ObjectId(),
                keyIssuesID: keyData._id,
                DPCode: caragoryData['DP Code'],
                dataCollection: caragoryData['Data Collection'],
                functions :caragoryData['Function'],
                DPName: caragoryData['DP Name'],
                description: caragoryData['Description'],
                unit: caragoryData['Unit'],
                polarity: caragoryData['Polarity'],
                polarityCheck: caragoryData['Polarity check'],
                signal: caragoryData['Signal'],
                normalizedBy: caragoryData['Normalized by'],
                Weighted: caragoryData['Weighted'],
                percentile: caragoryData['Percentile'],
                relevantForIndia: caragoryData['Relevant for India'],
                standaloneMatrix: caragoryData['Standalone/ Matrix'],
                finalUnit: caragoryData['Final Unit'],
                reference: caragoryData['Reference'],
                industryRelevancy: caragoryData['Industry Relevancy']
            }).save().then(datad => {
                resolve(datad);
            });
        }
    });
}

exports.logic = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        let rule = await ruleSchema.find({ DPCode: caragoryData['DP Code'] }).exec()
        if (rule.length > 1) {
            resolve(rule[0])
        }
        else {
            const data = new ruleSchema({
                _id: new mongoose.Types.ObjectId(),
                ruleID: caragoryData['Rule ID'],
                DPCode: caragoryData['DP Code'],
                aidDPLogic: caragoryData['Aid DP/Logic'],
                methodName: caragoryData['Method Name'],
                methodType: caragoryData['Method Type'],
                criteria: caragoryData['Criteria'],
                parameter: caragoryData['Parameter']

            }).save().then(datad => {
                resolve(datad);
            });
        }
    })
}

exports.polarity = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        const data = new polaritySchema({
            _id: new mongoose.Types.ObjectId(),

            DPCode: caragoryData['DPCode'],
            condition: caragoryData['condition'],
            value: caragoryData['value'],
            polarity: caragoryData['Polarity']


        }).save().then(datad => {
            resolve(datad);
        });

    })
}
async function ztable(dir, caragoryData) {
    var zvalues = []
    dir.forEach(element => {
        zvalues.push(caragoryData[element])
    });

    return zvalues
}
exports.Zscore = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        var values = ['0', '0.01', '0.02', '0.03', '0.04', '0.05', '0.06', '0.07', '0.08', '0.09'];
        let arr = await ztable(values, caragoryData)

        const data = new ztableSchema({
            _id: new mongoose.Types.ObjectId(),
            zScore: caragoryData[' Z score'],
            values: arr

        }).save().then(datad => {
            resolve(datad);
        });
    })
}
async function director(dir, company ,caragoryData) {
    return new Promise(async (resolve, reject) => {

        dir.forEach(async (element) =>{
            let data = await matrixData.find({ companyName: company._id, DPCode: caragoryData['DP Code'] , fiscalYear :caragoryData['Fiscal Year'] , dirName:element}).exec()

            if(data.length > 0){
                let update = { $set: {  
                    companyName: company._id,
                    DPCode: caragoryData['DP Code'],
                   fiscalYear: caragoryData['Fiscal Year'], 
                   fiscalYearEnddate: caragoryData['Fiscal Year End Date'],             
                   value: caragoryData[element],
                   dirName : element,
                   isActive :'true'}}
                   await matrixData.updateOne({ companyName: company._id, fiscalYear: caragoryData['Fiscal Year'], DPCode: caragoryData['DP Code'] ,dirName : element }, update).exec();
            }
            else{
                const matrixdata = new matrixData ({
                   _id: new mongoose.Types.ObjectId(),
                   companyName: company._id,
                   DPCode: caragoryData['DP Code'],
                   fiscalYear: caragoryData['Fiscal Year'],  
                   fiscalYearEnddate: caragoryData['Fiscal Year End Date'],           
                   value: caragoryData[element],
                   dirName : element,
                   isActive :'true'
               }).save()
   
            }
        })    
        resolve('success')   

    })
}


exports.fileUploadMaster = (dir, company, caragoryData) => {
    return new Promise(async (resolve, reject) => {
        let data = await dataSchema.find({ companyName: company._id, DPCode: caragoryData['DP Code'] }).exec()
        // if( caragoryData['Fiscal Year'] != 'Fiscal Year'){
        let dataCollection = await dataCollectionSchema.find({ dataCollection: 'Yes' }).distinct('DPCode').exec();
        if (dataCollection.includes(caragoryData['DP Code']) || caragoryData['DP Code'] == 'Category') {
            if (dir.length == 0) {
                if (data.length > 1) {
                    let update = { $set: {  companyName: company._id,
                        DPCode: caragoryData['DP Code'],
                        DPType: caragoryData['Data Type'],
                        description: caragoryData['Description'],
                        unit: caragoryData['Unit'],
                        fiscalYear: caragoryData['Fiscal Year'],
                        indicator: caragoryData['Indicator'],
                        fiscalYearEnddate: caragoryData['Fiscal Year End Date'],
                        response: caragoryData['Response'],
                        sourceName: caragoryData['Source name'],
                        sourceURL: caragoryData['URL'],
                        sourcePublicationDate: caragoryData['Publication date'],
                        pageNumber: caragoryData['Page number'],
                        snapshot: caragoryData['Text snippet'],
                        comments: caragoryData['Comments/Calculations'] } }

                        await clientData.updateOne({ companyName: company._id, fiscalYear: caragoryData['Fiscal Year'], DPCode: caragoryData['DP Code'] }, update).exec();


                    resolve(data[0])
                }
                else {
                    const dataSche = new dataSchema({
                        _id: new mongoose.Types.ObjectId(),
                        companyName: company._id,
                        DPCode: caragoryData['DP Code'],
                        DPType: caragoryData['Data Type'],
                        description: caragoryData['Description'],
                        unit: caragoryData['Unit'],
                        fiscalYear: caragoryData['Fiscal Year'],
                        indicator: caragoryData['Indicator'],
                        fiscalYearEnddate: caragoryData['Fiscal Year End Date'],
                        response: caragoryData['Response'],
                        sourceName: caragoryData['Source name'],
                        sourceURL: caragoryData['URL'],
                        sourcePublicationDate: caragoryData['Publication date'],
                        pageNumber: caragoryData['Page number'],
                        snapshot: caragoryData['Text snippet'],
                        comments: caragoryData['Comments/Calculations'],
                    }).save().then(themed => {
                        resolve(themed);
                    });
                }
            }
            else {
                await director(dir,company ,caragoryData);
                resolve(data[0])

                // if (data.length > 1) {
                //     let update = { $set: {  companyName: company._id,
                //         DPCode: caragoryData['DP Code'],
                //         DPType: caragoryData['Data Type'],
                //         description: caragoryData['Description'],
                //         unit: caragoryData['Unit'],
                //         fiscalYear: caragoryData['Fiscal Year'],
                //         indicator: caragoryData['Indicator'],
                //         fiscalYearEnddate: caragoryData['Fiscal Year End Date'],
                //         response: caragoryData['Response'],
                //         sourceName: caragoryData['Source name'],
                //         sourceURL: caragoryData['URL'],
                //         sourcePublicationDate: caragoryData['Publication date'],
                //         pageNumber: caragoryData['Page number'],
                //         snapshot: caragoryData['Text snippet'],
                //         comments: caragoryData['Comments/Calculations'] 
                //     } }

                //         await clientData.updateOne({ companyName: company._id, fiscalYear: caragoryData['Fiscal Year'], DPCode: caragoryData['DP Code'] }, update).exec();

                //     resolve(data[0])
                // }
                // else {

                //     const dataSche = new dataSchema({
                //         _id: new mongoose.Types.ObjectId(),
                //         companyName: company._id,
                //         DPCode: caragoryData['DP Code'],
                //         DPType: caragoryData['Data Type'],
                //         description: caragoryData['Description'],
                //         unit: caragoryData['Unit'],
                //         fiscalYear: caragoryData['Fiscal Year'],
                //         indicator: caragoryData['Indicator'],
                //         fiscalYearEnddate: caragoryData['Fiscal Year End Date'],
                //         response: caragoryData['Response'],
                //         sourceName: caragoryData['Source name'],
                //         sourceURL: caragoryData['URL'],
                //         sourcePublicationDate: caragoryData['Publication date'],
                //         pageNumber: caragoryData['Page number'],
                //         snapshot: caragoryData['Text snippet'],
                //         comments: caragoryData['Comments/Calculations'],
                        
                //     }).save().then(themed => {
                //         resolve(themed);
                //     });
                // }
            }
        }
        else {
            resolve(caragoryData['DP Code'])
        }
    });
}

exports.getDirectors = (company, key, value) => {
    return new Promise(async (resolve, reject) => {
        if (value == undefined) {
            resolve(0)
        }
        else {

            let dirSche = await dirSchema.find({ companyID: company._id, fiscalYear: value['Fiscal Year'] }).exec()
            if (dirSche.length > 0) {
                resolve(dirSche[0])
            }
            else {
                if (key.Category == 'Category') {
                    let direct = await fi(key);
                    let Arr = await direct.filter(e => e.startsWith("__EMPTY"));
                    if (Arr.length > 0) {

                        const dataSche = new dirSchema({
                            _id: new mongoose.Types.ObjectId(),
                            companyID: company._id,
                            fiscalYear: value['Fiscal Year'],
                            companyDirectors: Arr
                        }).save().then(themed => {
                            resolve(themed);
                        });

                    }
                    else {
                        resolve(0)
                    }

                }
                else {
                    let direct = await f(key);
                    let Arr = await direct.filter(e => String(e).trim());
                    if (Arr.length > 0) {
                        const dataSche = new dirSchema({
                            _id: new mongoose.Types.ObjectId(),
                            companyID: company._id,
                            fiscalYear: value['Fiscal Year'],
                            companyDirectors: Arr
                        }).save().then(themed => {
                            resolve(themed);
                        });

                    }
                    else {
                        resolve(0)
                    }

                }
            }


        }

    })
}

exports.fileUploadControversy = (company, caragoryData) => {
    return new Promise(async (resolve, reject) => {
        controversySchema.find({ companyName: company._id, DPCode: caragoryData['DP Code'] }).exec().then(data => {
            if (data.length > 1) {
                resolve(data[0])
            }
            else {
                const dataSche = new controversySchema({
                    _id: new mongoose.Types.ObjectId(),
                    companyName: company._id,
                    DPCode: caragoryData['DP Code'],
                    // DPType: caragoryData['Data Type'],
                    // description: caragoryData['Description'],
                    unit: caragoryData['Unit'],
                    fiscalYear: caragoryData['Fiscal Year'],
                    // indicator: caragoryData['Indicator'],
                    // fiscalYearEnddate: caragoryData['Fiscal Year End Date'],
                    response: caragoryData['Response'],
                    // sourceName: caragoryData['Source name'],
                    sourceURL: caragoryData['URL'],
                    sourcePublicationDate: caragoryData['Source Publication Date'],
                    //     pageNumber: caragoryData['Page number'],
                    //     snapshot: caragoryData['Text snippet'],
                    //     comments: caragoryData['Comments/Calculations'],
                    //     Screenshot:caragoryData['Screenshot (in png)'],
                    //     PDF:caragoryData['PDF'],
                    //     wordDOC:caragoryData['Word Doc (.docx)'],
                    //     excel:caragoryData['Excel (.xlxsx)'],
                    //     filePathWay:caragoryData['File pathway'],
                    //     dataVerification:caragoryData['Data Verification'],
                    //     errorType:caragoryData['Error Type'],
                    //     errorComments:caragoryData['Error Comments'],
                    //    internalFileSource:caragoryData['Internal file source'],
                    //    errorStatus:caragoryData['Error Status'],
                    //    analystComments:caragoryData['Analyst Comments'],
                    //    additionalComments:caragoryData['Additional comments']

                }).save().then(themed => {
                    resolve(themed);
                });
            }

        })
    });
}


exports.getNewAllCategory = (companyData) => {
    return new Promise(async (resolve, reject) => {
        categorySchema.find({ companyID: companyData._id }).exec().then(data => {
            if (data.length >= 1) {
                companyData.category = data;
                resolve(companyData);
            }
            else {
                reject;
            }
        })
    });
}


async function f(keyName) {
    return new Promise(async (resolve, reject) => {

    var dir = []
    if (keyName.hasOwnProperty('Source name') && keyName.hasOwnProperty('Fiscal Year End Date')) {
        var c = Object.keys(keyName)
        let s = c.indexOf('Source name')
        let e = c.indexOf('Fiscal Year End Date')

        for (let i = e + 1; i < s; i++) {
            if(c[i].length > 1 && !c[i].includes('__E'))
            {
                dir.push(c[i])
            }
        }
    }
    resolve( dir)
})

}
async function fi(keyName) {

    var dir = []
    if (keyName.hasOwnProperty('Source name') && keyName.hasOwnProperty('Fiscal Year End Date')) {
        var c = Object.values(keyName)
        let s = c.indexOf('Source name')
        let e = c.indexOf('Fiscal Year End Date')
        for (let i = e + 1; i < s; i++) {

            dir.push(c[i])

        }

    }
    return dir

}

exports.getDirectives = (keyName) => {
    return new Promise(async (resolve, reject) => {
        let dir = await f(keyName);
        resolve(dir)
    });
}




