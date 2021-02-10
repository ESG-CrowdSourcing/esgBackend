const Excel = require('exceljs');
// var mongoose = require('mongoose');
 var XLSX = require('xlsx')
var Converter = require('csvtojson').Converter;
var converter = new Converter({});
var fs = require('fs')


var converter = require('csvtojson').Converter;
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


//         console.log(sheet_name_list )
//         const worksheet = workbook.getWorksheet('Standalone Datapoints');
//         const worksheet2 = workbook.etWorksheet('Derived datapoints');
//         let headers2 = [];

//         let resultArr = [];
//         let headers = [];
//         let companyArr = [];
//         let companyHeader = [];
//        await worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
 
//             if(JSON.stringify(row.values) !== []){

            
//             if (rowNumber === 2) {
//                 companyHeader = [...row.values]
//             }

//             if (rowNumber === 8) {
//                 headers = [...row.values]
//             }

//             if (rowNumber == 3) {
//                 let obj = {};
//                 for (let i = 1; i < companyHeader.length; i++) {
//                     if (companyHeader[i] !== null) {
//                         obj[companyHeader[i].replace(/\s/g,'')] = row.getCell(i).value;
//                     }
//                 }
//                 companyArr.push(obj);
//             }


//             if (rowNumber > 9) {
//                 let obj = {};
//                 for (let i = 1; i < headers.length; i++) {

//                     if (headers[i] !== null) {
//                         obj[headers[i].replace(/\s/g,'')] = row.getCell(i).value;
//                     }
//                 }
//                 resultArr.push(obj);
//             }
//         }
//         });
        
//         worksheet2.eachRow({ includeEmpty: true }, function (row, rowNumber) {
//             if (rowNumber === 2) {
//                 headers2 = [...row.values]
//             }
//             if (rowNumber > 1) {
//                 let obj = {};
//                 for (let i = 1; i < headers2.length; i++) {
//                     if (headers2[i] !== null) {
//                         obj[headers2[i].trim()] = row.getCell(i).value;
//                     }
//                 }
//                 resultArr.push(obj);
//             }
//         });
//      console.log(resultArr);
//         resolve({ resultArr: resultArr, companyArr: companyArr });
//     });
// }

// exports.sheetTwo = (url) => {
//     return new Promise(async (resolve, reject) => {
//         const workbook = new Excel.Workbook();
//         await workbook.xlsx.readFile(url);
//         const worksheet2 = workbook.getWorksheet('Derived data points');

//         let resultArr2 = [];
//         let headers2 = [];
//         worksheet2.eachRow({ includeEmpty: true }, function (row, rowNumber) {
//             // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
//             if (rowNumber === 2) {
//                 headers2 = [...row.values]
//             }
//             if (rowNumber > 1) {
//                 let obj = {};
//                 for (let i = 1; i < headers2.length; i++) {
//                     if (headers2[i] !== null) {
//                         obj[headers2[i].trim()] = row.getCell(i).value;
//                     }
//                 }
//                 resultArr2.push(obj);
//             }
//         });
//         console.log('Row================> ' + JSON.stringify(resultArr2));

//         resolve(resultArr2);
//     });
}