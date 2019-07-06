function createFormTrigger() {
  var triggerFunctionName = "addFormResponseIdAndUrl_";
  deleteAllExistingTriggers_();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger(triggerFunctionName)
    .forSpreadsheet(spreadsheet)
    .onFormSubmit()
    .create();
}

function deleteAllExistingTriggers_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function addFormResponseIdAndUrl_(e) {
  
  // Get the Google Form linked to the response
  var responseSheet = e.range.getSheet();
  var googleFormUrl = responseSheet.getFormUrl();
  var googleForm = FormApp.openByUrl(googleFormUrl);

  // Loop through form responses backward (most recent first) and check for match
  var formResponses = googleForm.getResponses();
  for (var i = formResponses.length - 1; i >=0; i--) {
    var formResponse = formResponses[i]
    if(isEqual_(e.values, formResponse)) { break; }
  }
  
  // Get the Form response URL and Id and add it to the Google Spreadsheet
  var responseUrl = formResponse.getEditResponseUrl();
  var responseId = formResponse.getId();
  var row = e.range.getRow();
  var responseColumn = e.values.length + 1;
  responseSheet.getRange(row, responseColumn, 1, 2).setValues([[responseId, responseUrl]]);
}

function isEqual_(sheetValues, formResponse) {
  // Does not take into account timestamp (Google Form and Sheets timestamp often differ by 1 second)
  // Should be ok unless...
  // from time when addFormResponseIdAndUrl_ starts to var formResponses = googleForm.getResponses() (~0.5 seconds)...
  // another response with exact same answers is submitted
  
  // uncomment these two lines to see that the Sheet timestamp and Form timestamp differ
  // Logger.log(sheetValues[0]);
  // Logger.log(formResponse.getTimestamp());
  
  sheetValues.shift(); // remove timestamp and check all other values
  var itemResponses = formResponse.getItemResponses();
  for (var i = 0; i < sheetValues.length; i++) {
    if (sheetValues[i] != itemResponses[i].getResponse()) { return false }
  }
  return true;
}
