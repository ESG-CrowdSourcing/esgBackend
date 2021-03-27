var category = require('../controller/category')
var multipleFileuploadController = require('../controller/multipleFileupload')


exports.masterTaxonomy= async function (req,res){
    let standardData = await multipleFileuploadController.masterSheets(req.file.path);
    for (let i = 0; i < standardData.length; i++){
        let catagoty = await category.fileUploadCategory(standardData[i]);
        if(catagoty.category){
            let theme = await category.fileUploadTheme(standardData[i])
            if(theme.theme){
                let keyIssue = await category.fileUploadKeyIssue(standardData[i])
                if(keyIssue.keyIssues)
                {
                    let dpcode = await category.fileUploadData(standardData[i])
                }
            }
        }


    }
    return res.status(200).json({
        message:"value inserted"
    })

}