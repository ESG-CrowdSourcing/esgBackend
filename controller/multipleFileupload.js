 var XLSX = require('xlsx')
 const ExcelJS = require('exceljs');
 const { get } = require('lodash');
const { Dir } = require('fs');

 async function Directors (value ,workbook){
    return new Promise(async (resolve, reject) => {
        let resultArr =[]
        if(value.length > 0){

        
        var range = XLSX.utils.decode_range(workbook['!ref']);       
        range.s.r=value[0]
        range.e.r=value[1]-1
        var new_range = XLSX.utils.encode_range(range);
        var res1= XLSX.utils.sheet_to_json(workbook,{defval:" ",range:new_range});
        resultArr.push(res1)

        var range2 = XLSX.utils.decode_range(workbook['!ref']);
        range2.s.r=value[1]
        //range2.e.r=
        var new_range2 = XLSX.utils.encode_range(range2);
        var res11= XLSX.utils.sheet_to_json(workbook,{defval:" ",range:new_range2});
        resultArr.push(res11)
        }
        resolve(resultArr)

    })
 }

exports.sheetOne = (url) => {

    return new Promise(async (resolve, reject) => {
        var workbook = XLSX.readFile(url);
        var sheet_name_list = workbook.SheetNames;
        var resultArr= [], companyArr=[]
        var res
        for(let i=0 ; i< sheet_name_list.length;i++){
            
            var s=workbook.Sheets[sheet_name_list[i]]
            s['!rows']
            if(sheet_name_list[i] == 'Matrix-Directors' || sheet_name_list[i] == 'Matrix-KMP'){
              
                var range = XLSX.utils.decode_range(workbook.Sheets[sheet_name_list[i]]['!ref']);
                let value =[]
                for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
                    const secondCell = s[XLSX.utils.encode_cell({r: rowNum, c: 0})];
                    if(secondCell != undefined){
                        if(secondCell.v == 'Category' ){
                            value.push(rowNum)
                        }
                    }
                }
               let  res1 = await Directors(value,workbook.Sheets[sheet_name_list[i]])
               resultArr.push(res1[0])
               resultArr.push(res1[1])
            }else{
                 res= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]],{defval:" "});                  
             }
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

exports.masterSheets = (url)=>{
    return new Promise(async (resolve, reject) => {
        
        var workbook = XLSX.readFile(url);
        var sheet_name_list = workbook.SheetNames;
            var res= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]],{defval:" "});   
        
        resolve(res);
               
        })
}