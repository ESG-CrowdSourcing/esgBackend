var dataSchema = require('../model/data')
var mongoose = require('mongoose')
var matrix = require('../model/dpCode')

exports.getDirectors =(director)=>{
    return new Promise(async (resolve, reject) => {
    dataSchema.find({directors:director.directors}).exec().then(data=>{
        director.keys= data
        resolve(director)
    })
    })
}

async function file(fiscal , matrix){
    var dataValues =[], datapoints={};
    for( let fi =0 ;fi< fiscal.length ;fi++){
        if(matrix.includes(fiscal[fi].DPCode)){

        }
        else{
            datapoints={
                Year:fiscal[fi].fiscalYear,
                DPCode : fiscal[fi].DPCode,
                Response:fiscal[fi].response,
                PerformanceResponse:fiscal[fi].performance,
            }
            dataValues.push(datapoints);
        }
    }
    return dataValues;
}
exports.getAllData = (company) => {
    var  yearValues=[], yearData={};
    return new Promise(async (resolve, reject) => {
        // let data=await dataSchema.find({keyIssuesID:keyIssues._id}).exec()
            let year =await dataSchema.find({companyName: company}).distinct('fiscalYear')
            for(let yr=0; yr < year.length ;yr++){
                if(year[yr] == 'Fiscal Year'){
                    
                }
                else{
                    let matrixValue = await matrix.find({standaloneMatrix:'Matrix'}).distinct('DPCode').exec();

                    let fiscal = await dataSchema.find({companyName: company,fiscalYear: year[yr]}).exec()
                    let f = await file(fiscal , matrixValue);
                    yearData={ year: year[yr],
                               Data: f}
                   yearValues.push(yearData)
                   } 
                }
                
     
resolve(yearValues)
        

    });
}

