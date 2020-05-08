function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Get Covid-19 Stats in the US')
      .addItem('An Example(Massachusetts)', 'exampleMass')
      .addItem('An Example(North Carolina)', 'northCarolina')
      .addToUi();
}

function exampleMass(){ 
 var sheet = SpreadsheetApp.getActiveSheet();
 sheet.getRange(1,1).setValue('=fetchCovidData("united-states","Massachusetts")');
}

function northCarolina(){ 
 var sheet = SpreadsheetApp.getActiveSheet();
 sheet.getRange(1,1).setValue('=fetchCovidData("united-states","North Carolina")');
}

/*
 * 
 *
 * Now begins actual functions
*/

function fetchCovidData(country, province){
  var countryPool = UrlFetchApp.fetch("https://api.covid19api.com/countries");
  var pool = JSON.parse(countryPool.getContentText());
  // Logger.log(pool);
  
  // Check to see the country input is valid
  for (i in pool) {
    if (pool[i]['Slug'] === country){
      var response = UrlFetchApp.fetch("https://api.covid19api.com/live/country/" +country+ "/status/confirmed");
    }
  }
  
  // Give warning for invalid input
  if(response === undefined){
    return "Please check and make sure the country name is valid";  
  } 
  
  //Now parse the live data
  var content = response.getContentText();
  var fullJson = JSON.parse(content);
  
 // Make a list for the specific province
 var list = [];
 for(i in fullJson){
   if(fullJson[i]['Province'] === province){
     list.push(fullJson[i]);
   }
 }
  
 // Give warning for invalid input
 if(list[0] === undefined && province !== "all"){
    return "Please check and make sure the province/state name is valid, put 'all' to view data of the entire country";
   
 } else {
  // If there is a valid province, the work begins
   var chart = [];
   var temp = country.split("-");
   if (temp[1] !== undefined){
     var temp1 = temp[0].charAt(0).toUpperCase()+temp[0].slice(1);
     var temp2 = temp[1].charAt(0).toUpperCase()+temp[1].slice(1);
     chart[0] = [temp1+" "+temp2, province];
   } else {
     var temp1 = temp[0].charAt(0).toUpperCase()+temp[0].slice(1);
     chart[0] = [temp1, province];
   }
   chart[1] = ['Confirmed','Deaths','Active','Date'];
   for (i in list){
     chart.push([list[i]['Confirmed'],list[i]['Deaths'],list[i]['Active'],reformat(list[i]['Date'])]);
   }   
 }
 
 return chart;
// Logger.log(chart);
}


function reformat(sth) {
  var temp = sth.split("T");
  return temp[0];
}

function testing(){
  trend(fetchCovidData("united-states","Massachusetts"));
}

function trend(chart){
  var result = [];
  for (i in chart[0] && i>1){
    result.push(chart[0][i]);
  }
  Logger.log(result);
}