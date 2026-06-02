/**
 * 📋 Mentor Management System — Test Case Generator
 * 
 * HOW TO USE:
 * 1. Open Google Sheets: https://sheets.new
 * 2. Go to Extensions → Apps Script
 * 3. Delete default code, paste this entire file
 * 4. Click Save (💾) then Run (▶)
 * 5. Authorize when prompted
 * 6. Refresh your sheet
 * 
 * This will generate:
 *   - "Test Cases" sheet with 130 pre-filled test cases
 *   - "Dashboard" sheet with pass/fail summary
 *   - "Bug Report" sheet for tracking bugs
 *   - Data validation dropdowns, conditional formatting, filters
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🧪 MMS Test Suite')
    .addItem('🔄 Generate Test Cases', 'generateAllSheets')
    .addItem('📊 Refresh Dashboard', 'refreshDashboard')
    .addSeparator()
    .addItem('❌ Clear All Data', 'clearAllSheets')
    .addToUi();
}

function generateAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Remove existing sheets
  ['Test Cases', 'Dashboard', 'Bug Report'].forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) ss.deleteSheet(sheet);
  });

  createTestCasesSheet(ss);
  createDashboardSheet(ss);
  createBugReportSheet(ss);

  SpreadsheetApp.getUi().alert(
    '✅ Done! Generated:\n' +
    '• Test Cases — 130 test cases across 14 modules\n' +
    '• Dashboard — Live pass/fail summary\n' +
    '• Bug Report — Bug tracking sheet\n\n' +
    'Use the "🧪 MMS Test Suite" menu to refresh.'
  );
}

// ============================================================
// TEST CASES SHEET
// ============================================================
function createTestCasesSheet(ss) {
  const sheet = ss.insertSheet('Test Cases', 0);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  // Headers
  const headers = [
    'TC ID', 'Status', 'Module', 'Feature', 'Test Type', 'Priority',
    'Description', 'Preconditions', 'Test Steps',
    'Test Data (JSON)', 'Expected Result', 'Actual Result',
    'Bug ID', 'Tester', 'Date Tested', 'Environment', 'Notes'
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground('#1a73e8');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Test data
  const testCases = getTestCases();
  if (testCases.length === 0) return;

  const dataRange = sheet.getRange(2, 1, testCases.length, headers.length);
  dataRange.setValues(testCases);

  // Column widths
  sheet.setColumnWidth(1, 80);   // TC ID
  sheet.setColumnWidth(2, 80);   // Status
  sheet.setColumnWidth(3, 100);  // Module
  sheet.setColumnWidth(4, 120);  // Feature
  sheet.setColumnWidth(5, 100);  // Test Type
  sheet.setColumnWidth(6, 80);   // Priority
  sheet.setColumnWidth(7, 250);  // Description
  sheet.setColumnWidth(8, 200);  // Preconditions
  sheet.setColumnWidth(9, 300);  // Test Steps
  sheet.setColumnWidth(10, 250); // Test Data
  sheet.setColumnWidth(11, 250); // Expected Result
  sheet.setColumnWidth(12, 200); // Actual Result
  sheet.setColumnWidth(13, 80);  // Bug ID
  sheet.setColumnWidth(14, 100); // Tester
  sheet.setColumnWidth(15, 100); // Date
  sheet.setColumnWidth(16, 100); // Environment
  sheet.setColumnWidth(17, 200); // Notes

  // Status dropdown validation
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['⏳ Pending', '✅ Pass', '❌ Fail', '⛔ Blocked', '⬜ Not Tested'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 2, testCases.length, 1).setDataValidation(statusRule);
  sheet.getRange(2, 2, testCases.length, 1).setValue('⏳ Pending');

  // Test Type dropdown
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Positive', 'Negative', 'Edge Case'], true)
    .build();
  sheet.getRange(2, 5, testCases.length, 1).setDataValidation(typeRule);

  // Priority dropdown
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High', 'Medium', 'Low'], true)
    .build();
  sheet.getRange(2, 6, testCases.length, 1).setDataValidation(priorityRule);

  // Environment dropdown
  const envRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Local', 'Staging', 'Production'], true)
    .build();
  sheet.getRange(2, 16, testCases.length, 1).setDataValidation(envRule);
  sheet.getRange(2, 16, testCases.length, 1).setValue('Local');

  // Auto date
  sheet.getRange(2, 15, testCases.length, 1).setValue(new Date().toISOString().split('T')[0]);

  // Conditional formatting — Status colors
  const statusCol = sheet.getRange(2, 2, testCases.length, 1);
  const rules = sheet.getConditionalFormatRules();

  // Green for Pass
  const passRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('✅ Pass')
    .setBackground('#d4edda')
    .setFontColor('#155724')
    .setRanges([statusCol])
    .build();

  // Red for Fail
  const failRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('❌ Fail')
    .setBackground('#f8d7da')
    .setFontColor('#721c24')
    .setRanges([statusCol])
    .build();

  // Yellow for Blocked
  const blockedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('⛔ Blocked')
    .setBackground('#fff3cd')
    .setFontColor('#856404')
    .setRanges([statusCol])
    .build();

  // Gray for Pending
  const pendingRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('⏳ Pending')
    .setBackground('#e2e3e5')
    .setFontColor('#383d41')
    .setRanges([statusCol])
    .build();

  rules.push(passRule, failRule, blockedRule, pendingRule);
  sheet.setConditionalFormatRules(rules);

  // Auto-filter
  const lastRow = testCases.length + 1;
  const filterRange = sheet.getRange(1, 1, lastRow, headers.length);
  filterRange.createFilter();

  // Alternate row colors
  const altRange = sheet.getRange(2, 1, testCases.length, headers.length);
  const bgValues = [];
  for (let i = 0; i < testCases.length; i++) {
    bgValues.push([Array(headers.length).fill(i % 2 === 0 ? '#ffffff' : '#f8f9fa')]);
  }
  // Apply alternating only to non-status columns via conditional formatting is simpler
}

// ============================================================
// DASHBOARD SHEET
// ============================================================
function createDashboardSheet(ss) {
  const sheet = ss.insertSheet('Dashboard', 1);
  sheet.setFrozenRows(0);

  const modules = [
    'Auth', 'Auth Guard', 'Users', 'Skills', 'Mentors', 'Mentees',
    'Sessions', 'Matchings', 'Feedback', 'Notifications', 'Admin',
    'Activity Logs', 'Resources', 'Availability'
  ];

  // Title
  sheet.getRange('A1').setValue('📊 TEST SUMMARY DASHBOARD');
  sheet.getRange('A1').setFontSize(18);
  sheet.getRange('A1').setFontWeight('bold');
  sheet.mergeRange('A1', 'A1', 1, 6);

  // Summary stats
  sheet.getRange('A3').setValue('TOTAL TESTS:');
  sheet.getRange('B3').setFormula('=COUNTA(\'Test Cases\'!A2:A)');
  sheet.getRange('A3:B3').setFontWeight('bold');

  sheet.getRange('A4').setValue('✅ PASSED:');
  sheet.getRange('B4').setFormula('=COUNTIF(\'Test Cases\'!B2:B, "✅ Pass")');
  sheet.getRange('B4').setFontColor('#155724');

  sheet.getRange('A5').setValue('❌ FAILED:');
  sheet.getRange('B5').setFormula('=COUNTIF(\'Test Cases\'!B2:B, "❌ Fail")');
  sheet.getRange('B5').setFontColor('#721c24');

  sheet.getRange('A6').setValue('⏳ PENDING:');
  sheet.getRange('B6').setFormula('=COUNTIF(\'Test Cases\'!B2:B, "⏳ Pending")');
  sheet.getRange('B6').setFontColor('#383d41');

  sheet.getRange('A7').setValue('PASS RATE:');
  sheet.getRange('B7').setFormula('=IF(B3=0,0,ROUND(B4/B3*100,1))');
  sheet.getRange('B7').setNumberFormat('0.0"%');
  sheet.getRange('B7').setFontWeight('bold');

  // Module breakdown
  sheet.getRange('A9').setValue('Module');
  sheet.getRange('B9').setValue('Total');
  sheet.getRange('C9').setValue('✅ Pass');
  sheet.getRange('D9').setValue('❌ Fail');
  sheet.getRange('E9').setValue('⏳ Pending');
  sheet.getRange('F9').setValue('Pass Rate');

  const headerRow = sheet.getRange('A9:F9');
  headerRow.setBackground('#1a73e8');
  headerRow.setFontColor('#ffffff');
  headerRow.setFontWeight('bold');

  modules.forEach((mod, i) => {
    const row = 10 + i;
    sheet.getRange(`A${row}`).setValue(mod);

    // Total
    sheet.getRange(`B${row}`).setFormula(
      `=COUNTIF('Test Cases'!C2:C, "${mod}")`
    );
    // Pass
    sheet.getRange(`C${row}`).setFormula(
      `=COUNTIFS('Test Cases'!C2:C, "${mod}", 'Test Cases'!B2:B, "✅ Pass")`
    );
    // Fail
    sheet.getRange(`D${row}`).setFormula(
      `=COUNTIFS('Test Cases'!C2:C, "${mod}", 'Test Cases'!B2:B, "❌ Fail")`
    );
    // Pending
    sheet.getRange(`E${row}`).setFormula(
      `=COUNTIFS('Test Cases'!C2:C, "${mod}", 'Test Cases'!B2:B, "⏳ Pending")`
    );
    // Pass Rate
    sheet.getRange(`F${row}`).setFormula(
      `=IF(B${row}=0,0,ROUND(C${row}/B${row}*100,1))`
    );
    sheet.getRange(`F${row}`).setNumberFormat('0.0"%');
  });

  // Total row
  const totalRow = 10 + modules.length;
  sheet.getRange(`A${totalRow}`).setValue('TOTAL');
  sheet.getRange(`A${totalRow}`).setFontWeight('bold');
  sheet.getRange(`B${totalRow}`).setFormula('=SUM(B10:B' + (totalRow - 1) + ')');
  sheet.getRange(`C${totalRow}`).setFormula('=SUM(C10:C' + (totalRow - 1) + ')');
  sheet.getRange(`D${totalRow}`).setFormula('=SUM(D10:D' + (totalRow - 1) + ')');
  sheet.getRange(`E${totalRow}`).setFormula('=SUM(E10:E' + (totalRow - 1) + ')');
  sheet.getRange(`F${totalRow}`).setFormula('=IF(B' + totalRow + '=0,0,ROUND(C' + totalRow + '/B' + totalRow + '*100,1))');
  sheet.getRange(`F${totalRow}`).setNumberFormat('0.0"%');

  // Column widths
  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 70);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidth(4, 70);
  sheet.setColumnWidth(5, 70);
  sheet.setColumnWidth(6, 80);

  // Conditional formatting for pass rate
  const rateRange = sheet.getRange(10, 6, modules.length + 1, 1);
  const rateRules = sheet.getConditionalFormatRules();

  const highRate = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(80)
    .setBackground('#d4edda')
    .setFontColor('#155724')
    .setRanges([rateRange])
    .build();

  const midRate = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(50, 79)
    .setBackground('#fff3cd')
    .setFontColor('#856404')
    .setRanges([rateRange])
    .build();

  const lowRate = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(50)
    .setBackground('#f8d7da')
    .setFontColor('#721c24')
    .setRanges([rateRange])
    .build();

  rateRules.push(highRate, midRate, lowRate);
  sheet.setConditionalFormatRules(rateRules);

  // Pie chart
  const chart = sheet.newChart()
    .asPieChart()
    .addRange(sheet.getRange('A4:A6'))
    .addRange(sheet.getRange('B4:B6'))
    .setPosition(1, 8, 0, 0)
    .setTitle('Test Results Overview')
    .setOption('colors', ['#28a745', '#dc3545', '#6c757d'])
    .setOption('height', 300)
    .setOption('width', 400)
    .build();
  sheet.insertChart(chart);

  // Column chart for module results
  const barChart = sheet.newChart()
    .asColumnChart()
    .addRange(sheet.getRange('A9:A' + (9 + modules.length)))
    .addRange(sheet.getRange('C9:C' + (9 + modules.length)))
    .addRange(sheet.getRange('D9:D' + (9 + modules.length)))
    .setPosition(18, 1, 0, 0)
    .setTitle('Pass/Fail by Module')
    .setOption('colors', ['#28a745', '#dc3545'])
    .setOption('height', 400)
    .setOption('width', 600)
    .setOption('isStacked', true)
    .build();
  sheet.insertChart(barChart);
}

// ============================================================
// BUG REPORT SHEET
// ============================================================
function createBugReportSheet(ss) {
  const sheet = ss.insertSheet('Bug Report', 2);
  sheet.setFrozenRows(1);

  const headers = [
    'Bug ID', 'Severity', 'Status', 'Module', 'TC Reference',
    'Title', 'Description', 'Steps to Reproduce',
    'Expected Result', 'Actual Result',
    'Reported By', 'Reported Date', 'Assigned To',
    'Screenshot/Logs', 'Environment', 'Fixed Date', 'Fix Commit', 'Notes'
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground('#dc3545');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  // Column widths
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 80);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 300);
  sheet.setColumnWidth(8, 300);
  sheet.setColumnWidth(9, 200);
  sheet.setColumnWidth(10, 200);
  sheet.setColumnWidth(11, 120);
  sheet.setColumnWidth(12, 100);
  sheet.setColumnWidth(13, 120);
  sheet.setColumnWidth(14, 150);
  sheet.setColumnWidth(15, 100);
  sheet.setColumnWidth(16, 100);
  sheet.setColumnWidth(17, 100);
  sheet.setColumnWidth(18, 200);

  // Bug ID auto-number formula
  sheet.getRange('A2').setFormula('=IF(ROW()=1,"",CONCATENATE("BUG-",TEXT(ROW()-1,"000")))');
  sheet.getRange('A2').autoFill(sheet.getRange('A2:A50'), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

  // Pre-fill Bug-001 as example
  sheet.getRange('G2').setValue('(Click + to add new row. Bug ID auto-generates.)');

  // Dropdowns
  const severityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['🔴 Critical', '🟠 Major', '🟡 Minor', '⚪ Trivial'], true)
    .build();
  sheet.getRange(2, 2, 50, 1).setDataValidation(severityRule);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Open', 'In Progress', 'Fixed', 'Closed', 'Won\'t Fix'], true)
    .build();
  sheet.getRange(2, 3, 50, 1).setDataValidation(statusRule);
  sheet.getRange(2, 3, 50, 1).setValue('Open');

  const moduleRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Auth', 'Auth Guard', 'Users', 'Skills', 'Mentors', 'Mentees',
      'Sessions', 'Matchings', 'Feedback', 'Notifications', 'Admin',
      'Activity Logs', 'Resources', 'Availability', 'General'
    ], true)
    .build();
  sheet.getRange(2, 4, 50, 1).setDataValidation(moduleRule);

  // Conditional formatting for severity
  const sevRange = sheet.getRange(2, 2, 50, 1);
  const bugRules = sheet.getConditionalFormatRules();

  const critRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('🔴 Critical')
    .setBackground('#f8d7da')
    .setFontColor('#721c24')
    .setRanges([sevRange])
    .build();

  const majRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('🟠 Major')
    .setBackground('#fff3cd')
    .setFontColor('#856404')
    .setRanges([sevRange])
    .build();

  bugRules.push(critRule, majRule);
  sheet.setConditionalFormatRules(bugRules);

  // Auto-filter
  sheet.getRange(1, 1, 51, headers.length).createFilter();
}

// ============================================================
// REFRESH DASHBOARD
// ============================================================
function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName('Dashboard');

  if (!dash) {
    SpreadsheetApp.getUi().alert('⚠️ No Dashboard found. Click "Generate Test Cases" first.');
    return;
  }

  // Force all formulas to recalculate
  dash.getRange('B3:B7').clear();
  dash.getRange('B3').setFormula('=COUNTA(\'Test Cases\'!A2:A)');
  dash.getRange('B4').setFormula('=COUNTIF(\'Test Cases\'!B2:B, "✅ Pass")');
  dash.getRange('B5').setFormula('=COUNTIF(\'Test Cases\'!B2:B, "❌ Fail")');
  dash.getRange('B6').setFormula('=COUNTIF(\'Test Cases\'!B2:B, "⏳ Pending")');
  dash.getRange('B7').setFormula('=IF(B3=0,0,ROUND(B4/B3*100,1))');

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('✅ Dashboard refreshed!');
}

// ============================================================
// CLEAR ALL DATA
// ============================================================
function clearAllSheets() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ Confirm Clear',
    'This will delete ALL sheets: Test Cases, Dashboard, Bug Report.\nContinue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['Test Cases', 'Dashboard', 'Bug Report'].forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) ss.deleteSheet(sheet);
  });

  ui.alert('✅ All sheets cleared.');
}

// ============================================================
// 130 PRE-FILLED TEST CASES
// ============================================================
function getTestCases() {
  const today = new Date().toISOString().split('T')[0];

  return [
    // AUTH — 20 tests (TC-001 to TC-020)
    ['TC-001', '⏳ Pending', 'Auth', 'Registration', 'Positive', 'High',
      'Register new admin user successfully',
      'User does not exist in database',
      '1. POST /api/auth/register\n2. Send valid admin data',
      '{"email":"admin@test.com","password":"Pass123!","firstName":"Admin","lastName":"User","role":"admin"}',
      '201 Created → { user: { email, role }, accessToken, refreshToken }', '', '', '', today, 'Local', ''],

    ['TC-002', '⏳ Pending', 'Auth', 'Registration', 'Positive', 'High',
      'Register new mentor user',
      'User does not exist',
      '1. POST /api/auth/register with role=mentor',
      '{"email":"mentor@test.com","password":"Pass123!","firstName":"Mentor","lastName":"User","role":"mentor"}',
      '201 Created, role="mentor"', '', '', '', today, 'Local', ''],

    ['TC-003', '⏳ Pending', 'Auth', 'Registration', 'Positive', 'High',
      'Register new mentee user',
      'User does not exist',
      '1. POST /api/auth/register with role=mentee',
      '{"email":"mentee@test.com","password":"Pass123!","firstName":"Mentee","lastName":"User","role":"mentee"}',
      '201 Created, role="mentee"', '', '', '', today, 'Local', ''],

    ['TC-004', '⏳ Pending', 'Auth', 'Registration', 'Negative', 'High',
      'Reject duplicate email registration',
      'User from TC-001 already exists',
      '1. POST /api/auth/register with same email as TC-001',
      '{"email":"admin@test.com","password":"Pass123!","firstName":"Dup","lastName":"User","role":"mentee"}',
      '400 Bad Request: "Email already registered"', '', '', '', today, 'Local', ''],

    ['TC-005', '⏳ Pending', 'Auth', 'Registration', 'Negative', 'High',
      'Reject registration with missing required fields',
      'None',
      '1. POST /api/auth/register with only email',
      '{"email":"incomplete@test.com"}',
      '400 Bad Request with validation errors', '', '', '', today, 'Local', ''],

    ['TC-006', '⏳ Pending', 'Auth', 'Registration', 'Negative', 'High',
      'Reject weak password',
      'None',
      '1. POST /api/auth/register with password < 6 chars',
      '{"email":"weak@test.com","password":"123","firstName":"Weak","lastName":"Pass","role":"mentee"}',
      '400 Bad Request: password too short', '', '', '', today, 'Local', ''],

    ['TC-007', '⏳ Pending', 'Auth', 'Registration', 'Negative', 'Medium',
      'Reject invalid email format',
      'None',
      '1. POST /api/auth/register with bad email',
      '{"email":"not-an-email","password":"Pass123!","firstName":"Bad","lastName":"Email","role":"mentee"}',
      '400 Bad Request: invalid email', '', '', '', today, 'Local', ''],

    ['TC-008', '⏳ Pending', 'Auth', 'Registration', 'Negative', 'Medium',
      'Reject invalid role enum',
      'None',
      '1. POST /api/auth/register with invalid role',
      '{"email":"bad@test.com","password":"Pass123!","firstName":"Bad","lastName":"Role","role":"superadmin"}',
      '400 Bad Request: invalid enum value', '', '', '', today, 'Local', ''],

    ['TC-009', '⏳ Pending', 'Auth', 'Login', 'Positive', 'High',
      'Login with valid credentials',
      'User from TC-001 exists',
      '1. POST /api/auth/login with valid email + password',
      '{"email":"admin@test.com","password":"Pass123!"}',
      '201 Created → { user: { id, email, role }, accessToken, refreshToken }', '', '', '', today, 'Local', ''],

    ['TC-010', '⏳ Pending', 'Auth', 'Login', 'Negative', 'High',
      'Reject wrong password',
      'User from TC-001 exists',
      '1. POST /api/auth/login with wrong password',
      '{"email":"admin@test.com","password":"WrongPassword!"}',
      '401 Unauthorized: "Invalid credentials"', '', '', '', today, 'Local', ''],

    ['TC-011', '⏳ Pending', 'Auth', 'Login', 'Negative', 'High',
      'Reject non-existent email',
      'None',
      '1. POST /api/auth/login with unregistered email',
      '{"email":"ghost@test.com","password":"Pass123!"}',
      '401 Unauthorized', '', '', '', today, 'Local', ''],

    ['TC-012', '⏳ Pending', 'Auth', 'Login', 'Negative', 'Medium',
      'Reject login with missing fields',
      'None',
      '1. POST /api/auth/login with email only',
      '{"email":"admin@test.com"}',
      '400 Bad Request: missing password', '', '', '', today, 'Local', ''],

    ['TC-013', '⏳ Pending', 'Auth', 'Password Reset', 'Positive', 'High',
      'Generate forgot password token',
      'User from TC-001 exists',
      '1. POST /api/auth/forgot-password with registered email',
      '{"email":"admin@test.com"}',
      '201 Created → { resetToken: "..." }', '', '', '', today, 'Local', ''],

    ['TC-014', '⏳ Pending', 'Auth', 'Password Reset', 'Negative', 'Medium',
      'Reject forgot password for non-existent email',
      'None',
      '1. POST /api/auth/forgot-password with unregistered email',
      '{"email":"ghost@test.com"}',
      '400 Bad Request: "Email not found"', '', '', '', today, 'Local', ''],

    ['TC-015', '⏳ Pending', 'Auth', 'Password Reset', 'Positive', 'High',
      'Reset password with valid token',
      'Token from TC-013 obtained',
      '1. POST /api/auth/reset-password with token + new password',
      '{"token":"<from_TC-013>","password":"NewPass123!"}',
      '201 Created: "Password reset successful"', '', '', '', today, 'Local', ''],

    ['TC-016', '⏳ Pending', 'Auth', 'Password Reset', 'Positive', 'High',
      'Login with new password after reset',
      'Password was reset in TC-015',
      '1. POST /api/auth/login with new password',
      '{"email":"admin@test.com","password":"NewPass123!"}',
      '201 Created, login successful with new password', '', '', '', today, 'Local', ''],

    ['TC-017', '⏳ Pending', 'Auth', 'Password Reset', 'Negative', 'High',
      'Reject reset with invalid token',
      'None',
      '1. POST /api/auth/reset-password with fake token',
      '{"token":"invalid-token","password":"NewPass123!"}',
      '400 Bad Request: "Invalid or expired reset token"', '', '', '', today, 'Local', ''],

    ['TC-018', '⏳ Pending', 'Auth', 'Password Reset', 'Negative', 'Medium',
      'Reject reset with weak password',
      'Any token',
      '1. POST /api/auth/reset-password with short password',
      '{"token":"xxx","password":"123"}',
      '400 Bad Request: password too short', '', '', '', today, 'Local', ''],

    ['TC-019', '⏳ Pending', 'Auth', 'Logout', 'Positive', 'Medium',
      'Logout successfully',
      'Valid JWT token',
      '1. POST /api/auth/logout with Bearer token',
      'Authorization: Bearer <token>',
      '201 Created: "Logout successful"', '', '', '', today, 'Local', ''],

    ['TC-020', '⏳ Pending', 'Auth', 'Refresh Token', 'Positive', 'Medium',
      'Refresh access token',
      'Valid JWT token',
      '1. POST /api/auth/refresh-token with Bearer token',
      'Authorization: Bearer <token>',
      '201 Created → new accessToken + refreshToken', '', '', '', today, 'Local', ''],

    // AUTH GUARD — 7 tests (TC-021 to TC-027)
    ['TC-021', '⏳ Pending', 'Auth Guard', 'Route Protection', 'Negative', 'High',
      'Reject access without token',
      'None',
      '1. GET /api/users/profile without Authorization header',
      'No auth header',
      '401 Unauthorized: "No token provided"', '', '', '', today, 'Local', ''],

    ['TC-022', '⏳ Pending', 'Auth Guard', 'Route Protection', 'Negative', 'High',
      'Reject access with malformed token',
      'None',
      '1. GET /api/users/profile with Authorization: Bearer invalid',
      'Authorization: Bearer invalid-token',
      '401 Unauthorized: "Invalid token"', '', '', '', today, 'Local', ''],

    ['TC-023', '⏳ Pending', 'Auth Guard', 'Route Protection', 'Negative', 'Medium',
      'Reject access with empty Bearer',
      'None',
      '1. GET /api/users/profile with Authorization: Bearer ',
      'Authorization: Bearer ',
      '401 Unauthorized', '', '', '', today, 'Local', ''],

    ['TC-024', '⏳ Pending', 'Auth Guard', 'Public Routes', 'Positive', 'High',
      'Public route accessible without token',
      'None',
      '1. GET /api/skills without any auth',
      'No auth header',
      '200 OK, returns skills array', '', '', '', today, 'Local', ''],

    ['TC-025', '⏳ Pending', 'Auth Guard', 'Role Guard', 'Negative', 'High',
      'Admin route rejected for mentee',
      'Mentee token from TC-003/TC-009',
      '1. GET /api/admin/dashboard with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-026', '⏳ Pending', 'Auth Guard', 'Role Guard', 'Negative', 'High',
      'Users list route rejected for mentor',
      'Mentor token',
      '1. GET /api/users with mentor token',
      'Authorization: Bearer <mentor_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-027', '⏳ Pending', 'Auth Guard', 'Role Guard', 'Negative', 'High',
      'Mentor approve route rejected for mentee',
      'Mentee token',
      '1. POST /api/mentors/:id/approve with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    // USERS — 7 tests (TC-028 to TC-034)
    ['TC-028', '⏳ Pending', 'Users', 'Profile', 'Positive', 'High',
      'Get own profile',
      'Valid JWT token, user exists',
      '1. GET /api/users/profile with token',
      'Authorization: Bearer <token>',
      '200 OK → { id, email, firstName, lastName, role }', '', '', '', today, 'Local', ''],

    ['TC-029', '⏳ Pending', 'Users', 'Profile', 'Positive', 'High',
      'Update own profile',
      'Valid JWT token',
      '1. PUT /api/users/profile with userId + fields',
      '{"userId":"<id>","firstName":"Updated"}',
      '200 OK, profile updated', '', '', '', today, 'Local', ''],

    ['TC-030', '⏳ Pending', 'Users', 'Profile', 'Negative', 'Medium',
      'Reject update with empty body',
      'Valid JWT token',
      '1. PUT /api/users/profile with only userId',
      '{"userId":"<id>"}',
      '400 Bad Request: no update fields', '', '', '', today, 'Local', ''],

    ['TC-031', '⏳ Pending', 'Users', 'Admin CRUD', 'Positive', 'High',
      'Admin list all users',
      'Admin token',
      '1. GET /api/users with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns array of users', '', '', '', today, 'Local', ''],

    ['TC-032', '⏳ Pending', 'Users', 'Admin CRUD', 'Positive', 'Medium',
      'Admin get user by ID',
      'Admin token, existing userId',
      '1. GET /api/users/:id with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns user object', '', '', '', today, 'Local', ''],

    ['TC-033', '⏳ Pending', 'Users', 'Admin CRUD', 'Negative', 'Medium',
      '404 for non-existent user',
      'Admin token',
      '1. GET /api/users/00000000-0000-0000-0000-000000000000',
      'Authorization: Bearer <admin_token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    ['TC-034', '⏳ Pending', 'Users', 'Security', 'Negative', 'High',
      'Reject profile update without token',
      'None',
      '1. PUT /api/users/profile without Authorization',
      'No auth header',
      '401 Unauthorized', '', '', '', today, 'Local', ''],

    // SKILLS — 13 tests (TC-035 to TC-047)
    ['TC-035', '⏳ Pending', 'Skills', 'List', 'Positive', 'High',
      'List all skills publicly',
      'None (public endpoint)',
      '1. GET /api/skills without token',
      'No auth required',
      '200 OK, returns array of skills', '', '', '', today, 'Local', ''],

    ['TC-036', '⏳ Pending', 'Skills', 'Create', 'Positive', 'High',
      'Admin creates a new skill',
      'Admin token',
      '1. POST /api/skills with admin token + name',
      '{"name":"TypeScript","description":"TS language"}',
      '201 Created → { id, name, description }', '', '', '', today, 'Local', ''],

    ['TC-037', '⏳ Pending', 'Skills', 'Create', 'Negative', 'High',
      'Reject skill creation without name',
      'Admin token',
      '1. POST /api/skills without name field',
      '{"description":"No name"}',
      '400 Bad Request: name required', '', '', '', today, 'Local', ''],

    ['TC-038', '⏳ Pending', 'Skills', 'Create', 'Negative', 'High',
      'Reject duplicate skill name',
      'Admin token, skill from TC-036 exists',
      '1. POST /api/skills with same name as TC-036',
      '{"name":"TypeScript"}',
      '400 Bad Request: duplicate name', '', '', '', today, 'Local', ''],

    ['TC-039', '⏳ Pending', 'Skills', 'Create', 'Negative', 'High',
      'Reject skill creation by non-admin',
      'Mentee token',
      '1. POST /api/skills with mentee token',
      '{"name":"Should-Fail"}',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-040', '⏳ Pending', 'Skills', 'Get by ID', 'Positive', 'Medium',
      'Get skill by ID publicly',
      'None (public), skill exists',
      '1. GET /api/skills/:id without token',
      'No auth required',
      '200 OK, returns skill object', '', '', '', today, 'Local', ''],

    ['TC-041', '⏳ Pending', 'Skills', 'Get by ID', 'Negative', 'Medium',
      '404 for non-existent skill',
      'None',
      '1. GET /api/skills/00000000-0000-0000-0000-000000000000',
      'No auth required',
      '404 Not Found', '', '', '', today, 'Local', ''],

    ['TC-042', '⏳ Pending', 'Skills', 'Update', 'Positive', 'Medium',
      'Admin updates a skill',
      'Admin token, skill exists',
      '1. PUT /api/skills/:id with admin token',
      '{"description":"Updated description"}',
      '200 OK, skill updated', '', '', '', today, 'Local', ''],

    ['TC-043', '⏳ Pending', 'Skills', 'Update', 'Negative', 'High',
      'Reject skill update by non-admin',
      'Mentee token, skill exists',
      '1. PUT /api/skills/:id with mentee token',
      '{"name":"Hacked"}',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-044', '⏳ Pending', 'Skills', 'Delete', 'Positive', 'Medium',
      'Admin deletes a skill',
      'Admin token, skill exists',
      '1. DELETE /api/skills/:id with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, skill deleted', '', '', '', today, 'Local', ''],

    ['TC-045', '⏳ Pending', 'Skills', 'Get by ID', 'Negative', 'Medium',
      '404 for deleted skill',
      'Skill from TC-044 was deleted',
      '1. GET /api/skills/:id (deleted skill)',
      'No auth required',
      '404 Not Found', '', '', '', today, 'Local', ''],

    ['TC-046', '⏳ Pending', 'Skills', 'Category Filter', 'Positive', 'Low',
      'Get skills by category',
      'Category exists',
      '1. GET /api/skills/category/:categoryId',
      'No auth required',
      '200 OK, returns array (may be empty)', '', '', '', today, 'Local', ''],

    ['TC-047', '⏳ Pending', 'Skills', 'Create', 'Negative', 'Medium',
      'Reject skill with unknown fields (forbidNonWhitelisted)',
      'Admin token',
      '1. POST /api/skills with unknown field',
      '{"name":"Valid","hackedField":"should fail"}',
      '400 Bad Request: unknown field rejected', '', '', '', today, 'Local', ''],

    // MENTORS — 11 tests (TC-048 to TC-058)
    ['TC-048', '⏳ Pending', 'Mentors', 'Create', 'Positive', 'High',
      'Admin creates mentor profile',
      'Admin token, user exists',
      '1. POST /api/mentors with admin token + data',
      '{"userId":"<id>","title":"Senior Dev","company":"Google","nid":"0123456789","phone":"01234567890"}',
      '201 Created → { id, title, company, status }', '', '', '', today, 'Local', ''],

    ['TC-049', '⏳ Pending', 'Mentors', 'Create', 'Negative', 'High',
      'Reject duplicate NID',
      'Mentor from TC-048 exists with that NID',
      '1. POST /api/mentors with same NID as TC-048',
      '{"userId":"<id>","title":"Duplicate","nid":"0123456789","phone":"01234567890"}',
      '400 Bad Request: duplicate NID', '', '', '', today, 'Local', ''],

    ['TC-050', '⏳ Pending', 'Mentors', 'List', 'Positive', 'High',
      'List all mentors',
      'Mentor exists, valid token',
      '1. GET /api/mentors with auth token',
      'Authorization: Bearer <token>',
      '200 OK, returns array of mentors', '', '', '', today, 'Local', ''],

    ['TC-051', '⏳ Pending', 'Mentors', 'Update', 'Positive', 'Medium',
      'Update mentor profile',
      'Mentor exists',
      '1. PUT /api/mentors/:id with updated fields',
      '{"title":"Lead QA Engineer"}',
      '200 OK, mentor updated', '', '', '', today, 'Local', ''],

    ['TC-052', '⏳ Pending', 'Mentors', 'Update', 'Negative', 'Medium',
      'Reject invalid phone format',
      'Mentor exists',
      '1. PUT /api/mentors/:id with invalid phone',
      '{"phone":"invalid-phone"}',
      '400 Bad Request: invalid phone format', '', '', '', today, 'Local', ''],

    ['TC-053', '⏳ Pending', 'Mentors', 'Approval', 'Positive', 'High',
      'Admin approves mentor',
      'Admin token, mentor exists in pending status',
      '1. POST /api/mentors/:id/approve with admin token',
      'Authorization: Bearer <admin_token>',
      '201 Created, mentor approved', '', '', '', today, 'Local', ''],

    ['TC-054', '⏳ Pending', 'Mentors', 'Approval', 'Negative', 'High',
      'Reject mentor approval by non-admin',
      'Mentee token, mentor exists',
      '1. POST /api/mentors/:id/approve with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-055', '⏳ Pending', 'Mentors', 'Rejection', 'Positive', 'High',
      'Admin rejects mentor with reason',
      'Admin token, mentor exists',
      '1. POST /api/mentors/:id/reject with reason',
      '{"reason":"Insufficient qualifications"}',
      '201 Created, mentor rejected', '', '', '', today, 'Local', ''],

    ['TC-056', '⏳ Pending', 'Mentors', 'Suspend', 'Positive', 'High',
      'Admin suspends mentor',
      'Admin token, mentor exists',
      '1. POST /api/mentors/:id/suspend with admin token',
      'Authorization: Bearer <admin_token>',
      '201 Created, mentor suspended', '', '', '', today, 'Local', ''],

    ['TC-057', '⏳ Pending', 'Mentors', 'Delete', 'Positive', 'Medium',
      'Admin deletes mentor',
      'Admin token, mentor exists',
      '1. DELETE /api/mentors/:id with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, mentor deleted', '', '', '', today, 'Local', ''],

    ['TC-058', '⏳ Pending', 'Mentors', 'Approval', 'Negative', 'Medium',
      '404 when approving non-existent mentor',
      'Admin token',
      '1. POST /api/mentors/0000.../approve',
      'Authorization: Bearer <admin_token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    // MENTEES — 6 tests (TC-059 to TC-064)
    ['TC-059', '⏳ Pending', 'Mentees', 'Create', 'Positive', 'High',
      'Create mentee profile',
      'Valid token, user exists',
      '1. POST /api/mentees with auth token + data',
      '{"userId":"<id>","occupation":"Student","goals":"Learn coding"}',
      '201 Created → { id, occupation, goals }', '', '', '', today, 'Local', ''],

    ['TC-060', '⏳ Pending', 'Mentees', 'List', 'Positive', 'Medium',
      'List all mentees',
      'Valid token',
      '1. GET /api/mentees with auth token',
      'Authorization: Bearer <token>',
      '200 OK, returns array of mentees', '', '', '', today, 'Local', ''],

    ['TC-061', '⏳ Pending', 'Mentees', 'Get by ID', 'Positive', 'Medium',
      'Get mentee by ID',
      'Mentee exists, valid token',
      '1. GET /api/mentees/:id',
      'Authorization: Bearer <token>',
      '200 OK, returns mentee object', '', '', '', today, 'Local', ''],

    ['TC-062', '⏳ Pending', 'Mentees', 'Update', 'Positive', 'Medium',
      'Update mentee profile',
      'Mentee exists, valid token',
      '1. PUT /api/mentees/:id with updated fields',
      '{"occupation":"Junior Developer"}',
      '200 OK, mentee updated', '', '', '', today, 'Local', ''],

    ['TC-063', '⏳ Pending', 'Mentees', 'Delete', 'Negative', 'High',
      'Reject mentee deletion by non-admin',
      'Mentee token, mentee exists',
      '1. DELETE /api/mentees/:id with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-064', '⏳ Pending', 'Mentees', 'Delete', 'Positive', 'Medium',
      'Admin deletes mentee',
      'Admin token, mentee exists',
      '1. DELETE /api/mentees/:id with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, mentee deleted', '', '', '', today, 'Local', ''],

    // SESSIONS — 16 tests (TC-065 to TC-080)
    ['TC-065', '⏳ Pending', 'Sessions', 'Create', 'Positive', 'High',
      'Create session request',
      'Mentee token, mentor & mentee exist',
      '1. POST /api/sessions with mentee token + data',
      '{"mentorId":"<id>","menteeId":"<id>","title":"Career Advice","scheduledAt":"2026-06-15T14:00:00Z","duration":60}',
      '201 Created → { id, title, status, scheduledAt }', '', '', '', today, 'Local', ''],

    ['TC-066', '⏳ Pending', 'Sessions', 'Create', 'Negative', 'High',
      'Reject session with past date',
      'Mentee token',
      '1. POST /api/sessions with past scheduledAt',
      '{"mentorId":"<id>","menteeId":"<id>","title":"Past","scheduledAt":"2020-01-01T00:00:00Z"}',
      '400 Bad Request: cannot book past date', '', '', '', today, 'Local', ''],

    ['TC-067', '⏳ Pending', 'Sessions', 'Create', 'Negative', 'High',
      'Reject session missing required fields',
      'Mentee token',
      '1. POST /api/sessions with only title',
      '{"title":"Incomplete"}',
      '400 Bad Request: validation errors', '', '', '', today, 'Local', ''],

    ['TC-068', '⏳ Pending', 'Sessions', 'Create', 'Negative', 'Medium',
      'Reject session with duration > 180',
      'Mentee token',
      '1. POST /api/sessions with duration=200',
      '{"mentorId":"<id>","menteeId":"<id>","title":"Too Long","scheduledAt":"2026-06-15T14:00:00Z","duration":200}',
      '400 Bad Request: max 180 minutes', '', '', '', today, 'Local', ''],

    ['TC-069', '⏳ Pending', 'Sessions', 'Create', 'Negative', 'Medium',
      'Reject session with duration < 15',
      'Mentee token',
      '1. POST /api/sessions with duration=5',
      '{"mentorId":"<id>","menteeId":"<id>","title":"Too Short","scheduledAt":"2026-06-15T14:00:00Z","duration":5}',
      '400 Bad Request: min 15 minutes', '', '', '', today, 'Local', ''],

    ['TC-070', '⏳ Pending', 'Sessions', 'List', 'Positive', 'High',
      'List all sessions',
      'Valid token',
      '1. GET /api/sessions with auth token',
      'Authorization: Bearer <token>',
      '200 OK, returns array of sessions', '', '', '', today, 'Local', ''],

    ['TC-071', '⏳ Pending', 'Sessions', 'Get by ID', 'Positive', 'Medium',
      'Get session by ID',
      'Session exists, valid token',
      '1. GET /api/sessions/:id',
      'Authorization: Bearer <token>',
      '200 OK, returns session object', '', '', '', today, 'Local', ''],

    ['TC-072', '⏳ Pending', 'Sessions', 'Update', 'Positive', 'Medium',
      'Update session',
      'Session exists, valid token',
      '1. PUT /api/sessions/:id with updated fields',
      '{"title":"Updated Title"}',
      '200 OK, session updated', '', '', '', today, 'Local', ''],

    ['TC-073', '⏳ Pending', 'Sessions', 'Accept', 'Negative', 'High',
      'Reject session accept by non-mentor',
      'Mentee token, session exists',
      '1. POST /api/sessions/:id/accept with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-074', '⏳ Pending', 'Sessions', 'Accept', 'Positive', 'High',
      'Mentor accepts session',
      'Mentor token, session exists',
      '1. POST /api/sessions/:id/accept with mentor token',
      'Authorization: Bearer <mentor_token>',
      '201 Created, session accepted', '', '', '', today, 'Local', ''],

    ['TC-075', '⏳ Pending', 'Sessions', 'Decline', 'Negative', 'High',
      'Reject session decline by non-mentor',
      'Mentee token, session exists',
      '1. POST /api/sessions/:id/decline with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-076', '⏳ Pending', 'Sessions', 'Complete', 'Positive', 'High',
      'Complete a session',
      'Valid token, session exists',
      '1. POST /api/sessions/:id/complete',
      'Authorization: Bearer <token>',
      '201 Created, session completed', '', '', '', today, 'Local', ''],

    ['TC-077', '⏳ Pending', 'Sessions', 'Cancel', 'Positive', 'Medium',
      'Cancel a session',
      'Valid token, session exists',
      '1. POST /api/sessions/:id/cancel',
      'Authorization: Bearer <token>',
      '201 Created, session cancelled', '', '', '', today, 'Local', ''],

    ['TC-078', '⏳ Pending', 'Sessions', 'No-Show', 'Positive', 'Medium',
      'Mark session as no-show',
      'Valid token, session exists',
      '1. POST /api/sessions/:id/no-show',
      'Authorization: Bearer <token>',
      '201 Created, session marked no-show', '', '', '', today, 'Local', ''],

    ['TC-079', '⏳ Pending', 'Sessions', 'Cancel', 'Negative', 'Medium',
      '404 when cancelling non-existent session',
      'Valid token',
      '1. POST /api/sessions/0000.../cancel',
      'Authorization: Bearer <token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    ['TC-080', '⏳ Pending', 'Sessions', 'Delete', 'Positive', 'Low',
      'Delete a session',
      'Valid token, session exists',
      '1. DELETE /api/sessions/:id',
      'Authorization: Bearer <token>',
      '200 OK, session deleted', '', '', '', today, 'Local', ''],

    // MATCHINGS — 6 tests (TC-081 to TC-086)
    ['TC-081', '⏳ Pending', 'Matchings', 'Create', 'Positive', 'High',
      'Admin creates matching',
      'Admin token',
      '1. POST /api/matchings with admin token',
      '{"mentorId":"<id>","menteeId":"<id>","reason":"Good match"}',
      '201 Created → { id, mentorId, menteeId, status }', '', '', '', today, 'Local', ''],

    ['TC-082', '⏳ Pending', 'Matchings', 'Create', 'Negative', 'High',
      'Reject matching creation by non-admin',
      'Mentee token',
      '1. POST /api/matchings with mentee token',
      '{"mentorId":"<id>","menteeId":"<id>"}',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-083', '⏳ Pending', 'Matchings', 'List', 'Positive', 'Medium',
      'List all matchings',
      'Valid token',
      '1. GET /api/matchings',
      'Authorization: Bearer <token>',
      '200 OK, returns array', '', '', '', today, 'Local', ''],

    ['TC-084', '⏳ Pending', 'Matchings', 'Get by ID', 'Positive', 'Low',
      'Get matching by ID',
      'Matching exists',
      '1. GET /api/matchings/:id',
      'Authorization: Bearer <token>',
      '200 OK, returns matching object', '', '', '', today, 'Local', ''],

    ['TC-085', '⏳ Pending', 'Matchings', 'Update', 'Positive', 'Medium',
      'Update matching status',
      'Matching exists, valid token',
      '1. PUT /api/matchings/:id with status',
      '{"status":"accepted"}',
      '200 OK, matching updated', '', '', '', today, 'Local', ''],

    ['TC-086', '⏳ Pending', 'Matchings', 'Delete', 'Positive', 'Medium',
      'Admin deletes matching',
      'Admin token, matching exists',
      '1. DELETE /api/matchings/:id with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, matching deleted', '', '', '', today, 'Local', ''],

    // FEEDBACK — 9 tests (TC-087 to TC-095)
    ['TC-087', '⏳ Pending', 'Feedback', 'Create', 'Positive', 'High',
      'Submit feedback',
      'Mentee token, mentor & mentee exist',
      '1. POST /api/feedback with mentee token + data',
      '{"mentorId":"<id>","menteeId":"<id>","rating":5,"comment":"Great!","isAnonymous":false}',
      '201 Created → { id, rating, comment }', '', '', '', today, 'Local', ''],

    ['TC-088', '⏳ Pending', 'Feedback', 'Create', 'Negative', 'High',
      'Reject feedback with rating > 5',
      'Mentee token',
      '1. POST /api/feedback with rating=10',
      '{"mentorId":"<id>","menteeId":"<id>","rating":10}',
      '400 Bad Request: max rating is 5', '', '', '', today, 'Local', ''],

    ['TC-089', '⏳ Pending', 'Feedback', 'Create', 'Negative', 'Medium',
      'Reject feedback with rating < 1',
      'Mentee token',
      '1. POST /api/feedback with rating=0',
      '{"mentorId":"<id>","menteeId":"<id>","rating":0}',
      '400 Bad Request: min rating is 1', '', '', '', today, 'Local', ''],

    ['TC-090', '⏳ Pending', 'Feedback', 'Create', 'Negative', 'High',
      'Reject feedback missing required fields',
      'Mentee token',
      '1. POST /api/feedback without rating',
      '{"mentorId":"<id>","menteeId":"<id>"}',
      '400 Bad Request: rating required', '', '', '', today, 'Local', ''],

    ['TC-091', '⏳ Pending', 'Feedback', 'List', 'Positive', 'Medium',
      'List all feedback',
      'Valid token',
      '1. GET /api/feedback',
      'Authorization: Bearer <token>',
      '200 OK, returns array of feedback', '', '', '', today, 'Local', ''],

    ['TC-092', '⏳ Pending', 'Feedback', 'Get by ID', 'Positive', 'Low',
      'Get feedback by ID',
      'Feedback exists, valid token',
      '1. GET /api/feedback/:id',
      'Authorization: Bearer <token>',
      '200 OK, returns feedback object', '', '', '', today, 'Local', ''],

    ['TC-093', '⏳ Pending', 'Feedback', 'Get by Mentor', 'Positive', 'Medium',
      'Get feedback by mentor ID',
      'Mentor exists, valid token',
      '1. GET /api/feedback/mentor/:mentorId',
      'Authorization: Bearer <token>',
      '200 OK, returns array of feedback', '', '', '', today, 'Local', ''],

    ['TC-094', '⏳ Pending', 'Feedback', 'Update', 'Positive', 'Medium',
      'Update feedback',
      'Feedback exists, valid token',
      '1. PUT /api/feedback/:id with updated fields',
      '{"rating":4,"comment":"Updated comment"}',
      '200 OK, feedback updated', '', '', '', today, 'Local', ''],

    ['TC-095', '⏳ Pending', 'Feedback', 'Delete', 'Positive', 'Medium',
      'Delete feedback',
      'Feedback exists, valid token',
      '1. DELETE /api/feedback/:id',
      'Authorization: Bearer <token>',
      '200 OK, feedback deleted', '', '', '', today, 'Local', ''],

    // NOTIFICATIONS — 8 tests (TC-096 to TC-103)
    ['TC-096', '⏳ Pending', 'Notifications', 'Create', 'Positive', 'High',
      'Admin creates notification',
      'Admin token, user exists',
      '1. POST /api/notifications with admin token + data',
      '{"userId":"<id>","title":"Test","message":"Hello!","type":"in_app"}',
      '201 Created → { id, title, message, isRead }', '', '', '', today, 'Local', ''],

    ['TC-097', '⏳ Pending', 'Notifications', 'Create', 'Negative', 'High',
      'Reject notification creation by non-admin',
      'Mentee token',
      '1. POST /api/notifications with mentee token',
      '{"userId":"<id>","title":"Fail","message":"Should not create"}',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-098', '⏳ Pending', 'Notifications', 'List', 'Positive', 'Medium',
      'List notifications',
      'Valid token',
      '1. GET /api/notifications',
      'Authorization: Bearer <token>',
      '200 OK, returns array of notifications', '', '', '', today, 'Local', ''],

    ['TC-099', '⏳ Pending', 'Notifications', 'Get by ID', 'Positive', 'Low',
      'Get notification by ID',
      'Notification exists, valid token',
      '1. GET /api/notifications/:id',
      'Authorization: Bearer <token>',
      '200 OK, returns notification object', '', '', '', today, 'Local', ''],

    ['TC-100', '⏳ Pending', 'Notifications', 'Unread Count', 'Positive', 'Medium',
      'Get unread notification count',
      'Valid token',
      '1. GET /api/notifications/unread',
      'Authorization: Bearer <token>',
      '200 OK, returns count', '', '', '', today, 'Local', ''],

    ['TC-101', '⏳ Pending', 'Notifications', 'Mark Read', 'Positive', 'Medium',
      'Mark notification as read',
      'Notification exists, valid token',
      '1. PUT /api/notifications/:id/read',
      'Authorization: Bearer <token>',
      '200 OK, notification marked read', '', '', '', today, 'Local', ''],

    ['TC-102', '⏳ Pending', 'Notifications', 'Delete', 'Positive', 'Medium',
      'Delete notification',
      'Notification exists, valid token',
      '1. DELETE /api/notifications/:id',
      'Authorization: Bearer <token>',
      '200 OK, notification deleted', '', '', '', today, 'Local', ''],

    ['TC-103', '⏳ Pending', 'Notifications', 'Delete', 'Negative', 'Medium',
      '404 when deleting non-existent notification',
      'Valid token',
      '1. DELETE /api/notifications/0000...',
      'Authorization: Bearer <token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    // ADMIN — 10 tests (TC-104 to TC-113)
    ['TC-104', '⏳ Pending', 'Admin', 'Dashboard', 'Positive', 'High',
      'Get dashboard statistics',
      'Admin token',
      '1. GET /api/admin/dashboard with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK → { totalUsers, totalMentors, totalSessions, ... }', '', '', '', today, 'Local', ''],

    ['TC-105', '⏳ Pending', 'Admin', 'Users', 'Positive', 'High',
      'Admin lists all users',
      'Admin token',
      '1. GET /api/admin/users',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns array of users', '', '', '', today, 'Local', ''],

    ['TC-106', '⏳ Pending', 'Admin', 'Mentors', 'Positive', 'Medium',
      'Admin lists all mentors',
      'Admin token',
      '1. GET /api/admin/mentors',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns array of mentors', '', '', '', today, 'Local', ''],

    ['TC-107', '⏳ Pending', 'Admin', 'Mentees', 'Positive', 'Medium',
      'Admin lists all mentees',
      'Admin token',
      '1. GET /api/admin/mentees',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns array of mentees', '', '', '', today, 'Local', ''],

    ['TC-108', '⏳ Pending', 'Admin', 'User Management', 'Positive', 'High',
      'Deactivate user',
      'Admin token, user exists',
      '1. POST /api/admin/users/:id/deactivate',
      'Authorization: Bearer <admin_token>',
      '201 Created, user deactivated', '', '', '', today, 'Local', ''],

    ['TC-109', '⏳ Pending', 'Admin', 'User Management', 'Negative', 'Medium',
      '404 when deactivating non-existent user',
      'Admin token',
      '1. POST /api/admin/users/0000.../deactivate',
      'Authorization: Bearer <admin_token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    ['TC-110', '⏳ Pending', 'Admin', 'User Management', 'Positive', 'High',
      'Admin resets user password',
      'Admin token, user exists',
      '1. POST /api/admin/users/:id/reset-password with new password',
      '{"password":"NewTempPass123!"}',
      '201 Created, password reset', '', '', '', today, 'Local', ''],

    ['TC-111', '⏳ Pending', 'Admin', 'Feedback', 'Positive', 'Medium',
      'Admin moderates feedback (delete)',
      'Admin token, feedback exists',
      '1. DELETE /api/admin/feedback/:id',
      'Authorization: Bearer <admin_token>',
      '200 OK, feedback deleted', '', '', '', today, 'Local', ''],

    ['TC-112', '⏳ Pending', 'Admin', 'User Management', 'Positive', 'High',
      'Admin deletes user',
      'Admin token, user exists',
      '1. DELETE /api/admin/users/:id',
      'Authorization: Bearer <admin_token>',
      '200 OK, user deleted', '', '', '', today, 'Local', ''],

    ['TC-113', '⏳ Pending', 'Admin', 'User Management', 'Negative', 'Medium',
      '404 when deleting non-existent user',
      'Admin token',
      '1. DELETE /api/admin/users/0000...',
      'Authorization: Bearer <admin_token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    // ACTIVITY LOGS — 4 tests (TC-114 to TC-117)
    ['TC-114', '⏳ Pending', 'Activity Logs', 'List', 'Positive', 'Medium',
      'List activity logs (admin only)',
      'Admin token',
      '1. GET /api/activity-logs with admin token',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns array of logs', '', '', '', today, 'Local', ''],

    ['TC-115', '⏳ Pending', 'Activity Logs', 'Get by ID', 'Positive', 'Low',
      'Get activity log by ID',
      'Admin token, log exists',
      '1. GET /api/activity-logs/:id',
      'Authorization: Bearer <admin_token>',
      '200 OK, returns log object', '', '', '', today, 'Local', ''],

    ['TC-116', '⏳ Pending', 'Activity Logs', 'Create', 'Positive', 'Low',
      'Create activity log (admin)',
      'Admin token',
      '1. POST /api/activity-logs with admin token',
      '{"action":"create","entity":"test","entityId":"0000...","description":"QA test"}',
      '201 Created, log entry created', '', '', '', today, 'Local', ''],

    ['TC-117', '⏳ Pending', 'Activity Logs', 'Security', 'Negative', 'High',
      'Reject activity log access by non-admin',
      'Mentee token',
      '1. GET /api/activity-logs with mentee token',
      'Authorization: Bearer <mentee_token>',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    // RESOURCES — 6 tests (TC-118 to TC-123)
    ['TC-118', '⏳ Pending', 'Resources', 'Create', 'Positive', 'High',
      'Mentor creates a resource',
      'Mentor token',
      '1. POST /api/resources with mentor token + data',
      '{"mentorId":"<id>","title":"Node.js Guide","type":"document","fileUrl":"https://example.com/doc.pdf"}',
      '201 Created → { id, title, type, fileUrl }', '', '', '', today, 'Local', ''],

    ['TC-119', '⏳ Pending', 'Resources', 'Create', 'Negative', 'High',
      'Reject resource creation by non-mentor',
      'Mentee token',
      '1. POST /api/resources with mentee token',
      '{"mentorId":"<id>","title":"Fail","type":"document"}',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-120', '⏳ Pending', 'Resources', 'Create', 'Negative', 'Medium',
      'Reject resource without title',
      'Mentor token',
      '1. POST /api/resources with only mentorId',
      '{"mentorId":"<id>"}',
      '400 Bad Request: title required', '', '', '', today, 'Local', ''],

    ['TC-121', '⏳ Pending', 'Resources', 'List', 'Positive', 'Medium',
      'Get resources by mentor (public)',
      'None (public endpoint)',
      '1. GET /api/resources/:mentorId without token',
      'No auth required',
      '200 OK, returns array of resources', '', '', '', today, 'Local', ''],

    ['TC-122', '⏳ Pending', 'Resources', 'Delete', 'Positive', 'Medium',
      'Mentor deletes their resource',
      'Mentor token, resource exists',
      '1. DELETE /api/resources/:id with mentor token',
      'Authorization: Bearer <mentor_token>',
      '200 OK, resource deleted', '', '', '', today, 'Local', ''],

    ['TC-123', '⏳ Pending', 'Resources', 'Delete', 'Negative', 'Medium',
      '404 when deleting non-existent resource',
      'Mentor token',
      '1. DELETE /api/resources/0000...',
      'Authorization: Bearer <mentor_token>',
      '404 Not Found', '', '', '', today, 'Local', ''],

    // AVAILABILITY — 7 tests (TC-124 to TC-130)
    ['TC-124', '⏳ Pending', 'Availability', 'Get', 'Positive', 'Medium',
      'Get mentor availability (public)',
      'None (public endpoint)',
      '1. GET /api/availabilities/:mentorId without token',
      'No auth required',
      '200 OK, returns availability data', '', '', '', today, 'Local', ''],

    ['TC-125', '⏳ Pending', 'Availability', 'Slots', 'Positive', 'Medium',
      'Get available slots by date (public)',
      'None (public endpoint)',
      '1. GET /api/availabilities/:mentorId/slots?date=2026-06-15',
      'No auth required',
      '200 OK, returns slots array', '', '', '', today, 'Local', ''],

    ['TC-126', '⏳ Pending', 'Availability', 'Create', 'Positive', 'High',
      'Mentor sets availability',
      'Mentor token',
      '1. POST /api/availabilities with mentor token + data',
      '{"mentorId":"<id>","date":"2026-06-15","startTime":"09:00","endTime":"17:00"}',
      '201 Created, availability set', '', '', '', today, 'Local', ''],

    ['TC-127', '⏳ Pending', 'Availability', 'Create', 'Negative', 'High',
      'Reject availability setting by non-mentor',
      'Mentee token',
      '1. POST /api/availabilities with mentee token',
      '{"mentorId":"<id>","date":"2026-06-15","startTime":"09:00","endTime":"17:00"}',
      '403 Forbidden', '', '', '', today, 'Local', ''],

    ['TC-128', '⏳ Pending', 'Availability', 'Update', 'Positive', 'Medium',
      'Mentor updates availability',
      'Mentor token, availability exists',
      '1. PUT /api/availabilities/:id with updated times',
      '{"startTime":"10:00","endTime":"16:00"}',
      '200 OK, availability updated', '', '', '', today, 'Local', ''],

    ['TC-129', '⏳ Pending', 'Availability', 'Delete', 'Positive', 'Medium',
      'Mentor deletes availability',
      'Mentor token, availability exists',
      '1. DELETE /api/availabilities/:id with mentor token',
      'Authorization: Bearer <mentor_token>',
      '200 OK, availability deleted', '', '', '', today, 'Local', ''],

    ['TC-130', '⏳ Pending', 'Availability', 'Block', 'Positive', 'Low',
      'Mentor blocks a date',
      'Mentor token',
      '1. POST /api/availabilities/block with mentor token',
      '{"mentorId":"<id>","date":"2026-06-20","startTime":"00:00","endTime":"23:59"}',
      '201 Created, date blocked', '', '', '', today, 'Local', ''],
  ];
}
