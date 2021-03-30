 var XLSX = require('xlsx')
 const ExcelJS = require('exceljs');
 const { get } = require('lodash');

exports.sheetOne = (url) => {

    return new Promise(async (resolve, reject) => {
        var workbook = XLSX.readFile(url);
        var sheet_name_list = workbook.SheetNames;
        var resultArr= [], companyArr=[]
        for(let i=0 ; i< sheet_name_list.length;i++){
            
            var s=workbook.Sheets[sheet_name_list[i]]
            s['!rows']
            // if(sheet_name_list[i] == 'Matrix-Directors' ){
            //     //const sheet = workbook.Sheets[table.SheetNames[0]];
                

            //     var range = XLSX.utils.decode_range(workbook.Sheets[sheet_name_list[i]]['!ref']);

            //     for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            //         // Example: Get second cell in each row, i.e. Column "B"
            //         const secondCell = s[XLSX.utils.encode_cell({r: rowNum, c: 0})];
            //         if(secondCell.v == 'Category'){
            //             console.log(secondCell.v , "....................", rowNum); 
            //         }
            //         // NOTE: secondCell is undefined if it does not exist (i.e. if its empty)
            //     }
               
            //     range.s.r=0
            //     range.e.r=30
            //     var new_range = XLSX.utils.encode_range(range);
            //     var res1= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]],{defval:" ",range:new_range});

            //     var range2 = XLSX.utils.decode_range(workbook.Sheets[sheet_name_list[i]]['!ref']);
            //     range2.s.r=31
            //     //range2.e.r=
            //     var new_range2 = XLSX.utils.encode_range(range2);
            //     var res11= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]],{defval:" ",range:new_range2});

            // }

            var res= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]],{defval:" "});
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