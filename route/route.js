var multer = require('multer');
var masterFileUpload = require('../controller/masterFileUpload');
module.exports = function (app) {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    var xslx = multer({ storage: storage });

    app.route('/taxonomy').post(xslx.array('file', 10), masterFileUpload.masterFileLoad);
    app.route('/fetchNewCompanynewData/:companyName').get(masterFileUpload.fetchNewCompanynewData);
    app.route('/fetchExistingCompanyData/:companyName').get(masterFileUpload.fetchNewCompanynewData);
    app.route('/package/:companyName').get(masterFileUpload.package);
    app.route('/getNewData/:companyName').get(masterFileUpload.getNewData);
    app.route('/getAllCompany').get(masterFileUpload.getAllCompany)
    app.route('/getDirectiveData/:companyName').post(masterFileUpload.getNewDataDir);
}                   