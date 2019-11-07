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
  
  // Get the values submitted to the sheet
  // (can't rely on e.values since it returns empty strings for unedited fields when an editted response is submitted)
  var sheetValues = e.range.getValues()[0];
  var sheetTitles = responseSheet.getRange(1, 1, 1, sheetValues.length).getValues()
  
  // Loop through form responses backward (most recent first) and check for match
  var formResponses = googleForm.getResponses();
  for (var i = formResponses.length - 1; i >=0; i--) {
    var formResponse = formResponses[i];
    if(isEqual_(sheetTitles, sheetValues, formResponse)) { break; }
  }
  
  // Get the Form response URL and Id and add it to the Google Spreadsheet
  var responseUrl = formResponse.getEditResponseUrl();
  var responseId = formResponse.getId();
  var row = e.range.getRow();
  var responseColumn = e.values.length + 1;
  responseSheet.getRange(row, responseColumn, 1, 2).setValues([[responseId, responseUrl]]);
}

function isEqual_(sheetTitles, sheetValues, formResponse) {
  // Does not take into account timestamp (Google Form and Sheets timestamp often differ by 1 second)
  // Should be ok unless...
  // from time when addFormResponseIdAndUrl_ starts to var formResponses = googleForm.getResponses() (~0.5 seconds)...
  // another response with exact same answers is submitted
  
  
  sheetValues.shift(); // remove timestamp and check all other values
  var itemResponses = formResponse.getItemResponses();

  for (var i = 0; i < sheetValues.length; i++) {
    Logger.log("---" + i + "---")
    
    try {
      var sv = Utilities.formatDate(sheetValues[i], "GMT", "yyyy-MM-dd");
    } catch (e) {
      var sv = sheetValues[i];
    }

    Logger.log("Title sv " + sheetTitles[i])    
    if ( itemResponses[i] != undefined && sheetTitles[i] == itemResponses[i].getItem().getTitle() ){
      Logger.log("Title ir " + itemResponses[i].getItem().getTitle())
      try {
        var ir = Utilities.formatDate(itemResponses[i].getResponse(), "GMT", "yyyy-MM-dd");
      } catch (e) {
        var ir = itemResponses[i].getResponse();
      }
      
      Logger.log("Comparing " + sv + " with " + ir)
      
      if (sv != ir) {
        Logger.log("Compare FALSE");
        return false;
      }else{
        Logger.log("Compare TRUE");
      }
      
    } else {
      Logger.log(".Compare FALSE");
      return false
    }
  }

  Logger.log("FINISH TRUE")
  return true;
}
