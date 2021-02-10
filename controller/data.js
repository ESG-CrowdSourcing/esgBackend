var dataSchema = require('../model/data')
var mongoose = require('mongoose')
var directorSchema = require('../model/dir');


exports.getDirectors =(director)=>{
    return new Promise(async (resolve, reject) => {
    dataSchema.find({directors:director.directors}).exec().then(data=>{
        director.keys= data
        resolve(director)
    })
    })
}
exports.getAllData = (keyIssues) => {
    var dataValues =[], datapoints={}, yearValues=[];
    return new Promise(async (resolve, reject) => {
        let data=await dataSchema.find({keyIssuesID:keyIssues._id}).exec()
            let year =await dataSchema.find({ keyIssuesID:keyIssues._id}).distinct('fiscalYear')

                    for(let j=0 ;j< year.length ;j++) {
                        if (data.length >= 1) {
                        for (var i=0;i<data.length;i++){ 

                    if(year[j]=== data[i].fiscalYear){
                            datapoints={
                            Year:data[i].fiscalYear,
                            DPCode : data[i].DPCode,
                            Response:data[i].response,
                            ResponseUnit:data[i].DPType,
                            DPName:data[i].DPName,
                            PerformanceUnit:data[i].unit,
                            Percentile:data[i].percentile
                        }
                        dataValues.push(datapoints);
                    }                 
                    
                }
                 yearValues.push(dataValues)
               
            } else {
                reject;
            }
           
            }
            resolve(yearValues);        
            
     

        

    });
}

