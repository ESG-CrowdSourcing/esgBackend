var category = require('../controller/category')
var multipleFileuploadController = require('../controller/multipleFileupload')
var companySchema = require('../model/companyTitle')
var yearSchema=require('../model/year.model')
var controversySchema = require('../model/controversy.model')
const { result } = require('lodash')
const { find, populate, db } = require('../model/companyTitle')
//const controversy = require('../model/controversy')

exports.controversy = async function (req, res) {
    try {
        for (let f = 0; f < req.files.length; f++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);
            
            let company = await category.companyTitle(standardData.companyArr[0]);

    var array =standardData.resultArr[0]

       var flags = [], output = [], l = array.length, i;
     for( i=0; i<l; i++) {
    if( flags[array[i]['Fiscal Year']]) continue;
    flags[array[i]['Fiscal Year']] = true;
    output.push(array[i]['Fiscal Year']);
           }

           output.forEach(result=>{
              
               let years=new yearSchema({
                year:result,
                companyName:company.companyName
               })

               years.save(function(err,data){
                if (err){
                    
                }
                else{
                    
                }
            })
           })


            let compayDetails=new companySchema({
                companyName:company.companyName,
                CIN:company.CIN,
                NIC_Code:company.NIC_Code,
                ISIN_Code:company.ISIN_Code,
                NIC_industry:company.NIC_industry,
                CMIE_ProwessCode:company.CMIE_ProwessCode,
                NIC_industry:company.NIC_industry
            })

            compayDetails.save(function(err,result){
                if (err){
                    console.log(err);
                }
                else{
                    console.log(result)
                }
            })

           

            standardData.resultArr[0].forEach(result=>{

                   
                if(result['Response']=='Low'){
                    result['Response']=1
                }
                if(result['Response']=='Medium'){
                    result['Response']=2
                }
                if(result['Response']=='High'){
                    result['Response']=3
                }
                if(result['Response']=='Very high'){
                    result['Response']=4
                }
                if(result['Response']==''){
                    result['Response']=0
                }
                

               


                
                let controversyDetails= new controversySchema({
                    
                    response:result['Response'],
                    companyId:company.companyName,
                    year:result['Fiscal Year'],
                    DPcode:result['DP Code'],
                    unit:result['Unit'],
                    Textsnippet:result['Text snippet'],
                    data:[{
                    sourceName:result['Source name'],
                    sourceURL:result.URL,
                    sourcePublicationDate:result['Source Publication Date']

                    }]


                 })

              controversyDetails.save(function(err,result){
                if (err){
                    console.log(err);
                }
                else{
                   
                }
            })   
                
            })

          // 



            for (let i = 0; i < standardData.resultArr.length - 1; i++) {
                for (let j = 0; j < standardData.resultArr[i].length; j++) {
                    let c = await category.fileUploadControversy(company, standardData.resultArr[i][j]);
                }
            }
        }

        return res.status(200).json({
            message: 'Controversy file upload has been completed.',
            status: 200,
        });
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}

async function file(fiscals){
    var dataValues =[], datapoints={};
    fiscals.forEach(fiscal=>{
        datapoints={
            Year:fiscal.fiscalYear,
            DPCode : fiscal.DPCode,
            Unit: fiscal.unit,
            Response:fiscal.response,
            SourceURL:fiscal.sourceURL,
            SourcePublicationDate:fiscal.sourcePublicationDate
        }
        dataValues.push(datapoints);
    })
    return dataValues
}

exports.getControvery = async function (req, res) {
   
    let data=[];
    try {

        let companyName = await companySchema.find({ companyName: req.body.companyName }).exec()
        let year=await yearSchema.find({companyName:companyName[0].companyName}).distinct('year').exec()

     //   for (let yr = 0; yr < year.length; yr++) {

      

     //   }

       // let companyName = await companySchema.find({ companyName: req.body.companyName }).exec()
       // let year = await controversySchema.find({ companyName: companyName[0]._id }).distinct('fiscalYear')


        
    var controversy = await controversySchema.aggregate([
        { $match : {  companyId : companyName[0].companyName,year:{"$in":year}} },
       {$group:{
           _id:"$DPcode",
           Dpcode:{$first:"$DPcode"},
           year:{$first:'$year'},
           ResponseUnit:{$max:'$response'},
           Textsnippet:{$first:'$Textsnippet'},
           controversy:{$first:'$data'},
           
       }},
       
      ])

      controversy.forEach((result)=>{

      delete result['_id']
        if(result['ResponseUnit']==1){
                   
            result['ResponseUnit']='Low'
        }
        if(result['ResponseUnit']==2){
            result['ResponseUnit']='Medium'
        }
        if(result['ResponseUnit']==3){
            result['ResponseUnit']='High'
        }
        if(result['ResponseUnit']==4){
            result['ResponseUnit']='Very high'
        }
        if(result['ResponseUnit']==0){
            result['ResponseUnit']='No'
        }

        var text=result['Textsnippet'].slice(0,75)
        
        result['Textsnippet']=text

result['controversy'].forEach((value)=>{
 
    if(value.sourceName==" " && value.sourceURL==" "){
        result['controversy']=[]
    }

   
  
})
        
      })
                return res.status(200).json({
                    companyName:companyName[0].companyName,
                    CIN:companyName[0].CIN,
                    data: controversy,
                    status: 200,
                });      
        
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            status: 403,
        });
    }
}
