var dataSchema = require('../model/data')
var mongoose = require('mongoose')
var directorSchema = require('../model/dir');
var titleSchema = require('../model/companyTitle')

exports.getDirectors =(director)=>{
    return new Promise(async (resolve, reject) => {
    dataSchema.find({directors:director.directors}).exec().then(data=>{
        director.keys= data
        resolve(director)
    })
    })
}

async function file(fiscal){
    var dataValues =[], datapoints={};
    for( let fi =0 ;fi< fiscal.length ;fi++){
        datapoints={
            Year:fiscal[fi].fiscalYear,
            DPCode : fiscal[fi].DPCode,
            Response:fiscal[fi].response,
            ResponseUnit:fiscal[fi].DPType,
            DPName:fiscal[fi].DPName,
            PerformanceUnit:fiscal[fi].unit,
            Percentile:fiscal[fi].percentile
        }
        dataValues.push(datapoints);

    }
    return dataValues
}
exports.getAllData = (company) => {
    var dataValues =[], datapoints={}, yearValues=[], yearData={};
    return new Promise(async (resolve, reject) => {
        // let data=await dataSchema.find({keyIssuesID:keyIssues._id}).exec()
            let year =await dataSchema.find({companyName: company}).distinct('fiscalYear')
            for(let yr=0; yr < year.length ;yr++){
                if(year[yr] == 'Fiscal Year'){
                    
                }
                else{
                    let fiscal = await dataSchema.find({companyName: company,fiscalYear: year[yr]}).exec()
                    let f = await file(fiscal);
                    yearData={ year: year[yr],
                               Data: f}
                   yearValues.push(yearData)
                   } 
                }
                
     
resolve(yearValues)
        

    });
}

