const Excel = require('exceljs');
// var mongoose = require('mongoose');
 var XLSX = require('xlsx')
var Converter = require('csvtojson').Converter;

exports.sheetOne = (url) => {

    return new Promise(async (resolve, reject) => {
        
        var workbook = XLSX.readFile(url);
        var sheet_name_list = workbook.SheetNames;
        var resultArr= [], companyArr=[]
        for(let i=0 ; i< sheet_name_list.length;i++){

            var res= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);
            if(i == 0){
                companyArr.push(res)
            }
            else{
                resultArr.push(res)
            }    
        }
        
        resolve({ resultArr: resultArr, companyArr: companyArr });
               
        })


}