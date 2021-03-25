var multer = require('multer');
var masterFileUpload = require('../controller/masterFileUpload');
var cmpany = require('../controller/company');
var master = require('../controller/masterTaxonomy');
var controversy= require('../controller/controversy')
var calculation = require('../controller/Calculation');
var percentile = require('../controller/percentile');
const { get } = require('lodash');
const path =require('path');

module.exports = function (app) {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
           // cb(null, 'public/');
             cb(null,path.join(__dirname,'../upload'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    var xslx = multer({ storage: storage });

    app.route('/master').post(xslx.single('file'),master.masterTaxonomy);
    app.route('/taxonomy').post(xslx.array('file', 10), cmpany.companyDetails);
   // app.route('/controversy').post(xslx.array('file',2),controversy.controversy);
    app.route('/rule').post(xslx.single('file'),cmpany.rule);
    app.route('/calculation/:companyName').post(calculation.calc)
    //app.route('/getcontroversy').get(controversy.getControvery);

    // app.route('/fetchNewCompanynewData/:companyName').get(masterFileUpload.fetchNewCompanynewData);
    // app.route('/fetchExistingCompanyData/:companyName').get(masterFileUpload.fetchNewCompanynewData);
    // app.route('/package/:companyName').get(masterFileUpload.package);
    app.route('/getNewData/:companyName').get(masterFileUpload.getNewData);
    app.route('/getAllCompany').get(masterFileUpload.getAllCompany)
   // app.route('/getNICCode').get(masterFileUpload.getAllNIC);
    // app.route('/getDirectiveData/:companyName').post(masterFileUpload.getNewDataDir);

    app.route('/percentile/:NIC').post( percentile.percentile)
    app.route('/Ztable').post(xslx.single('file'),cmpany.Ztable);
    app.route('/polarityCheck').post(xslx.single('file'),cmpany.polarityCheck)
}                   
