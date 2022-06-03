var botId = "26242ea3e201c7124551aadef1";//groupme bot id

function doPost(e){
  spreadsheet = loadSpreadsheet();
  array = generateArray(spreadsheet);
  var post = JSON.parse(e.postData.getDataAsString());
  var text = post.text;
  var name = post.name;

  textArray = text.split(" ");
  var command = textArray[0].toLowerCase();

  if(command == ".new"){
    newUsersCommand(textArray,array);
  }

  if(command == ".clear"){
    clear(textArray,array);
  }

  

  if(text.toLowerCase().substring(0, 5) == "!sale"){
    sendText(get("Xiyi Yang","Lena Wang"));
  }else if(text.toLowerCase().substring(0, 9) == "!my sales"){
    addUser("Test Name",array);
    updateSpreadsheet(array);
  }
}

function clear(textArray,array){

  if(textArray[1].toLowerCase() == "all"){
    var numNames = numFilledRows(array);
    for(var i=1; i<= numNames; i++){
      for(var j=1; j<= numNames;j++){
        array[i][j] = "0";
      }
    }
    updateSpreadsheet(array);
    sendText("Cleared all user tabs.");
  }

}

function newUsersCommand(namesArray,array){
  for(var i=1; i<namesArray.length; i++){
      if(array.some(row => row.includes(namesArray[i].toLowerCase()))){
        sendText("Username '" + namesArray[i] + "' is already taken. Please select another.");
      }
      else{
        addUser(namesArray[i].toLowerCase(),array);
        updateSpreadsheet(array);
        sendText("User '" + namesArray[i] + "' successfully added.");
      }
    }
}

function test(){
  spreadsheet = loadSpreadsheet();
  array = generateArray(spreadsheet);
  Logger.log(numFilledRows(array));
  Logger.log(array.length);
  Logger.log(array);
  addUser("Test Name",array);
  array[10][10] = "test!";
  updateSpreadsheet(array);
}


function addUser(name,array){//adds new username to spreadsheet
  index = numFilledRows(array) + 1; //insert new name at first available blank row/column
  array[0][index] = name; //puts name into column
  array[index][0] = name; //puts name into row
  for(var i=1; i<numFilledRows(array)+1;i++){
    for(var j=1;j<numFilledRows(array)+1;j++){
      if(array[i][j] == ""){
        array[i][j] = "0";
      }
    }
  }
}

function get(ower,owee){ //gets amount ower owes owee
  var owerIndex = getNameIndex(ower,array[0]);
  var oweeIndex = getNameIndex(owee,array[0]);
  return array[oweeIndex][owerIndex];
}
function updateSpreadsheet(array){ //updates data in spreadsheet with values in array
  spreadsheet.getRange(2,2,spreadsheet.getMaxRows(),spreadsheet.getMaxRows()).setValues(array);
}

function loadSpreadsheet(){
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1av1GQwkeOUFLJ3fR9MWEw8oYXhP7vKhPjO6o8-x6kD8/edit#gid=0').getSheets()[0];
  return spreadsheet;
}

function generateArray(spreadsheet){
  var array = spreadsheet.getRange(2,2,spreadsheet.getMaxRows(),spreadsheet.getMaxRows()).getValues();
  return array;
}

function getNameIndex(name, array){//pass in ower/owee names and spreadsheet 2d array
  for (var index in array[0]){
    if(name == array[index]){
      return index;
    }
  }
}

function numFilledRows(array){ //returns number of rows that actually hold a value/have content in the array
  for(i = 1; i < array.length; i++){
    if(array[i][0] == ""){
      return i-1;
    }
  }
}

function sendText(text){//send message from chatbot to groupme
  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", {"method":"post", "payload":'{"bot_id":"' + botId + '","text":"' + text + '"}'})
}

function doGet() {}