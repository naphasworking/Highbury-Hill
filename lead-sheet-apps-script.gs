/**
 * HIGHBURY HILL — Lead capture into Google Sheet
 *
 * SETUP (one time):
 * 1. Open your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1eSZHYvgpjN9vp7wpeJXvhkn43aULKjjbPL3qdpqZ2ZE/edit
 * 2. Menu:  Extensions → Apps Script
 * 3. Delete any sample code, paste ALL of this file, click Save (disk icon).
 * 4. Click  Deploy → New deployment.
 *      - Click the gear ⚙ → choose "Web app"
 *      - Description: Highbury Hill leads
 *      - Execute as:        Me
 *      - Who has access:    Anyone
 *      - Click Deploy → Authorize access → allow.
 * 5. Copy the "Web app URL" (ends with /exec) and send it to me
 *    (or paste it into LEAD_ENDPOINT in script.js).
 *
 * The first row of headers is created automatically on the first submission.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');

    // Add a header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Mobile',
                       'Email', 'Unit Type', 'Budget', 'Language', 'Page']);
    }

    var p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      p.firstName || '',
      p.lastName  || '',
      p.mobile    || '',
      p.email     || '',
      p.unitType  || '',
      p.budget    || '',
      p.lang      || '',
      p.page      || ''
    ]);

    return ContentService.createTextOutput('OK');
  } finally {
    lock.releaseLock();
  }
}

// Lets you test the deployment by opening the URL in a browser.
function doGet() {
  return ContentService.createTextOutput('Highbury Hill lead endpoint is live.');
}
