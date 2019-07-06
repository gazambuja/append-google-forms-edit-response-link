# append-google-forms-edit-response-link
On Google Form submission, append a the response id and edit response link to Google Sheet row.

# Usage
1. In the Google Sheet linked to your Google Form(s), go to Tools > Script Editor
2. Copy Code.gs from this repository into the Script Editor
3. In the Script Editor, go to Run > Run function > createFormTrigger
4. Now on each Google Form submission, the response id and edit response link will be added to the end of the row; it also works if you link multiple forms to one spreadsheet.

# Note
The timestamp in Google Sheets and Google Forms seem to differ by about 1 second. Because of this, the script cannot use the Sheets Form Submit event object timestamp to match the exact Google Form Response. Instead the script checks if all of the other values are equal. This should be enough to uniquely match the Sheets Form Submit event object to a Google Form Response unless two Google Form Responses are received with identical values in rapid success (roughly less than 0.5 seconds).
