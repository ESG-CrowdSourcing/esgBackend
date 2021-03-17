var dataSchema = require('../model/data')
var multipleFileuploadController = require('../controller/multipleFileupload')
var category = require('../controller/category')
var data = require('../model/dpCode');
var clientData = require('../model/data');

exports.companyDetails = async function (req, res) {

    try {
        let companyName;

        for (let f = 0; f < req.files.length; f++) {
            let standardData = await multipleFileuploadController.sheetOne(req.files[f].path);
            let company = await category.companyTitle(standardData.companyArr[0]);
            companyName = company._id

            for (let i = 0; i < standardData.resultArr.length - 1; i++) {
                for (let j = 0; j < standardData.resultArr[i].length; j++) {
                    let dir = await category.getDirectives(standardData.resultArr[i][j])
                    let c = await category.fileUploadMaster(dir, company, standardData.resultArr[i][j]);
                }
            }
        }
        // let missedDP = await compare(companyName);
// setTimeout(async ()=> {


        return res.status(200).json({
            message: 'file upload has been completed.',
            missedDPCodes: missedDP,
            status: 200,
        });
    // },1800)

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }

}

function compare(companyName) {
    return new Promise(async (resolve, reject) => {
        let dpCodes = await data.find({}).distinct('DPCode').exec()

        let yearData = [], yearValue = {}

        let year = await clientData.find({ companyName: companyName }).distinct('fiscalYear').exec()

        year.forEach(async (y) => {
            if( y == 'Fiscal Year'){
                resolve(yearData)
            }
            else{
            let clientdp = await clientData.find({ companyName: companyName, fiscalYear: y }).distinct('DPCode').exec()
            // console.log( " // " , y)
            let missedExcel = await compareExcel(clientdp, dpCodes)
            let missedTaxonomy = await compareTaxonomy(dpCodes, clientdp)
            yearValue = {
                Year: y,
                countMissedDPInExcel: missedExcel.length,
                countMissedDPInTaxonomy: missedTaxonomy.length
            }
            yearData.push(yearValue)
        }

        })
    

        // console.log(" .... ", yearData)
        resolve(yearData)
    
    })
}

async function compareTaxonomy(arr1, arr2) {
    return new Promise(async (resolve, reject) => {

        var res = arr1.filter(x => !arr2.includes(x));
        // console.log('///////////' , res.length)
        resolve(res);
    })

}


async function compareExcel(arr1, arr2) {
    return new Promise(async (resolve, reject) => {

        var res = arr2.filter( x=> !arr1.includes(x));
        // console.log('///////////.............' , res.length)

        resolve(res);
    })

}



exports.rule = async function (req, res) {
    try {
        let standardData = await multipleFileuploadController.masterSheets(req.file.path);
        for (let i = 0; i < standardData.length; i++) {
            let c = await category.logic(standardData[i]);
        }
        return res.status(200).json({
            message: ' rule file upload has been completed.',
            status: 200,
        });

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}

exports.Ztable = async function (req, res) {
    try {
        let standardData = await multipleFileuploadController.masterSheets(req.file.path);
        for (let i = 0; i < standardData.length; i++) {
            let c = await category.Zscore(standardData[i]);
        }
        return res.status(200).json({
            message: ' percentile file upload has been completed.',
            status: 200,
        });

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}

exports.polarityCheck = async function (req, res) {
    try {
        let standardData = await multipleFileuploadController.masterSheets(req.file.path);
        console.log(standardData.length)
        for (let i = 0; i < standardData.length; i++) {
            let c = await category.polarity(standardData[i]);
        }
        return res.status(200).json({
            message: ' polarity file upload has been completed.',
            status: 200,
        });

    } catch (error) {
        return res.status(402).json({
            message: error.message,
            status: 402,
        });
    }
}
