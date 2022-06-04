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

  if(command == ".log"){
    logTransaction(textArray,array);
  }

  if(command == ".users"){
    listUsers(array);
  }
  
  if(command == ".owedto"){
    listOwedTo(textArray[1].toLowerCase(),array)
  }

  if(command == ".owedby"){
    listOwedBy(textArray[1].toLowerCase(),array)
  }

  if(command == ".help"){
    help();
  }

}
function help(){
  sendText("Hello! I'm IOU, a ChatBot created to help groups keep track of finances amongst themselves. Here's a brief overview of my commands: ");
  sendText("➣ .new - Create new user profiles (ex: .new ally");
  sendText("➣ .log - Log transactions between group members (ex: .log 25 eric ana joe in");
  sendText("➣ .clear - Clear pending debts (ex: .clear owedto laura)");
  sendText("➣ .owedto - View who owes the specified user money (ex: .owedto ed");
  sendText("➣ .owedby - View who the specify user owes money to (ex: .owedby ed");
  sendText("➣ .users - View a list of all existing users");
  sendText("For more detail on commands, visit our webpage: ");
}

function listOwedTo(user,array){
  var noOne = 1;
  if(array[0].includes(user) == false){
    sendText(user + " is not a known user. To view the full user list, use the command '.users'");
    return;
  }
  var userIndex = getNameIndex(user,array[0]);
  for(var i=1; i<numFilledRows(array)+1; i++){
    var valueOwed = array[userIndex][i];
    if(valueOwed != "0" && userIndex != i){
      sendText("➣ " + array[0][i] + " owes " + user + " $" + valueOwed.toFixed(2));
      noOne = 0;
    }
  }
  if(noOne == 1){
    sendText("Nobody currently owes " + user + ".")
  }
}

function listOwedBy(user,array){
  var noOne = 1;
  if(array[0].includes(user) == false){
    sendText(user + " is not a known user. To view the full user list, use the command '.users'");
    return;
  }
  var userIndex = getNameIndex(user,array[0]);
  for(var i=1; i<numFilledRows(array)+1; i++){
    var valueOwed = array[i][userIndex];
    if(valueOwed != "0" && userIndex != i){
      sendText("➣ " + user + " owes " + array[0][i] + " $" + valueOwed.toFixed(2));
      noOne = 0;
    }
  }
  if(noOne == 1){
    sendText(user + " owes nobody.")
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
    sendText("Cleared all user tabs.");
  }
  else if(textArray[1].toLowerCase() == "owedby"){
    for(var i=2;i<textArray.length;i++){
      var index = getNameIndex(textArray[i].toLowerCase(),array[0]);
      for(var j=1; j<numFilledRows(array)+1; j++){
        array[j][index] = "0";
      }
      if(array[0].includes(textArray[i].toLowerCase())){
        sendText("Cleared all owed by " + textArray[i] + ".");
      }
      else{
        sendText(textArray[i] + "is not a known user. To view the full user list, use the command '.users'");
      }
    }
  }

  else if(textArray[1].toLowerCase() == "owedto"){
    for(var i=2;i<textArray.length;i++){
      var index = getNameIndex(textArray[i].toLowerCase(),array[0]);
      for(var j=1; j<numFilledRows(array)+1; j++){
        array[index][j] = "0";
      }
      if(array[0].includes(textArray[i].toLowerCase())){
        sendText("Cleared all owed to " + textArray[i] + ".");
      }
      else{
        sendText(textArray[i] + "is not a known user. To view the full user list, use the command '.users'");
      }
    }
  }
  updateSpreadsheet(array);
}

function listUsers(array){
  var i = 1;
  var string = "";
  sendText("All existing usernames: ")
  while(array[0][i] != ""){
    sendText("➣ " + array[0][i]);
    i++;
  }
  sendText(string);
}

function logTransaction(textArray,array){
  var totalValue = parseFloat(textArray[1]);
  var personOwed = textArray[2].toLowerCase();
  var personOwedIndex = getNameIndex(personOwed,array[0]);
  var inOrExclusive = textArray[textArray.length-1].toLowerCase();
  if(array[0].includes(personOwed) == false){
    sendText(textArray[2] + " is not a known user. Transaction canceled. To see the full user list, use the command '.users'");
    return;
  }
  if(textArray[3].toLowerCase() == "all" && inOrExclusive == "in"){
    var valueLogged = totalValue / numFilledRows(array);
    sendText("Value logged per person: " + valueLogged.toFixed(2));
    for(var j=1; j<numFilledRows(array)+1; j++){
      array[personOwedIndex][j] = (parseFloat(array[personOwedIndex][j] + valueLogged)).toString();
    }
  }
  else if(textArray[3].toLowerCase() == "all" && inOrExclusive == "ex"){
    var valueLogged = totalValue / (numFilledRows(array)-1);
    sendText("Value logged per person: " + valueLogged.toFixed(2));
    for(var j=1; j<numFilledRows(array)+1; j++){
      array[personOwedIndex][j] = (parseFloat(array[personOwedIndex][j] + valueLogged)).toString();
    }
  }
  else if(inOrExclusive == "in"){
    var numPeople = textArray.length - 3;
    var valueLogged = totalValue / numPeople;
    for(var i=2; i<textArray.length-1; i++){
      var owerIndex = getNameIndex(textArray[i].toLowerCase(),array[0]);
      var previous = getVal(personOwed,textArray[i],array);
      if(array[0].includes(textArray[i].toLowerCase())){
        array[personOwedIndex][owerIndex] = (parseFloat(previous) + valueLogged).toString();
      }
      else {
        sendText(textArray[i] + " is not a known user. Transaction canceled. To see the full user list, use the command '.users'");
        return;
      }
    }
  }
  else if(inOrExclusive == "ex"){
    var numPeople = textArray.length - 4;
    var valueLogged = totalValue / numPeople;
    for(var i=3; i<textArray.length-1; i++){
      var owerIndex = getNameIndex(textArray[i].toLowerCase(),array[0]);
      var previous = getVal(personOwed,textArray[i],array);
      if(array[0].includes(textArray[i].toLowerCase())){
        array[personOwedIndex][owerIndex] = (parseFloat(previous) + valueLogged).toString();
      }
      else{
        sendText(textArray[i] + " is not a known user. Transaction canceled. To see the full user list, use the command '.users'");
        return;
      }
    }
  }
  else{
    sendText("Please specify if this transaction is inclusive or exclusive.");
    return;
  }
  array[personOwedIndex][personOwedIndex] = "0";
  updateSpreadsheet(array);
  sendText("Transaction completed.");
}

function newUsersCommand(namesArray,array){
  for(var i=1; i<namesArray.length; i++){
      if(array.some(row => row.includes(namesArray[i].toLowerCase()))){
        sendText("Username '" + namesArray[i] + "' is already taken. Please select another.");
      }
      else{
        addUser(namesArray[i].toLowerCase(),array);
        updateSpreadsheet(array);
        sendText("➣ User '" + namesArray[i] + "' successfully added.");
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

function getVal(owee,ower,array){ //gets amount ower owes owee
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
  for (var index in array){
    if(name.toLowerCase() == array[index]){
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