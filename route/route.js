var multer = require('multer');
var masterFileUpload = require('../controller/masterFileUpload');
var cmpany = require('../controller/company');
var master = require('../controller/masterTaxonomy');
var controversy= require('../controller/controversy')
var calculation = require('../controller/Calculation');
var percentile = require('../controller/percentile');
var percentile1 = require('../controller/percentile1');
var auth =require('../controller/authController');
var login =require('../controller/loginController');
var controversy= require('../controller/controversy')
var onBoarding=require('../controller/onBoardingController');
var insurance=require('../controller/insuranceComapnyController');
var batchGroup=require('../controller/batchGroupController');
const { get } = require('lodash');
var path =require('path');

module.exports = function (app) {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          //  cb(null, 'public/');
             cb(null,path.join(__dirname,'../uploads'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    var xslx = multer({ storage: storage });

    app.route('/master').post(xslx.single('file'),master.masterTaxonomy);
    app.route('/taxonomy').post(xslx.array('file', 40), cmpany.companyDetails);
    app.route('/controversy').post(xslx.array('file',25),controversy.controversy);
    app.route('/getcontroversy/:companyID').get(controversy.getControvery);
    app.route('/rule').post(xslx.single('file'),cmpany.rule);
    app.route('/calculation/:companyName').post(calculation.calc)
    app.route('/addUser').post(auth.authdication);
    app.route('/addRole').post(auth.role);
    app.route('/login').post(login.login);
    app.route('/OTPcheck').post(login.otpCheck);
    app.route('/forgotpassword').post(login.forgotPassword);
    app.route('/onBoardEmployee').post(xslx.array('file',3),onBoarding.employee);
    app.route('/onBoardClient').post(xslx.array('file',2),onBoarding.client);
    app.route('/onBoardCompany').post(xslx.array('file',2),onBoarding.company);
    app.route('/addinsCompany').post(insurance.addInsurance);
    app.route('/getinsCompany').get(insurance.getInsurance);
    // app.route('/fetchNewCompanynewData/:companyName').get(masterFileUpload.fetchNewCompanynewData);
    // app.route('/fetchExistingCompanyData/:companyName').get(masterFileUpload.fetchNewCompanynewData);
    // app.route('/package/:companyName').get(masterFileUpload.package);
    app.route('/getNewData/:companyName').get(masterFileUpload.getNewData);
    app.route('/getAllCompany').get(masterFileUpload.getAllCompany)
   // app.route('/getNICCode').get(masterFileUpload.getAllNIC);
    // app.route('/getDirectiveData/:companyName').post(masterFileUpload.getNewDataDir);

    app.route('/percentile/:NIC').post( percentile.percentile)
    app.route('/percentile1/:NIC').post( percentile1.percentile)
    app.route('/Ztable').post(xslx.single('file'),cmpany.Ztable);
    app.route('/polarityCheck').post(xslx.single('file'),cmpany.polarityCheck)
    
     app.route('/createBatch').post(batchGroup.createBatch);
     app.route('/createGroup').post(batchGroup.createGroup);
     app.route('/getUsers').get(batchGroup.getUsers);
     app.route('/getcompanies').get(batchGroup.getCompanies);
}                   
