# append-google-forms-edit-response-link
On Google Form submission, append the response id and edit response link to the Google Sheet row. Supports rapid form submissions.

# Usage
1. In the Google Sheet linked to your Google Form(s), go to Tools > Script Editor
2. Copy Code.gs from this repository into the Script Editor
3. In the Script Editor, go to Run > Run function > createFormTrigger
4. Now on each Google Form submission, the response id and edit response link will be added to the end of the row; it also works for multiple forms if you link more than one to your spreadsheet.

# Note
Many other scripts that add the edit response url grab the last form response, but if responses are submitted in rapid succession, this can cause the wrong url to be posted in the Google Sheet row. 

This implementation tries to more accurately match the form response with the corresponding row by comparing the form submit event object values to the form response item response values. Unfortunately, the timestamp in Google Sheets and Google Forms seem to differ by about one second, so you can't match a row to a response based on the timestamp.

The best we can do is compare all the form response values to the form submit event object values. This should be enough to uniquely match the response to the correct row unless two responses are received with identical values in rapid succession (less than ~0.5 seconds).

# Relevent Documentation
https://developers.google.com/apps-script/guides/triggers/events#form-submit

https://developers.google.com/apps-script/reference/forms/form-response

https://developers.google.com/apps-script/reference/script/script-app
