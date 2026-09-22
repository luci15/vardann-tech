/**
 * ============================================================================
 * VARDANN TECH - GOOGLE APPS SCRIPT FOR BROCHURE LEADS
 * ============================================================================
 * 
 * INSTRUCTIONS TO SET UP OR FIX YOUR GOOGLE SHEET:
 * 
 * 1. Open your Google Sheet in your web browser.
 * 2. In the top menu, click on: Extensions > Apps Script
 * 3. Delete any code currently in the editor (Code.gs).
 * 4. Paste the ENTIRE code below into the editor.
 * 5. Click the floppy disk icon ("Save project") or press Ctrl + S.
 * 
 * --- CRITICAL DEPLOYMENT STEP (Most common reason for failure) ---
 * 6. In the top right corner, click on "Deploy" > "Manage deployments".
 *    - Click the pencil icon (Edit) next to your active deployment.
 *    - In the "Version" dropdown, click "New version".
 *    - Ensure "Execute as" is set to: "Me (your email)".
 *    - Ensure "Who has access" is set to: "Anyone" (NOT "Only myself").
 *    - Click "Deploy".
 *    (Alternatively, if creating a new one: Deploy > New deployment > Web app >
 *     Execute as: Me > Who has access: Anyone > Deploy).
 * 7. Copy the "Web app URL" (ends with /exec).
 * 8. In your project's .env.local file, verify that GOOGLE_SHEET_WEBHOOK_URL
 *    matches this Web app URL.
 * ============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other processes to finish to avoid concurrency locks
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // If the sheet is empty, automatically add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Company"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#f3f4f6");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = new Date();
    var name = data.name || "";
    var email = data.email || "";
    var phone = data.phone || "";
    var company = data.company || "";

    // Append the lead to the next available row
    sheet.appendRow([timestamp, name, email, phone, company]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Lead added successfully" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Optional GET handler so you can open the Web App URL in your browser to verify it is online
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ready",
      message: "Vardann Tech Google Sheet Webhook is active and responding."
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
