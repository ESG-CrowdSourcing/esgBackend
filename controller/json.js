var xlsxj = require("xlsx-to-json");
var xlsx = require('xlsx')

exports.jsonData=  function (resData){


return new Promise(async (resolve, reject) => {

xlsxj({
    input: resData, 
    output:"a.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
        resolve( result)
    }
  });
})
}