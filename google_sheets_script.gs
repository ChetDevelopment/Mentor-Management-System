// ====================================================================
// Paste this entire script into Google Sheets:
//   1. Open Google Sheets → Extensions → Apps Script
//   2. Delete any existing code, paste this entire file
//   3. Click "Run" → select "generateTestReport" → Authorize
//   4. A new sheet "API Test Report" will be created
// ====================================================================

var DATA = [
  ["Health","Health check","Positive",200,200,"PASS"],
  ["Skills","List all (public)","Positive",200,200,"PASS"],
  ["Skills","Create (admin)","Positive",201,201,"PASS"],
  ["Skills","Duplicate name","Negative",400,400,"PASS"],
  ["Skills","Empty body","Negative",400,400,"PASS"],
  ["Skills","Create by non-admin","Negative",403,403,"PASS"],
  ["Skills","Get by ID","Positive",200,200,"PASS"],
  ["Skills","Get non-existent","Negative",404,404,"PASS"],
  ["Skills","Update (admin)","Positive",200,200,"PASS"],
  ["Skills","Update by non-admin","Negative",403,403,"PASS"],
  ["Skills","Delete (admin)","Positive",200,200,"PASS"],
  ["Skills","Get deleted","Negative",404,404,"PASS"],
  ["Skills","By category","Positive",200,200,"PASS"],
  ["Skills","Unknown field","Negative",400,400,"PASS"],
  ["Categories","List all (public)","Positive",200,200,"PASS"],
  ["Categories","Get by ID","Positive",200,200,"PASS"],
  ["Categories","Create (admin)","Positive",201,201,"PASS"],
  ["Categories","Duplicate name","Negative",400,400,"PASS"],
  ["Categories","Update (admin)","Positive",200,200,"PASS"],
  ["Categories","Create by non-admin","Negative",403,403,"PASS"],
  ["Categories","Delete (admin)","Positive",200,200,"PASS"],
  ["Notifications","Create (admin)","Positive",201,201,"PASS"],
  ["Notifications","Create by non-admin","Negative",403,403,"PASS"],
  ["Notifications","List notifications","Positive",200,200,"PASS"],
  ["Notifications","Get unread","Positive",200,200,"PASS"],
  ["Notifications","Get detail","Positive",200,200,"PASS"],
  ["Notifications","Mark as read","Positive",200,200,"PASS"],
  ["Notifications","Mark all read","Positive",200,200,"PASS"],
  ["Notifications","Delete","Positive",200,200,"PASS"],
  ["Notifications","Delete non-existent","Negative",404,404,"PASS"],
  ["Resources","Upload (mentor)","Positive",201,201,"PASS"],
  ["Resources","Upload by non-mentor","Negative",403,403,"PASS"],
  ["Resources","Missing title","Negative",400,400,"PASS"],
  ["Resources","Get public","Positive",200,200,"PASS"],
  ["Resources","Delete (mentor)","Positive",200,200,"PASS"],
  ["Resources","Delete non-existent","Negative",404,404,"PASS"],
  ["Availability","Get public","Positive",200,200,"PASS"],
  ["Availability","Get slots by date","Positive",200,200,"PASS"],
  ["Availability","Set (mentor)","Positive",201,201,"PASS"],
  ["Availability","Set by non-mentor","Negative",403,403,"PASS"],
  ["Availability","Update (mentor)","Positive",200,200,"PASS"],
  ["Availability","Delete (mentor)","Positive",200,200,"PASS"],
  ["Availability","Block date (mentor)","Positive",201,201,"PASS"],
  ["Availability","Unblock date (mentor)","Positive",200,200,"PASS"]
];

function generateTestReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("API Test Report");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("API Test Report");

  // --- HEADER / TITLE ---
  var titleRow = ["Mentor Management System — API Test Report", "", "", "", "", ""];
  sheet.getRange(1, 1, 1, 6).merge();
  sheet.getRange(1, 1).setValue("Mentor Management System — API Test Report")
    .setFontSize(16).setFontWeight("bold").setFontColor("#1a237e");
  sheet.getRange(1, 1).setBackground("#e8eaf6");

  // --- DATE ---
  sheet.getRange(2, 1, 1, 6).merge();
  sheet.getRange(2, 1).setValue("Date: " + new Date().toLocaleDateString() + "  |  Server: http://localhost:3000/api/v1")
    .setFontSize(10).setFontColor("#666666");

  // --- SUMMARY ---
  var total = DATA.length;
  var passed = DATA.filter(function(r) { return r[5] === "PASS"; }).length;
  var failed = DATA.filter(function(r) { return r[5] === "FAIL"; }).length;
  var positive = DATA.filter(function(r) { return r[2] === "Positive"; }).length;
  var negative = DATA.filter(function(r) { return r[2] === "Negative"; }).length;
  var posPass = DATA.filter(function(r) { return r[2] === "Positive" && r[5] === "PASS"; }).length;
  var negPass = DATA.filter(function(r) { return r[2] === "Negative" && r[5] === "PASS"; }).length;

  sheet.getRange(4, 1, 1, 6).merge();
  sheet.getRange(4, 1).setValue("SUMMARY").setFontSize(12).setFontWeight("bold").setBackground("#263238").setFontColor("#ffffff");

  var summary = [
    ["Total Tests", total, "Passed", passed, "Failed", failed],
    ["Positive Tests", positive, "Positive PASS", posPass, "Positive FAIL", positive - posPass],
    ["Negative Tests", negative, "Negative PASS", negPass, "Negative FAIL", negative - negPass],
    ["Success Rate", "", (passed / total * 100).toFixed(1) + "%", "", "", ""]
  ];

  for (var r = 0; r < summary.length; r++) {
    for (var c = 0; c < 6; c++) {
      var cell = sheet.getRange(5 + r, c + 1);
      cell.setValue(summary[r][c]).setFontSize(11).setBorder(true, true, true, true, true, true);
      if (c % 2 === 0) cell.setFontWeight("bold").setBackground("#f5f5f5");
    }
  }
  sheet.getRange(5, 3, 1, 2).setFontColor("#2e7d32");
  sheet.getRange(6, 3, 1, 2).setFontColor("#2e7d32");
  sheet.getRange(7, 3, 1, 2).setFontColor("#2e7d32");

  // --- TABLE HEADER ---
  var startRow = 10;
  var headers = ["Section", "Test Case", "Type", "Expected Status", "Actual Status", "Result"];
  var headerRange = sheet.getRange(startRow, 1, 1, 6);
  for (var h = 0; h < headers.length; h++) {
    headerRange.getCell(1, h + 1).setValue(headers[h])
      .setFontWeight("bold").setFontSize(11)
      .setBackground("#1565c0").setFontColor("#ffffff")
      .setHorizontalAlignment("center").setBorder(true, true, true, true, true, true);
  }

  // --- DATA ---
  var currentSection = "";
  for (var i = 0; i < DATA.length; i++) {
    var row = DATA[i];
    var rowNum = startRow + 1 + i;
    var isNewSection = row[0] !== currentSection;
    currentSection = row[0];

    var values = [row[0], row[1], row[2], row[3], row[4], row[5]];
    var dataRange = sheet.getRange(rowNum, 1, 1, 6);

    for (var c = 0; c < 6; c++) {
      var cell = dataRange.getCell(1, c + 1);
      cell.setValue(values[c]).setFontSize(10).setBorder(true, true, true, true, true, true);

      // Section column styling
      if (c === 0) {
        cell.setFontWeight("bold");
        if (isNewSection) cell.setBackground("#e3f2fd");
      }

      // Type column
      if (c === 2) {
        cell.setHorizontalAlignment("center");
        if (row[2] === "Positive") { cell.setFontColor("#2e7d32"); cell.setBackground("#e8f5e9"); }
        else { cell.setFontColor("#e65100"); cell.setBackground("#fff3e0"); }
      }

      // Expected/Actual columns
      if (c === 3 || c === 4) {
        cell.setHorizontalAlignment("center");
        var code = parseInt(values[c]);
        if (code >= 200 && code < 300) cell.setFontColor("#2e7d32");
        else if (code >= 400 && code < 500) cell.setFontColor("#e65100");
        else cell.setFontColor("#c62828");
      }

      // Result column
      if (c === 5) {
        cell.setHorizontalAlignment("center").setFontWeight("bold");
        if (row[5] === "PASS") { cell.setBackground("#c8e6c9"); cell.setFontColor("#1b5e20"); }
        else { cell.setBackground("#ffcdd2"); cell.setFontColor("#b71c1c"); }
      }
    }

    // Alternating row background
    if (!isNewSection && i % 2 === 1) {
      for (var c = 1; c < 6; c++) {
        dataRange.getCell(1, c + 1).setBackground("#fafafa");
      }
    }
  }

  // --- FREEZE HEADERS ---
  sheet.setFrozenRows(startRow);

  // --- COLUMN WIDTHS ---
  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 240);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 100);

  // --- ADD BUG REPORT SECTION ---
  var bugRow = startRow + 1 + DATA.length + 3;
  sheet.getRange(bugRow, 1, 1, 6).merge();
  sheet.getRange(bugRow, 1).setValue("BUGS FIXED").setFontSize(12).setFontWeight("bold")
    .setBackground("#b71c1c").setFontColor("#ffffff");

  var bugs = [
    ["Skills Duplicate", "POST /skills duplicate name returned 500", "FIXED — now returns 400", "Skills Service"],
    ["Categories Duplicate", "POST /categories duplicate name returned 500", "FIXED — now returns 400", "Categories Service"],
    ["Global DB Error", "TypeORM QueryFailedError leaked 500", "FIXED — ER_DUP_ENTRY caught as 400", "Exception Filter"],
    ["Seed Compile Error", "seed.ts had 3 TS errors", "FIXED — availabilityStatus, careerGoal, CONFIRMED", "Seed Script"],
    ["mentor_skills Corrupted", "Table had missing columns", "FIXED — dropped and TypeORM recreated", "Database"]
  ];

  for (var b = 0; b < bugs.length; b++) {
    var br = bugRow + 1 + b;
    sheet.getRange(br, 1, 1, 6).merge();
    sheet.getRange(br, 1).setValue("BUG #" + (b + 1) + " → " + bugs[b][0] + ": " + bugs[b][1] + " → " + bugs[b][2])
      .setFontSize(10).setBorder(true, true, true, true, true, true)
      .setBackground(b % 2 === 0 ? "#ffebee" : "#ffffff");
  }

  SpreadsheetApp.flush();
  Logger.log("Report generated! " + passed + "/" + total + " passed.");
}
