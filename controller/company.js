var dataSchema = require('../model/data')
var multipleFileuploadController = require('../controller/multipleFileupload')
var category = require('../controller/category')

exports.companyDetails = async function(req,res){

    try{
        for (let f =0 ; f < req.files.length ; f++){
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);
            let company = await category.companyTitle(standardData.companyArr[0]);
            
            for(let i=0 ; i< standardData.resultArr.length -1 ; i++){
                   for (let j =0 ;j < standardData.resultArr[i].length ;j++){
                       let dir = await category.getDirectives(standardData.resultArr[i][j])
                    let c = await category.fileUploadMaster(dir,company,standardData.resultArr[i][j]);

                   }
            }
        }
        return res.status(200).json({
            message: 'file upload has been completed.',
            status: 200,
        });

    }catch(error){
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }

}

exports.rule = async function (req,res){
    try{ 
            let standardData = await multipleFileuploadController.masterSheets(req.file.path);
            for(let i=0 ; i< standardData.length ; i++){
                    let c = await category.logic(standardData[i]);
            }        
        return res.status(200).json({
            message: ' rule file upload has been completed.',
            status: 200,
        });

    }catch(error){
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}