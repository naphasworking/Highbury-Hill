/**
 * HIGHBURY HILL — Lead capture into Google Sheet
 *
 * This version writes to your sheet BY ID, so it always lands in the right
 * spreadsheet no matter how the script was created.
 *
 * UPDATE STEPS:
 * 1. Google Sheet → Extensions → Apps Script
 * 2. Replace ALL code with this, click Save 💾
 * 3. Run the function "setup" once (select "setup" in the toolbar dropdown →
 *    click Run → Authorize/allow). This creates the Leads tab + headers and
 *    confirms access.
 * 4. Deploy → Manage deployments → click the pencil ✏ on your web app →
 *    Version: "New version" → Deploy.  (The /exec URL stays the same.)
 */

var SHEET_ID = '1eSZHYvgpjN9vp7wpeJXvhkn43aULKjjbPL3qdpqZ2ZE';
var TAB_NAME = 'Leads';

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Mobile',
                     'Email', 'Unit Type', 'Budget', 'Language', 'Page']);
  }
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) || {};
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

function doGet() {
  return ContentService.createTextOutput('Highbury Hill lead endpoint is live.');
}

/* Run once from the editor to create headers + grant access. */
function setup() {
  var sheet = getSheet_();
  sheet.appendRow([new Date(), 'SETUP', 'OK', '', '', '', '', '', 'ran from editor']);
}
