var categorySchema = require('../model/category')
var themeSchema = require('../model/theme')
var dataSchema = require('../model/data')
var keySchema = require('../model/key')
var mongoose = require('mongoose');
const { response } = require('express');
var masterSchema = require('../model/masterTaxonomy')
var titleSchema = require('../model/companyTitle')
var subscription = require('../controller/subcription')
var directiveSchema = require('../model/dir')

exports.masterTaxonomy = ( masterData) => {
    return new Promise(async (resolve, reject) => {file
        dataSchema.find({ dataID: masterData._id }).exec().then(data => {
            if (masterData['URL'] == null){
                resolve(data[0])
            }
            else{ 
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

        let data = await titleSchema.find({ companyName: titleData[0]['Company Name'] }).exec()
            if (data.length > 1) {
                resolve(data[0])
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

exports.fileUploadCategory = (company, caragoryData) => {
    return new Promise(async (resolve, reject) => {
        console.log(".............",company)

        titleSchema.findOne({ companyName: company[0]['Company Name'] }).exec().then(titleData => {
            categorySchema.find({ category: caragoryData.Category }).exec().then(data => {
            
                
                if(caragoryData.Category == null || caragoryData.Category == 'Category' || caragoryData.Category == undefined)
                {
                
                caragoryData.Category == null
                resolve(caragoryData)
                }else{
                
                if (data.length >= 1) {
                    resolve(data[0])
                } else {
                    const category = new categorySchema({
                        _id: new mongoose.Types.ObjectId(),
                        category: caragoryData.Category,
                        companyID: titleData._id
                    }).save().then(response => {
                        resolve(response);
                    });
                }
            }
            })
        })

    });
}

exports.fileUploadTheme = (caragoryData) => {
    return new Promise(async (resolve, reject) => {
        categorySchema.findOne({ category: caragoryData.Category }).exec().then(data => {
            themeSchema.find({ theme: caragoryData.Theme }).exec().then(themeData => {
                if (themeData.length >= 1) {
                    resolve(themeData[0])
                }
                else {
                    const theme = new themeSchema({
                        _id: new mongoose.Types.ObjectId(),
                        categoryID: data._id,
                        theme: "Board & Committee functioning"
                    }).save().then(categoryd => {
                        resolve(categoryd);
                    });
                }
            })
        })
    });
}

exports.fileUploadKeyIssue = ( caragoryData) => {
    return new Promise(async (resolve, reject) => {
       let data = await categorySchema.findOne({ category: caragoryData.Category }).exec()
            let keyData = await keySchema.find({ keyIssues: caragoryData['Key Issues']}).exec()
           if (keyData.length >= 1) {
                    resolve(keyData[0])
                }
                else {
                    const key = new keySchema({
                        _id: new mongoose.Types.ObjectId(),
                        themeID: data._id,
                        keyIssues: caragoryData['Key Issues']
                    }).save().then(themed => {
                        resolve(themed);
                    });
                }
                });
}

async function file(caragoryData,dir,data){
    var s = []

    for (let i=0; i< dir.length ; i++ )
    {
        const dataSche = new dataSchema({
            _id: new mongoose.Types.ObjectId(),
            keyIssuesID: data._id,
            DPCode: caragoryData['DP Code'],
            description: caragoryData['Description'].toString(),
            unit: caragoryData['Unit'],
            fiscalYear: caragoryData['Fiscal Year'],
            indicator: caragoryData['Indicator'],
            response: caragoryData['Response'],
            DPType:caragoryData['Data Type'],
            fiscalYearEndDate:caragoryData['Fiscal Year End Date'],
            percentile:caragoryData['Percentile'],     
            directors: dir[i],

        }).save()
        s.push(dataSche)
        
    }
    return s
}

exports.fileUploadMaster = (company,dir, caragoryData) => {
    return new Promise(async (resolve, reject) => {
        console.log(".............",company)
        let titleData = await titleSchema.findOne({ companyName: company[0]['Company Name'] }).exec()
       let data = await keySchema.findOne({ keyIssues:caragoryData['Key Issues'] }).exec() 
       let dpcode = await dataSchema.find({companyName: titleData._id, DPCode : caragoryData['DP Code']}).exec()
             
       if(dpcode.length >= 2 ) {
           resolve(dpcode[0])
       }
       else{

        //   if(dir.length >1 ){
        //     let key= await file(caragoryData,dir,data)
       
        //     resolve(key)
        //   }
        //   else{

          const dataSche = new dataSchema({
            _id: new mongoose.Types.ObjectId(),
            companyName:titleData._id,
            keyIssuesID: data._id,
            DPCode: caragoryData['DP Code'],
            description: caragoryData['Description'].toString(),
            unit: caragoryData['Unit'],
            fiscalYear: caragoryData['Fiscal Year'],
            indicator: caragoryData['Indicator'],
            response: caragoryData['Response'],
            DPType:caragoryData['Data Type'],     
            fiscalYearEndDate:caragoryData['Fiscal Year End Date'],
            percentile:caragoryData['Percentile']  
            
        }).save().then(response=>{
            resolve(response)
        })
    // } 
       }   
        
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

exports.getAllCategory =(category)=>{
    return new Promise(async (resolve, reject) => {
        categorySchema.find({ category: category.categoryID }).exec().then(data => {
            if (data.length >= 1) {
                category.category = data;
                resolve(category);
            }
            else {
                reject;
            }
        })
    });

}

exports.getAllDirectives = (companyData)=>{
    return new Promise(async (resolve, reject) => {
         directiveSchema.find({ companyID: companyData._id }).exec().then(data => {
            if (data.length >= 1) {
                companyData.directors = data;
                resolve(companyData);
            }
            else {
                reject;
            }
        })
    });
}

async function dir(directiveName, titleData ){
    
        for(let i=0 ;i <directiveName.length ;i++){
            
    
            const direct = new  directiveSchema({
               _id: new mongoose.Types.ObjectId(),
                companyID: titleData._id,
               directors : directiveName[i]}).save();
               
         }
         return 'success';  
}

exports.directive = (directiveName, company )=>{
    return new Promise(async (resolve, reject) => {
        
     let titleData=  await titleSchema.findOne({ companyName: company.companyName }).exec()
        let  direct = await  dir(directiveName, titleData);
         resolve(direct)
    
})

}
async function f(keyName){

    var  dir =[]
    if(keyName.hasOwnProperty('Source name') && keyName.hasOwnProperty('Fiscal Year End Date') ){
       var c = Object.keys(keyName)
    
       let s = c.indexOf('Source name')
       let e = c.indexOf('Fiscal Year End Date')
    
         for (let i = e+1 ; i < s-1 ;i++)
         {             
              dir.push( c[i])
              
         }
      
     }
     return dir

    }
exports.getDirectives = (keyName)=>{
    return new Promise(async (resolve, reject) => {
     let dir= await  f(keyName);
        
    resolve(dir)
});
}


