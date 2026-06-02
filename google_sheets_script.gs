/**
 * 🧪 Mentor Management System — Professional Test Suite Generator
 *
 * HOW TO USE:
 * 1. Go to https://sheets.new
 * 2. Extensions → Apps Script
 * 3. Paste this entire file → Save → Run → Authorize
 * 4. Refresh sheet
 *
 * Generates 4 sheets:
 *   - 📋 Test Cases (130 cases with smart filters)
 *   - 📊 Dashboard (live KPI cards + charts)
 *   - 🐛 Bug Report (professional tracker)
 *   - 📝 Test Plan (executive summary)
 */

// ─── COLOR PALETTE ──────────────────────────────────────────
const COLORS = {
  primary:       '#0F3B5E',   // Deep navy
  primaryLight:  '#1A5A8A',   // Medium blue
  accent:        '#00A3E0',   // Bright cyan
  success:       '#10B981',   // Emerald green
  danger:        '#EF4444',   // Red
  warning:       '#F59E0B',   // Amber
  info:          '#6366F1',   // Indigo
  bgLight:       '#F8FAFC',   // Light gray
  bgDark:        '#1E293B',   // Dark slate
  textWhite:     '#FFFFFF',
  textDark:      '#1E293B',
  textMuted:     '#64748B',
  border:        '#E2E8F0',
  rowEven:       '#F1F5F9',
  rowOdd:        '#FFFFFF',
  badgePass:     '#D1FAE5',
  badgeFail:     '#FEE2E2',
  badgePending:  '#FEF3C7',
  badgeBlocked:  '#DBEAFE',
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🧪 MMS Test Suite')
    .addItem('🔄 Generate Full Test Suite', 'generateAllSheets')
    .addItem('📊 Refresh Dashboard', 'refreshDashboard')
    .addSeparator()
    .addItem('📤 Export Summary Report', 'exportSummaryReport')
    .addSeparator()
    .addItem('❌ Clear All Data', 'clearAllSheets')
    .addToUi();
}

function generateAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['📋 Test Cases', '📊 Dashboard', '🐛 Bug Report', '📝 Test Plan'];

  sheetNames.forEach(name => {
    const s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
  });

  createTestPlanSheet(ss);
  createTestCasesSheet(ss);
  createDashboardSheet(ss);
  createBugReportSheet(ss);
  ss.setActiveSheet(ss.getSheetByName('📊 Dashboard'));

  SpreadsheetApp.getUi().alert(
    '✅ Done! 4 sheets created:\n\n' +
    '📋 Test Cases  — 130 cases · 14 modules · Smart filters\n' +
    '📊 Dashboard   — KPI cards · Charts · Live stats\n' +
    '🐛 Bug Report  — Pro tracker · Severity matrix\n' +
    '📝 Test Plan   — Executive summary\n\n' +
    'Use menu "🧪 MMS Test Suite" to refresh.'
  );
}

// ────────────────────────────────────────────────────────────
// 📝 TEST PLAN SHEET
// ────────────────────────────────────────────────────────────
function createTestPlanSheet(ss) {
  const sheet = ss.insertSheet('📝 Test Plan', 0);

  const info = [
    ['', ''],
    ['🧪 TEST PLAN — Mentor Management System', ''],
    ['', ''],
    ['Project', 'Mentor Management System (MMS)'],
    ['Version', '1.0.0'],
    ['Test Date', new Date().toISOString().split('T')[0]],
    ['Tester', '[Your Name]'],
    ['Environment', 'Local / Staging / Production'],
    ['', ''],
    ['📋 SCOPE', ''],
    ['In Scope', 'All API endpoints: Auth, Users, Mentors, Mentees, Skills, Sessions, Matchings, Feedback, Notifications, Admin, Activity Logs, Resources, Availability'],
    ['Out of Scope', 'Third-party integrations, Mobile app, UI/Frontend'],
    ['', ''],
    ['📊 TEST SUMMARY', ''],
    ['Total Test Cases', '=COUNTA(\'📋 Test Cases\'!A2:A)'],
    ['✅ Passed', '=COUNTIF(\'📋 Test Cases\'!B2:B, "✅ Pass")'],
    ['❌ Failed', '=COUNTIF(\'📋 Test Cases\'!B2:B, "❌ Fail")'],
    ['⏳ Pending', '=COUNTIF(\'📋 Test Cases\'!B2:B, "⏳ Pending")'],
    ['⛔ Blocked', '=COUNTIF(\'📋 Test Cases\'!B2:B, "⛔ Blocked")'],
    ['Pass Rate', '=IF(B15=0,0,ROUND(B16/B15*100,1)) & "%"'],
    ['', ''],
    ['📅 SCHEDULE', ''],
    ['Test Execution Start', '[DD-MMM-YYYY]'],
    ['Test Execution End', '[DD-MMM-YYYY]'],
    ['', ''],
    ['✅ APPROVALS', ''],
    ['Test Lead', '_________________________'],
    ['Project Manager', '_________________________'],
    ['Date', '_________________________'],
  ];

  const range = sheet.getRange(1, 1, info.length, 2);
  range.setValues(info);

  // Title styling
  const title = sheet.getRange('B2');
  title.setFontSize(22);
  title.setFontWeight('bold');
  title.setFontColor(COLORS.primary);
  title.setBackground(COLORS.bgLight);

  // Section headers
  ['B10', 'B14', 'B23', 'B28'].forEach(ref => {
    const cell = sheet.getRange(ref);
    cell.setFontSize(13);
    cell.setFontWeight('bold');
    cell.setFontColor(COLORS.primary);
    cell.setBackground(COLORS.bgLight);
  });

  // Label styling
  const labels = sheet.getRange('A4:A9');
  labels.setFontWeight('bold');
  labels.setFontColor(COLORS.textMuted);

  // Value styling
  const values = sheet.getRange('B4:B9');
  values.setFontColor(COLORS.textDark);
  values.setBackground(COLORS.bgLight);

  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 500);
  sheet.setColumnWidth(3, 200);
}

// ────────────────────────────────────────────────────────────
// 📋 TEST CASES SHEET
// ────────────────────────────────────────────────────────────
function createTestCasesSheet(ss) {
  const sheet = ss.insertSheet('📋 Test Cases', 1);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);

  // ── Header ──
  const headers = [
    'TC ID', 'Status', 'Module', 'Feature', 'Test Type', 'Priority',
    'Description', 'Preconditions', 'Test Steps',
    'Test Data', 'Expected Result', 'Actual Result',
    'Bug Ref', 'Tester', 'Date', 'Env', 'Notes'
  ];

  const hRow = sheet.getRange(1, 1, 1, headers.length);
  hRow.setValues([headers]);

  // Modern header styling
  hRow.setBackground(COLORS.primary);
  hRow.setFontColor(COLORS.textWhite);
  hRow.setFontWeight('bold');
  hRow.setFontSize(11);
  hRow.setHorizontalAlignment('center');
  hRow.setVerticalAlignment('middle');
  hRow.setBorder(true, true, true, true, true, true, COLORS.primaryLight, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // ── Data ──
  const testCases = getTestCases();
  if (!testCases.length) return;

  const dataRange = sheet.getRange(2, 1, testCases.length, headers.length);
  dataRange.setValues(testCases);
  dataRange.setVerticalAlignment('top');
  dataRange.setFontSize(10);

  // Alternating row colors
  for (let i = 0; i < testCases.length; i++) {
    const row = i + 2;
    const bg = i % 2 === 0 ? COLORS.rowOdd : COLORS.rowEven;
    sheet.getRange(row, 1, 1, headers.length).setBackground(bg);
  }

  // ── Status Badge Colors ──
  const statusCol = sheet.getRange(2, 2, testCases.length, 1);
  const rules = sheet.getConditionalFormatRules();

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('✅ Pass')
      .setBackground(COLORS.badgePass).setFontColor('#065F46')
      .setRanges([statusCol]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('❌ Fail')
      .setBackground(COLORS.badgeFail).setFontColor('#991B1B')
      .setRanges([statusCol]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('⏳ Pending')
      .setBackground(COLORS.badgePending).setFontColor('#92400E')
      .setRanges([statusCol]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('⛔ Blocked')
      .setBackground(COLORS.badgeBlocked).setFontColor('#1E40AF')
      .setRanges([statusCol]).build(),

    // Priority badge colors
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('High')
      .setBackground('#FEE2E2').setFontColor('#991B1B')
      .setRanges([sheet.getRange(2, 6, testCases.length, 1)]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Medium')
      .setBackground('#FEF3C7').setFontColor('#92400E')
      .setRanges([sheet.getRange(2, 6, testCases.length, 1)]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Low')
      .setBackground('#D1FAE5').setFontColor('#065F46')
      .setRanges([sheet.getRange(2, 6, testCases.length, 1)]).build(),
  );

  sheet.setConditionalFormatRules(rules);

  // ── Column Widths ──
  const widths = [75, 85, 100, 120, 90, 70, 280, 200, 320, 260, 280, 220, 70, 100, 85, 85, 200];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // ── Data Validations ──
  const statusVals = ['⏳ Pending', '✅ Pass', '❌ Fail', '⛔ Blocked', '⬜ Not Tested'];
  sheet.getRange(2, 2, testCases.length, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(statusVals, true).setAllowInvalid(false).build())
    .setValue('⏳ Pending');

  sheet.getRange(2, 5, testCases.length, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['Positive', 'Negative', 'Edge Case'], true).build());

  sheet.getRange(2, 6, testCases.length, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['High', 'Medium', 'Low'], true).build());

  sheet.getRange(2, 16, testCases.length, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['Local', 'Staging', 'Production'], true).build())
    .setValue('Local');

  // Auto date
  const today = new Date().toISOString().split('T')[0];
  sheet.getRange(2, 15, testCases.length, 1).setValue(today);

  // ── Auto Filter ──
  sheet.getRange(1, 1, testCases.length + 1, headers.length).createFilter();

  // ── Freeze panes for horizontal scroll ──
  sheet.setFrozenColumns(2);
}

// ────────────────────────────────────────────────────────────
// 📊 DASHBOARD SHEET
// ────────────────────────────────────────────────────────────
function createDashboardSheet(ss) {
  const sheet = ss.insertSheet('📊 Dashboard', 2);
  sheet.setTabColor(COLORS.primary);

  // ── KPI CARDS (Row 1-4) ──
  const kpis = [
    ['🧪 Total Tests', '=COUNTA(\'📋 Test Cases\'!A2:A)', COLORS.primary, COLORS.bgLight],
    ['✅ Passed', '=COUNTIF(\'📋 Test Cases\'!B2:B, "✅ Pass")', COLORS.success, '#ECFDF5'],
    ['❌ Failed', '=COUNTIF(\'📋 Test Cases\'!B2:B, "❌ Fail")', COLORS.danger, '#FEF2F2'],
    ['📊 Pass Rate', '=IF(B2=0,0,ROUND(B3/B2*100,1))', COLORS.accent, '#E0F2FE'],
  ];

  sheet.getRange('A1:D1').merge();
  sheet.getRange('A1').setValue('📊 DASHBOARD — TEST EXECUTION SUMMARY');
  sheet.getRange('A1').setFontSize(20).setFontWeight('bold').setFontColor(COLORS.primary);
  sheet.getRange('A1').setHorizontalAlignment('center');
  sheet.getRange('A1').setBackground(COLORS.bgLight);

  kpis.forEach((kpi, i) => {
    const col = i * 2 + 1;  // A=1, C=3, E=5, G=7
    const labelCell = sheet.getRange(3, col);
    const valCell = sheet.getRange(4, col);

    // Label
    labelCell.setValue(kpi[0]);
    labelCell.setFontSize(11).setFontColor(COLORS.textMuted).setFontWeight('bold');
    labelCell.setHorizontalAlignment('center');

    // Value
    valCell.setFormula(kpi[1]);
    valCell.setFontSize(36).setFontWeight('bold').setFontColor(kpi[2]);
    valCell.setHorizontalAlignment('center');
    valCell.setBackground(kpi[3]);
    valCell.setBorder(true, true, true, true, true, true);

    // Merge 2 columns for card width
    sheet.getRange(3, col, 2, 2).merge();
    sheet.setColumnWidth(col, 140);
    sheet.setColumnWidth(col + 1, 20);
  });

  // Row heights
  sheet.setRowHeight(1, 40);
  sheet.setRowHeight(3, 25);
  sheet.setRowHeight(4, 70);

  // ── MODULE BREAKDOWN TABLE (Row 7+) ──
  sheet.getRange('A7:G7').merge();
  sheet.getRange('A7').setValue('📋 MODULE BREAKDOWN');
  sheet.getRange('A7').setFontSize(14).setFontWeight('bold').setFontColor(COLORS.primary);
  sheet.getRange('A7').setBackground(COLORS.bgLight);
  sheet.getRange('A7').setBorder(true, true, true, true, true, true);

  const modules = [
    'Auth', 'Auth Guard', 'Users', 'Skills', 'Mentors', 'Mentees',
    'Sessions', 'Matchings', 'Feedback', 'Notifications', 'Admin',
    'Activity Logs', 'Resources', 'Availability'
  ];

  // Table headers
  const tableHeaders = ['Module', 'Total', '✅ Pass', '❌ Fail', '⏳ Pending', '⛔ Blocked', 'Pass Rate'];
  const thRow = sheet.getRange(8, 1, 1, 7);
  thRow.setValues([tableHeaders]);
  thRow.setBackground(COLORS.primary);
  thRow.setFontColor(COLORS.textWhite);
  thRow.setFontWeight('bold');
  thRow.setFontSize(10);
  thRow.setHorizontalAlignment('center');
  thRow.setBorder(true, true, true, true, true, true, COLORS.primaryLight, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  modules.forEach((mod, i) => {
    const row = 9 + i;
    sheet.getRange(row, 1).setValue(mod);
    sheet.getRange(row, 1).setFontWeight('bold').setFontColor(COLORS.textDark);

    sheet.getRange(row, 2).setFormula(`=COUNTIF('📋 Test Cases'!C2:C, "${mod}")`);
    sheet.getRange(row, 3).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C, "${mod}", '📋 Test Cases'!B2:B, "✅ Pass")`);
    sheet.getRange(row, 4).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C, "${mod}", '📋 Test Cases'!B2:B, "❌ Fail")`);
    sheet.getRange(row, 5).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C, "${mod}", '📋 Test Cases'!B2:B, "⏳ Pending")`);
    sheet.getRange(row, 6).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C, "${mod}", '📋 Test Cases'!B2:B, "⛔ Blocked")`);
    sheet.getRange(row, 7).setFormula(`=IF(B${row}=0,0,ROUND(C${row}/B${row}*100,1))`);

    const bg = i % 2 === 0 ? COLORS.rowOdd : COLORS.rowEven;
    sheet.getRange(row, 1, 1, 7).setBackground(bg);
    sheet.getRange(row, 1, 1, 7).setFontSize(10);
    sheet.getRange(row, 1, 1, 7).setHorizontalAlignment('center');
  });

  // Total row
  const totalRow = 9 + modules.length;
  const totalRange = sheet.getRange(totalRow, 1, 1, 7);
  totalRange.setBackground(COLORS.primaryLight);
  totalRange.setFontColor(COLORS.textWhite);
  totalRange.setFontWeight('bold');
  totalRange.setFontSize(11);
  totalRange.setBorder(true, true, true, true, true, true);

  sheet.getRange(totalRow, 1).setValue('TOTAL');
  for (let c = 2; c <= 6; c++) {
    const first = 9;
    const last = totalRow - 1;
    const col = String.fromCharCode(64 + c);
    sheet.getRange(totalRow, c).setFormula(`=SUM(${col}${first}:${col}${last})`);
  }
  sheet.getRange(totalRow, 7).setFormula(`=IF(B${totalRow}=0,0,ROUND(C${totalRow}/B${totalRow}*100,1))`);

  // ── Pass Rate Badge Colors ──
  const rateRange = sheet.getRange(9, 7, modules.length + 1, 1);
  const rateRules = sheet.getConditionalFormatRules();

  rateRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(80)
      .setBackground(COLORS.badgePass).setFontColor('#065F46')
      .setRanges([rateRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(50, 79)
      .setBackground(COLORS.badgePending).setFontColor('#92400E')
      .setRanges([rateRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(50)
      .setBackground(COLORS.badgeFail).setFontColor('#991B1B')
      .setRanges([rateRange]).build(),
  );
  sheet.setConditionalFormatRules(rateRules);

  // Column widths
  [130, 70, 70, 70, 70, 70, 80].forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // ── CHARTS ──

  // Pie chart — overall status
  const pieChart = sheet.newChart()
    .asPieChart()
    .setPosition(9, 9, 0, 0)
    .setOption('title', 'Test Results Overview')
    .setOption('colors', ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'])
    .setOption('height', 280)
    .setOption('width', 360)
    .setOption('pieHole', 0.4)
    .setOption('legend', { position: 'bottom' })
    .build();

  // Data for pie: hardcode labels, use formulas for values
  sheet.getRange('I9').setValue('Status');
  sheet.getRange('I10').setValue('✅ Pass');
  sheet.getRange('I11').setValue('❌ Fail');
  sheet.getRange('I12').setValue('⏳ Pending');
  sheet.getRange('I13').setValue('⛔ Blocked');
  sheet.getRange('J9').setValue('Count');
  sheet.getRange('J10').setFormula('=COUNTIF(\'📋 Test Cases\'!B2:B, "✅ Pass")');
  sheet.getRange('J11').setFormula('=COUNTIF(\'📋 Test Cases\'!B2:B, "❌ Fail")');
  sheet.getRange('J12').setFormula('=COUNTIF(\'📋 Test Cases\'!B2:B, "⏳ Pending")');
  sheet.getRange('J13').setFormula('=COUNTIF(\'📋 Test Cases\'!B2:B, "⛔ Blocked")');
  pieChart.addRange(sheet.getRange('I9:J13'));
  sheet.insertChart(pieChart);

  // Column chart — module pass/fail
  const barChart = sheet.newChart()
    .asColumnChart()
    .setPosition(9, 14, 0, 0)
    .setOption('title', 'Pass / Fail by Module')
    .setOption('colors', ['#10B981', '#EF4444'])
    .setOption('height', 280)
    .setOption('width', 500)
    .setOption('isStacked', true)
    .setOption('legend', { position: 'top' })
    .setOption('hAxis', { slantedText: true, slantedTextAngle: 45 })
    .build();

  const lastModRow = 8 + modules.length;
  barChart.addRange(sheet.getRange('A9:A' + lastModRow));
  barChart.addRange(sheet.getRange('C9:C' + lastModRow));
  barChart.addRange(sheet.getRange('D9:D' + lastModRow));
  sheet.insertChart(barChart);

  // ── RECENT BUGS SECTION ──
  const bugTitleRow = totalRow + 2;
  sheet.getRange(`A${bugTitleRow}:G${bugTitleRow}`).merge();
  sheet.getRange(`A${bugTitleRow}`).setValue('🐛 RECENT BUGS (from Bug Report)');
  sheet.getRange(`A${bugTitleRow}`).setFontSize(14).setFontWeight('bold').setFontColor(COLORS.primary);
  sheet.getRange(`A${bugTitleRow}`).setBackground(COLORS.bgLight);

  const bugHeaders = ['Bug ID', 'Severity', 'Status', 'Module', 'Title', 'Assigned To', 'Reported Date'];
  const bhRow = sheet.getRange(bugTitleRow + 1, 1, 1, 7);
  bhRow.setValues([bugHeaders]);
  bhRow.setBackground(COLORS.primaryLight);
  bhRow.setFontColor(COLORS.textWhite);
  bhRow.setFontWeight('bold');
  bhRow.setFontSize(10);

  // Pull data from Bug Report sheet
  for (let c = 1; c <= 7; c++) {
    const col = String.fromCharCode(64 + c);
    const firstRow = bugTitleRow + 2;
    sheet.getRange(firstRow, c).setFormula(
      `=IFERROR('🐛 Bug Report'!${col}2, "")`
    );
  }
}

// ────────────────────────────────────────────────────────────
// 🐛 BUG REPORT SHEET
// ────────────────────────────────────────────────────────────
function createBugReportSheet(ss) {
  const sheet = ss.insertSheet('🐛 Bug Report', 3);
  sheet.setTabColor(COLORS.danger);
  sheet.setFrozenRows(1);

  const headers = [
    'Bug ID', 'Severity', 'Status', 'Module', 'TC Ref',
    'Title', 'Description', 'Steps to Reproduce',
    'Expected', 'Actual', 'Reported By', 'Date',
    'Assigned To', 'Screenshot', 'Environment', 'Fixed Date', 'Fix Commit', 'Notes'
  ];

  // Header styling
  const hRow = sheet.getRange(1, 1, 1, headers.length);
  hRow.setValues([headers]);
  hRow.setBackground(COLORS.danger);
  hRow.setFontColor(COLORS.textWhite);
  hRow.setFontWeight('bold');
  hRow.setFontSize(10);
  hRow.setHorizontalAlignment('center');
  hRow.setVerticalAlignment('middle');
  hRow.setBorder(true, true, true, true, true, true, '#DC2626', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Column widths
  const widths = [70, 90, 100, 100, 65, 200, 300, 280, 200, 200, 110, 90, 120, 120, 90, 90, 90, 200];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // Row for new bug entry with example
  sheet.getRange('A2').setValue('BUG-001');
  sheet.getRange('B2').setValue('🔴 Critical');
  sheet.getRange('C2').setValue('Open');
  sheet.getRange('D2').setValue('Auth');
  sheet.getRange('E2').setValue('TC-010');
  sheet.getRange('F2').setValue('Login with wrong password returns 500 instead of 401');
  sheet.getRange('G2').setValue('When a user logs in with incorrect password, the API returns HTTP 500 Internal Server Error instead of HTTP 401 Unauthorized.');
  sheet.getRange('H2').setValue('1. POST /api/auth/login with wrong password\n2. Observe response status code');
  sheet.getRange('I2').setValue('401 Unauthorized: "Invalid credentials"');
  sheet.getRange('J2').setValue('500 Internal Server Error: "Cannot read property \'id\' of undefined"');
  sheet.getRange('K2').setValue('[Tester Name]');
  sheet.getRange('L2').setValue(new Date().toISOString().split('T')[0]);
  sheet.getRange('M2').setValue('[Dev Name]');
  sheet.getRange('N2').setValue('[Link or N/A]');
  sheet.getRange('O2').setValue('Local');
  sheet.getRange('P2').setValue('');
  sheet.getRange('Q2').setValue('');
  sheet.getRange('R2').setValue('High priority — blocks login flow');

  // Row styling
  sheet.getRange('A2:R2').setVerticalAlignment('top');
  sheet.getRange('A2:R2').setFontSize(10);
  sheet.getRange('A2:R2').setBorder(true, true, true, true, true, true);

  // Status styling
  const bgColors = {
    'Open': '#FEE2E2',
    'In Progress': '#FEF3C7',
    'Fixed': '#D1FAE5',
    'Closed': '#E2E8F0',
    'Won\'t Fix': '#F3E8FF',
  };

  // ── Data Validations ──
  const severityVals = ['🔴 Critical', '🟠 Major', '🟡 Minor', '⚪ Trivial'];
  sheet.getRange(2, 2, 100, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(severityVals, true).setAllowInvalid(false).build());

  const statusVals = ['Open', 'In Progress', 'Fixed', 'Closed', 'Won\'t Fix'];
  const statusRange = sheet.getRange(2, 3, 100, 1);
  statusRange.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(statusVals, true).setAllowInvalid(false).build());

  const moduleVals = [
    'Auth', 'Auth Guard', 'Users', 'Skills', 'Mentors', 'Mentees',
    'Sessions', 'Matchings', 'Feedback', 'Notifications', 'Admin',
    'Activity Logs', 'Resources', 'Availability', 'General'
  ];
  sheet.getRange(2, 4, 100, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(moduleVals, true).build());

  const envVals = ['Local', 'Staging', 'Production'];
  sheet.getRange(2, 15, 100, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(envVals, true).build())
    .setValue('Local');

  // ── Conditional Formatting ──
  const rules = sheet.getConditionalFormatRules();

  // Severity colors
  const sevRange = sheet.getRange(2, 2, 100, 1);
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('🔴 Critical')
      .setBackground('#FEE2E2').setFontColor('#991B1B').setFontWeight('bold')
      .setRanges([sevRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('🟠 Major')
      .setBackground('#FEF3C7').setFontColor('#92400E')
      .setRanges([sevRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('🟡 Minor')
      .setBackground('#DBEAFE').setFontColor('#1E40AF')
      .setRanges([sevRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('⚪ Trivial')
      .setBackground('#F3E8FF').setFontColor('#6D28D9')
      .setRanges([sevRange]).build(),
  );

  // Status colors
  const statRange = sheet.getRange(2, 3, 100, 1);
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Open')
      .setBackground('#FEE2E2').setFontColor('#991B1B').setFontWeight('bold')
      .setRanges([statRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('In Progress')
      .setBackground('#FEF3C7').setFontColor('#92400E')
      .setRanges([statRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Fixed')
      .setBackground('#D1FAE5').setFontColor('#065F46')
      .setRanges([statRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Closed')
      .setBackground('#E2E8F0').setFontColor('#475569')
      .setRanges([statRange]).build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Won\'t Fix')
      .setBackground('#F3E8FF').setFontColor('#6D28D9')
      .setRanges([statRange]).build(),
  );

  sheet.setConditionalFormatRules(rules);

  // Auto-filter
  sheet.getRange(1, 1, 101, headers.length).createFilter();

  // Bug ID auto-fill
  for (let i = 3; i <= 100; i++) {
    sheet.getRange(i, 1).setValue(`BUG-${String(i - 1).padStart(3, '0')}`);
  }
}

// ────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ────────────────────────────────────────────────────────────

function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName('📊 Dashboard');
  if (!dash) {
    SpreadsheetApp.getUi().alert('⚠️ No Dashboard found. Click "Generate Full Test Suite" first.');
    return;
  }

  // Force recalc all KPIs
  dash.getRange('B2').setFormula('=COUNTIF(\'📋 Test Cases\'!B2:B, "✅ Pass")');
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('✅ Dashboard refreshed!');
}

function exportSummaryReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const total = ss.getSheetByName('📋 Test Cases')?.getLastRow() - 1 || 0;
  const pass = ss.getSheetByName('📋 Test Cases')
    ?.getRange('B2:B').getValues().flat().filter(v => v === '✅ Pass').length || 0;
  const fail = ss.getSheetByName('📋 Test Cases')
    ?.getRange('B2:B').getValues().flat().filter(v => v === '❌ Fail').length || 0;
  const rate = total > 0 ? Math.round((pass / total) * 100) : 0;

  const html = `
    <div style="font-family: system-ui; padding: 20px;">
      <h2 style="color: #0F3B5E;">📊 Test Summary Report</h2>
      <hr style="border: 1px solid #E2E8F0;">
      <p><strong>Total Tests:</strong> ${total}</p>
      <p><strong>✅ Passed:</strong> ${pass}</p>
      <p><strong>❌ Failed:</strong> ${fail}</p>
      <p><strong>📊 Pass Rate:</strong> ${rate}%</p>
      <hr style="border: 1px solid #E2E8F0;">
      <p style="color: #64748B;">Generated: ${new Date().toLocaleString()}</p>
    </div>
  `;

  const output = SpreadsheetApp.create(`MMS Test Report ${new Date().toISOString().split('T')[0]}`);
  const outSheet = output.getActiveSheet();
  outSheet.getRange('A1').setValue('Test Summary Report');
  outSheet.getRange('A1').setFontSize(18).setFontWeight('bold');
  outSheet.getRange('A3').setValue('Total Tests').setFontWeight('bold');
  outSheet.getRange('B3').setValue(total);
  outSheet.getRange('A4').setValue('Passed').setFontWeight('bold');
  outSheet.getRange('B4').setValue(pass);
  outSheet.getRange('A5').setValue('Failed').setFontWeight('bold');
  outSheet.getRange('B5').setValue(fail);
  outSheet.getRange('A6').setValue('Pass Rate').setFontWeight('bold');
  outSheet.getRange('B6').setValue(rate + '%');

  ui.alert(`✅ Report exported to new spreadsheet: "MMS Test Report ${new Date().toISOString().split('T')[0]}"`);
}

function clearAllSheets() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ Confirm Clear',
    'Delete ALL test data? (Test Cases, Dashboard, Bug Report, Test Plan)',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['📋 Test Cases', '📊 Dashboard', '🐛 Bug Report', '📝 Test Plan'].forEach(name => {
    const s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
  });

  ui.alert('✅ All sheets cleared.');
}

// ────────────────────────────────────────────────────────────
// 130 PRE-FILLED TEST CASES
// ────────────────────────────────────────────────────────────
function getTestCases() {
  const today = new Date().toISOString().split('T')[0];
  return [
    ['TC-001','⏳ Pending','Auth','Registration','Positive','High','Register new admin user successfully','User does not exist','1. POST /api/auth/register\n2. Send valid admin data','{"email":"admin@test.com","password":"Pass123!","firstName":"Admin","lastName":"User","role":"admin"}','201 Created → { user: { email, role }, accessToken, refreshToken }','','','',today,'Local',''],
    ['TC-002','⏳ Pending','Auth','Registration','Positive','High','Register new mentor user','User does not exist','1. POST /api/auth/register with role=mentor','{"email":"mentor@test.com","password":"Pass123!","firstName":"Mentor","lastName":"User","role":"mentor"}','201 Created, role="mentor"','','','',today,'Local',''],
    ['TC-003','⏳ Pending','Auth','Registration','Positive','High','Register new mentee user','User does not exist','1. POST /api/auth/register with role=mentee','{"email":"mentee@test.com","password":"Pass123!","firstName":"Mentee","lastName":"User","role":"mentee"}','201 Created, role="mentee"','','','',today,'Local',''],
    ['TC-004','⏳ Pending','Auth','Registration','Negative','High','Reject duplicate email','User from TC-001 exists','1. POST /api/auth/register with same email','{"email":"admin@test.com","password":"Pass123!","firstName":"Dup","lastName":"User","role":"mentee"}','400 Bad Request: "Email already registered"','','','',today,'Local',''],
    ['TC-005','⏳ Pending','Auth','Registration','Negative','High','Reject missing required fields','None','1. POST /api/auth/register with only email','{"email":"incomplete@test.com"}','400 Bad Request with validation errors','','','',today,'Local',''],
    ['TC-006','⏳ Pending','Auth','Registration','Negative','High','Reject weak password','None','1. POST /api/auth/register with password < 6 chars','{"email":"weak@test.com","password":"123","firstName":"Weak","lastName":"Pass","role":"mentee"}','400 Bad Request: password too short','','','',today,'Local',''],
    ['TC-007','⏳ Pending','Auth','Registration','Negative','Medium','Reject invalid email format','None','1. POST /api/auth/register with bad email','{"email":"not-an-email","password":"Pass123!","firstName":"Bad","lastName":"Email","role":"mentee"}','400 Bad Request: invalid email','','','',today,'Local',''],
    ['TC-008','⏳ Pending','Auth','Registration','Negative','Medium','Reject invalid role enum','None','1. POST /api/auth/register with invalid role','{"email":"bad@test.com","password":"Pass123!","firstName":"Bad","lastName":"Role","role":"superadmin"}','400 Bad Request: invalid enum value','','','',today,'Local',''],
    ['TC-009','⏳ Pending','Auth','Login','Positive','High','Login with valid credentials','User from TC-001 exists','1. POST /api/auth/login with valid email + password','{"email":"admin@test.com","password":"Pass123!"}','201 Created → { user, accessToken, refreshToken }','','','',today,'Local',''],
    ['TC-010','⏳ Pending','Auth','Login','Negative','High','Reject wrong password','User from TC-001 exists','1. POST /api/auth/login with wrong password','{"email":"admin@test.com","password":"WrongPassword!"}','401 Unauthorized: "Invalid credentials"','','','',today,'Local',''],
    ['TC-011','⏳ Pending','Auth','Login','Negative','High','Reject non-existent email','None','1. POST /api/auth/login with unregistered email','{"email":"ghost@test.com","password":"Pass123!"}','401 Unauthorized','','','',today,'Local',''],
    ['TC-012','⏳ Pending','Auth','Login','Negative','Medium','Reject login missing fields','None','1. POST /api/auth/login with email only','{"email":"admin@test.com"}','400 Bad Request: missing password','','','',today,'Local',''],
    ['TC-013','⏳ Pending','Auth','Password Reset','Positive','High','Generate forgot password token','User from TC-001 exists','1. POST /api/auth/forgot-password with registered email','{"email":"admin@test.com"}','201 Created → { resetToken: "..." }','','','',today,'Local',''],
    ['TC-014','⏳ Pending','Auth','Password Reset','Negative','Medium','Reject forgot password for non-existent email','None','1. POST /api/auth/forgot-password with unregistered email','{"email":"ghost@test.com"}','400 Bad Request: "Email not found"','','','',today,'Local',''],
    ['TC-015','⏳ Pending','Auth','Password Reset','Positive','High','Reset password with valid token','Token from TC-013','1. POST /api/auth/reset-password with token + new password','{"token":"<from_TC-013>","password":"NewPass123!"}','201 Created: "Password reset successful"','','','',today,'Local',''],
    ['TC-016','⏳ Pending','Auth','Password Reset','Positive','High','Login with new password after reset','Password was reset in TC-015','1. POST /api/auth/login with new password','{"email":"admin@test.com","password":"NewPass123!"}','201 Created, login successful','','','',today,'Local',''],
    ['TC-017','⏳ Pending','Auth','Password Reset','Negative','High','Reject reset with invalid token','None','1. POST /api/auth/reset-password with fake token','{"token":"invalid-token","password":"NewPass123!"}','400 Bad Request: "Invalid or expired reset token"','','','',today,'Local',''],
    ['TC-018','⏳ Pending','Auth','Password Reset','Negative','Medium','Reject reset with weak password','Any token','1. POST /api/auth/reset-password with short password','{"token":"xxx","password":"123"}','400 Bad Request: password too short','','','',today,'Local',''],
    ['TC-019','⏳ Pending','Auth','Logout','Positive','Medium','Logout successfully','Valid JWT token','1. POST /api/auth/logout with Bearer token','Authorization: Bearer <token>','201 Created: "Logout successful"','','','',today,'Local',''],
    ['TC-020','⏳ Pending','Auth','Refresh Token','Positive','Medium','Refresh access token','Valid JWT token','1. POST /api/auth/refresh-token with Bearer token','Authorization: Bearer <token>','201 Created → new accessToken + refreshToken','','','',today,'Local',''],
    ['TC-021','⏳ Pending','Auth Guard','Route Protection','Negative','High','Reject access without token','None','1. GET /api/users/profile without Authorization','No auth header','401 Unauthorized: "No token provided"','','','',today,'Local',''],
    ['TC-022','⏳ Pending','Auth Guard','Route Protection','Negative','High','Reject malformed token','None','1. GET /api/users/profile with Bearer invalid','Authorization: Bearer invalid-token','401 Unauthorized: "Invalid token"','','','',today,'Local',''],
    ['TC-023','⏳ Pending','Auth Guard','Route Protection','Negative','Medium','Reject empty Bearer','None','1. GET /api/users/profile with Authorization: Bearer ','Authorization: Bearer ','401 Unauthorized','','','',today,'Local',''],
    ['TC-024','⏳ Pending','Auth Guard','Public Routes','Positive','High','Public route works without token','None','1. GET /api/skills without any auth','No auth header','200 OK, returns skills array','','','',today,'Local',''],
    ['TC-025','⏳ Pending','Auth Guard','Role Guard','Negative','High','Admin route rejected for mentee','Mentee token','1. GET /api/admin/dashboard with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-026','⏳ Pending','Auth Guard','Role Guard','Negative','High','Users list rejected for mentor','Mentor token','1. GET /api/users with mentor token','Authorization: Bearer <mentor_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-027','⏳ Pending','Auth Guard','Role Guard','Negative','High','Mentor approve rejected for mentee','Mentee token','1. POST /api/mentors/:id/approve with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-028','⏳ Pending','Users','Profile','Positive','High','Get own profile','Valid JWT token','1. GET /api/users/profile with token','Authorization: Bearer <token>','200 OK → { id, email, firstName, lastName, role }','','','',today,'Local',''],
    ['TC-029','⏳ Pending','Users','Profile','Positive','High','Update own profile','Valid JWT token','1. PUT /api/users/profile with userId + fields','{"userId":"<id>","firstName":"Updated"}','200 OK, profile updated','','','',today,'Local',''],
    ['TC-030','⏳ Pending','Users','Profile','Negative','Medium','Reject update empty body','Valid JWT token','1. PUT /api/users/profile with only userId','{"userId":"<id>"}','400 Bad Request: no update fields','','','',today,'Local',''],
    ['TC-031','⏳ Pending','Users','Admin CRUD','Positive','High','Admin list all users','Admin token','1. GET /api/users with admin token','Authorization: Bearer <admin_token>','200 OK, returns array of users','','','',today,'Local',''],
    ['TC-032','⏳ Pending','Users','Admin CRUD','Positive','Medium','Admin get user by ID','Admin token, existing userId','1. GET /api/users/:id with admin token','Authorization: Bearer <admin_token>','200 OK, returns user object','','','',today,'Local',''],
    ['TC-033','⏳ Pending','Users','Admin CRUD','Negative','Medium','404 for non-existent user','Admin token','1. GET /api/users/00000000-...','Authorization: Bearer <admin_token>','404 Not Found','','','',today,'Local',''],
    ['TC-034','⏳ Pending','Users','Security','Negative','High','Reject profile update without token','None','1. PUT /api/users/profile without Authorization','No auth header','401 Unauthorized','','','',today,'Local',''],
    ['TC-035','⏳ Pending','Skills','List','Positive','High','List all skills publicly','None (public)','1. GET /api/skills without token','No auth required','200 OK, returns array of skills','','','',today,'Local',''],
    ['TC-036','⏳ Pending','Skills','Create','Positive','High','Admin creates skill','Admin token','1. POST /api/skills with admin token + name','{"name":"TypeScript","description":"TS language"}','201 Created → { id, name, description }','','','',today,'Local',''],
    ['TC-037','⏳ Pending','Skills','Create','Negative','High','Reject skill without name','Admin token','1. POST /api/skills without name','{"description":"No name"}','400 Bad Request: name required','','','',today,'Local',''],
    ['TC-038','⏳ Pending','Skills','Create','Negative','High','Reject duplicate skill name','Skill from TC-036 exists','1. POST /api/skills with same name as TC-036','{"name":"TypeScript"}','400 Bad Request: duplicate name','','','',today,'Local',''],
    ['TC-039','⏳ Pending','Skills','Create','Negative','High','Reject skill creation by non-admin','Mentee token','1. POST /api/skills with mentee token','{"name":"Should-Fail"}','403 Forbidden','','','',today,'Local',''],
    ['TC-040','⏳ Pending','Skills','Get by ID','Positive','Medium','Get skill by ID publicly','None (public), skill exists','1. GET /api/skills/:id without token','No auth required','200 OK, returns skill object','','','',today,'Local',''],
    ['TC-041','⏳ Pending','Skills','Get by ID','Negative','Medium','404 for non-existent skill','None','1. GET /api/skills/00000000-...','No auth required','404 Not Found','','','',today,'Local',''],
    ['TC-042','⏳ Pending','Skills','Update','Positive','Medium','Admin updates skill','Admin token, skill exists','1. PUT /api/skills/:id with admin token','{"description":"Updated description"}','200 OK, skill updated','','','',today,'Local',''],
    ['TC-043','⏳ Pending','Skills','Update','Negative','High','Reject skill update by non-admin','Mentee token, skill exists','1. PUT /api/skills/:id with mentee token','{"name":"Hacked"}','403 Forbidden','','','',today,'Local',''],
    ['TC-044','⏳ Pending','Skills','Delete','Positive','Medium','Admin deletes skill','Admin token, skill exists','1. DELETE /api/skills/:id with admin token','Authorization: Bearer <admin_token>','200 OK, skill deleted','','','',today,'Local',''],
    ['TC-045','⏳ Pending','Skills','Get by ID','Negative','Medium','404 for deleted skill','Skill from TC-044 deleted','1. GET /api/skills/:id (deleted)','No auth required','404 Not Found','','','',today,'Local',''],
    ['TC-046','⏳ Pending','Skills','Category Filter','Positive','Low','Get skills by category','Category exists','1. GET /api/skills/category/:categoryId','No auth required','200 OK, returns array (may be empty)','','','',today,'Local',''],
    ['TC-047','⏳ Pending','Skills','Create','Negative','Medium','Reject skill with unknown fields','Admin token','1. POST /api/skills with unknown field','{"name":"Valid","hackedField":"should fail"}','400 Bad Request: unknown field','','','',today,'Local',''],
    ['TC-048','⏳ Pending','Mentors','Create','Positive','High','Admin creates mentor profile','Admin token, user exists','1. POST /api/mentors with admin token + data','{"userId":"<id>","title":"Senior Dev","company":"Google","nid":"0123456789","phone":"01234567890"}','201 Created → { id, title, company, status }','','','',today,'Local',''],
    ['TC-049','⏳ Pending','Mentors','Create','Negative','High','Reject duplicate NID','Mentor exists with that NID','1. POST /api/mentors with same NID','{"userId":"<id>","title":"Duplicate","nid":"0123456789"}','400 Bad Request: duplicate NID','','','',today,'Local',''],
    ['TC-050','⏳ Pending','Mentors','List','Positive','High','List all mentors','Mentor exists, valid token','1. GET /api/mentors with auth token','Authorization: Bearer <token>','200 OK, returns array of mentors','','','',today,'Local',''],
    ['TC-051','⏳ Pending','Mentors','Update','Positive','Medium','Update mentor profile','Mentor exists','1. PUT /api/mentors/:id with updated fields','{"title":"Lead QA Engineer"}','200 OK, mentor updated','','','',today,'Local',''],
    ['TC-052','⏳ Pending','Mentors','Update','Negative','Medium','Reject invalid phone format','Mentor exists','1. PUT /api/mentors/:id with invalid phone','{"phone":"invalid-phone"}','400 Bad Request: invalid phone','','','',today,'Local',''],
    ['TC-053','⏳ Pending','Mentors','Approval','Positive','High','Admin approves mentor','Admin token, mentor pending','1. POST /api/mentors/:id/approve with admin token','Authorization: Bearer <admin_token>','201 Created, mentor approved','','','',today,'Local',''],
    ['TC-054','⏳ Pending','Mentors','Approval','Negative','High','Reject approval by non-admin','Mentee token','1. POST /api/mentors/:id/approve with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-055','⏳ Pending','Mentors','Rejection','Positive','High','Admin rejects mentor with reason','Admin token, mentor exists','1. POST /api/mentors/:id/reject with reason','{"reason":"Insufficient qualifications"}','201 Created, mentor rejected','','','',today,'Local',''],
    ['TC-056','⏳ Pending','Mentors','Suspend','Positive','High','Admin suspends mentor','Admin token, mentor exists','1. POST /api/mentors/:id/suspend with admin token','Authorization: Bearer <admin_token>','201 Created, mentor suspended','','','',today,'Local',''],
    ['TC-057','⏳ Pending','Mentors','Delete','Positive','Medium','Admin deletes mentor','Admin token, mentor exists','1. DELETE /api/mentors/:id with admin token','Authorization: Bearer <admin_token>','200 OK, mentor deleted','','','',today,'Local',''],
    ['TC-058','⏳ Pending','Mentors','Approval','Negative','Medium','404 when approving non-existent mentor','Admin token','1. POST /api/mentors/0000.../approve','Authorization: Bearer <admin_token>','404 Not Found','','','',today,'Local',''],
    ['TC-059','⏳ Pending','Mentees','Create','Positive','High','Create mentee profile','Valid token, user exists','1. POST /api/mentees with auth token + data','{"userId":"<id>","occupation":"Student","goals":"Learn coding"}','201 Created → { id, occupation, goals }','','','',today,'Local',''],
    ['TC-060','⏳ Pending','Mentees','List','Positive','Medium','List all mentees','Valid token','1. GET /api/mentees with auth token','Authorization: Bearer <token>','200 OK, returns array of mentees','','','',today,'Local',''],
    ['TC-061','⏳ Pending','Mentees','Get by ID','Positive','Medium','Get mentee by ID','Mentee exists, valid token','1. GET /api/mentees/:id','Authorization: Bearer <token>','200 OK, returns mentee object','','','',today,'Local',''],
    ['TC-062','⏳ Pending','Mentees','Update','Positive','Medium','Update mentee profile','Mentee exists, valid token','1. PUT /api/mentees/:id with updated fields','{"occupation":"Junior Developer"}','200 OK, mentee updated','','','',today,'Local',''],
    ['TC-063','⏳ Pending','Mentees','Delete','Negative','High','Reject mentee deletion by non-admin','Mentee token','1. DELETE /api/mentees/:id with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-064','⏳ Pending','Mentees','Delete','Positive','Medium','Admin deletes mentee','Admin token, mentee exists','1. DELETE /api/mentees/:id with admin token','Authorization: Bearer <admin_token>','200 OK, mentee deleted','','','',today,'Local',''],
    ['TC-065','⏳ Pending','Sessions','Create','Positive','High','Create session request','Mentee token, mentor & mentee exist','1. POST /api/sessions with mentee token + data','{"mentorId":"<id>","menteeId":"<id>","title":"Career Advice","scheduledAt":"2026-06-15T14:00:00Z","duration":60}','201 Created → { id, title, status, scheduledAt }','','','',today,'Local',''],
    ['TC-066','⏳ Pending','Sessions','Create','Negative','High','Reject session with past date','Mentee token','1. POST /api/sessions with past scheduledAt','{"mentorId":"<id>","menteeId":"<id>","title":"Past","scheduledAt":"2020-01-01T00:00:00Z"}','400 Bad Request: past date','','','',today,'Local',''],
    ['TC-067','⏳ Pending','Sessions','Create','Negative','High','Reject session missing fields','Mentee token','1. POST /api/sessions with only title','{"title":"Incomplete"}','400 Bad Request: validation errors','','','',today,'Local',''],
    ['TC-068','⏳ Pending','Sessions','Create','Negative','Medium','Reject duration > 180','Mentee token','1. POST /api/sessions with duration=200','{"mentorId":"<id>","menteeId":"<id>","title":"Too Long","scheduledAt":"2026-06-15T14:00:00Z","duration":200}','400 Bad Request: max 180 min','','','',today,'Local',''],
    ['TC-069','⏳ Pending','Sessions','Create','Negative','Medium','Reject duration < 15','Mentee token','1. POST /api/sessions with duration=5','{"mentorId":"<id>","menteeId":"<id>","title":"Too Short","scheduledAt":"2026-06-15T14:00:00Z","duration":5}','400 Bad Request: min 15 min','','','',today,'Local',''],
    ['TC-070','⏳ Pending','Sessions','List','Positive','High','List all sessions','Valid token','1. GET /api/sessions with auth token','Authorization: Bearer <token>','200 OK, returns array of sessions','','','',today,'Local',''],
    ['TC-071','⏳ Pending','Sessions','Get by ID','Positive','Medium','Get session by ID','Session exists, valid token','1. GET /api/sessions/:id','Authorization: Bearer <token>','200 OK, returns session object','','','',today,'Local',''],
    ['TC-072','⏳ Pending','Sessions','Update','Positive','Medium','Update session','Session exists, valid token','1. PUT /api/sessions/:id with updated fields','{"title":"Updated Title"}','200 OK, session updated','','','',today,'Local',''],
    ['TC-073','⏳ Pending','Sessions','Accept','Negative','High','Reject accept by non-mentor','Mentee token, session exists','1. POST /api/sessions/:id/accept with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-074','⏳ Pending','Sessions','Accept','Positive','High','Mentor accepts session','Mentor token, session exists','1. POST /api/sessions/:id/accept with mentor token','Authorization: Bearer <mentor_token>','201 Created, session accepted','','','',today,'Local',''],
    ['TC-075','⏳ Pending','Sessions','Decline','Negative','High','Reject decline by non-mentor','Mentee token, session exists','1. POST /api/sessions/:id/decline with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-076','⏳ Pending','Sessions','Complete','Positive','High','Complete a session','Valid token, session exists','1. POST /api/sessions/:id/complete','Authorization: Bearer <token>','201 Created, session completed','','','',today,'Local',''],
    ['TC-077','⏳ Pending','Sessions','Cancel','Positive','Medium','Cancel a session','Valid token, session exists','1. POST /api/sessions/:id/cancel','Authorization: Bearer <token>','201 Created, session cancelled','','','',today,'Local',''],
    ['TC-078','⏳ Pending','Sessions','No-Show','Positive','Medium','Mark session as no-show','Valid token, session exists','1. POST /api/sessions/:id/no-show','Authorization: Bearer <token>','201 Created, no-show marked','','','',today,'Local',''],
    ['TC-079','⏳ Pending','Sessions','Cancel','Negative','Medium','404 cancelling non-existent session','Valid token','1. POST /api/sessions/0000.../cancel','Authorization: Bearer <token>','404 Not Found','','','',today,'Local',''],
    ['TC-080','⏳ Pending','Sessions','Delete','Positive','Low','Delete a session','Valid token, session exists','1. DELETE /api/sessions/:id','Authorization: Bearer <token>','200 OK, session deleted','','','',today,'Local',''],
    ['TC-081','⏳ Pending','Matchings','Create','Positive','High','Admin creates matching','Admin token','1. POST /api/matchings with admin token','{"mentorId":"<id>","menteeId":"<id>","reason":"Good match"}','201 Created → { id, mentorId, menteeId, status }','','','',today,'Local',''],
    ['TC-082','⏳ Pending','Matchings','Create','Negative','High','Reject matching by non-admin','Mentee token','1. POST /api/matchings with mentee token','{"mentorId":"<id>","menteeId":"<id>"}','403 Forbidden','','','',today,'Local',''],
    ['TC-083','⏳ Pending','Matchings','List','Positive','Medium','List all matchings','Valid token','1. GET /api/matchings','Authorization: Bearer <token>','200 OK, returns array','','','',today,'Local',''],
    ['TC-084','⏳ Pending','Matchings','Get by ID','Positive','Low','Get matching by ID','Matching exists','1. GET /api/matchings/:id','Authorization: Bearer <token>','200 OK, returns matching object','','','',today,'Local',''],
    ['TC-085','⏳ Pending','Matchings','Update','Positive','Medium','Update matching status','Matching exists, valid token','1. PUT /api/matchings/:id with status','{"status":"accepted"}','200 OK, matching updated','','','',today,'Local',''],
    ['TC-086','⏳ Pending','Matchings','Delete','Positive','Medium','Admin deletes matching','Admin token, matching exists','1. DELETE /api/matchings/:id with admin token','Authorization: Bearer <admin_token>','200 OK, matching deleted','','','',today,'Local',''],
    ['TC-087','⏳ Pending','Feedback','Create','Positive','High','Submit feedback','Mentee token, mentor & mentee exist','1. POST /api/feedback with mentee token + data','{"mentorId":"<id>","menteeId":"<id>","rating":5,"comment":"Great!","isAnonymous":false}','201 Created → { id, rating, comment }','','','',today,'Local',''],
    ['TC-088','⏳ Pending','Feedback','Create','Negative','High','Reject rating > 5','Mentee token','1. POST /api/feedback with rating=10','{"mentorId":"<id>","menteeId":"<id>","rating":10}','400 Bad Request: max 5','','','',today,'Local',''],
    ['TC-089','⏳ Pending','Feedback','Create','Negative','Medium','Reject rating < 1','Mentee token','1. POST /api/feedback with rating=0','{"mentorId":"<id>","menteeId":"<id>","rating":0}','400 Bad Request: min 1','','','',today,'Local',''],
    ['TC-090','⏳ Pending','Feedback','Create','Negative','High','Reject missing required fields','Mentee token','1. POST /api/feedback without rating','{"mentorId":"<id>","menteeId":"<id>"}','400 Bad Request: rating required','','','',today,'Local',''],
    ['TC-091','⏳ Pending','Feedback','List','Positive','Medium','List all feedback','Valid token','1. GET /api/feedback','Authorization: Bearer <token>','200 OK, returns array of feedback','','','',today,'Local',''],
    ['TC-092','⏳ Pending','Feedback','Get by ID','Positive','Low','Get feedback by ID','Feedback exists, valid token','1. GET /api/feedback/:id','Authorization: Bearer <token>','200 OK, returns feedback object','','','',today,'Local',''],
    ['TC-093','⏳ Pending','Feedback','Get by Mentor','Positive','Medium','Get feedback by mentor ID','Mentor exists, valid token','1. GET /api/feedback/mentor/:mentorId','Authorization: Bearer <token>','200 OK, returns array','','','',today,'Local',''],
    ['TC-094','⏳ Pending','Feedback','Update','Positive','Medium','Update feedback','Feedback exists, valid token','1. PUT /api/feedback/:id with updated fields','{"rating":4,"comment":"Updated"}','200 OK, feedback updated','','','',today,'Local',''],
    ['TC-095','⏳ Pending','Feedback','Delete','Positive','Medium','Delete feedback','Feedback exists, valid token','1. DELETE /api/feedback/:id','Authorization: Bearer <token>','200 OK, feedback deleted','','','',today,'Local',''],
    ['TC-096','⏳ Pending','Notifications','Create','Positive','High','Admin creates notification','Admin token, user exists','1. POST /api/notifications with admin token + data','{"userId":"<id>","title":"Test","message":"Hello!","type":"in_app"}','201 Created → { id, title, message, isRead }','','','',today,'Local',''],
    ['TC-097','⏳ Pending','Notifications','Create','Negative','High','Reject by non-admin','Mentee token','1. POST /api/notifications with mentee token','{"userId":"<id>","title":"Fail","message":"X"}','403 Forbidden','','','',today,'Local',''],
    ['TC-098','⏳ Pending','Notifications','List','Positive','Medium','List notifications','Valid token','1. GET /api/notifications','Authorization: Bearer <token>','200 OK, returns array','','','',today,'Local',''],
    ['TC-099','⏳ Pending','Notifications','Get by ID','Positive','Low','Get notification by ID','Notification exists','1. GET /api/notifications/:id','Authorization: Bearer <token>','200 OK, returns notification','','','',today,'Local',''],
    ['TC-100','⏳ Pending','Notifications','Unread','Positive','Medium','Get unread count','Valid token','1. GET /api/notifications/unread','Authorization: Bearer <token>','200 OK, returns count','','','',today,'Local',''],
    ['TC-101','⏳ Pending','Notifications','Mark Read','Positive','Medium','Mark as read','Notification exists','1. PUT /api/notifications/:id/read','Authorization: Bearer <token>','200 OK, marked read','','','',today,'Local',''],
    ['TC-102','⏳ Pending','Notifications','Delete','Positive','Medium','Delete notification','Notification exists','1. DELETE /api/notifications/:id','Authorization: Bearer <token>','200 OK, deleted','','','',today,'Local',''],
    ['TC-103','⏳ Pending','Notifications','Delete','Negative','Medium','404 non-existent notification','Valid token','1. DELETE /api/notifications/0000...','Authorization: Bearer <token>','404 Not Found','','','',today,'Local',''],
    ['TC-104','⏳ Pending','Admin','Dashboard','Positive','High','Get dashboard stats','Admin token','1. GET /api/admin/dashboard','Authorization: Bearer <admin_token>','200 OK → { totalUsers, totalSessions, ... }','','','',today,'Local',''],
    ['TC-105','⏳ Pending','Admin','Users','Positive','High','Admin lists all users','Admin token','1. GET /api/admin/users','Authorization: Bearer <admin_token>','200 OK, returns array of users','','','',today,'Local',''],
    ['TC-106','⏳ Pending','Admin','Mentors','Positive','Medium','Admin lists mentors','Admin token','1. GET /api/admin/mentors','Authorization: Bearer <admin_token>','200 OK, returns array','','','',today,'Local',''],
    ['TC-107','⏳ Pending','Admin','Mentees','Positive','Medium','Admin lists mentees','Admin token','1. GET /api/admin/mentees','Authorization: Bearer <admin_token>','200 OK, returns array','','','',today,'Local',''],
    ['TC-108','⏳ Pending','Admin','User Mgmt','Positive','High','Deactivate user','Admin token, user exists','1. POST /api/admin/users/:id/deactivate','Authorization: Bearer <admin_token>','201 Created, deactivated','','','',today,'Local',''],
    ['TC-109','⏳ Pending','Admin','User Mgmt','Negative','Medium','404 deactivating non-existent user','Admin token','1. POST /api/admin/users/0000.../deactivate','Authorization: Bearer <admin_token>','404 Not Found','','','',today,'Local',''],
    ['TC-110','⏳ Pending','Admin','User Mgmt','Positive','High','Admin resets user password','Admin token, user exists','1. POST /api/admin/users/:id/reset-password','{"password":"NewTempPass123!"}','201 Created, password reset','','','',today,'Local',''],
    ['TC-111','⏳ Pending','Admin','Feedback','Positive','Medium','Admin moderates feedback','Admin token, feedback exists','1. DELETE /api/admin/feedback/:id','Authorization: Bearer <admin_token>','200 OK, feedback deleted','','','',today,'Local',''],
    ['TC-112','⏳ Pending','Admin','User Mgmt','Positive','High','Admin deletes user','Admin token, user exists','1. DELETE /api/admin/users/:id','Authorization: Bearer <admin_token>','200 OK, user deleted','','','',today,'Local',''],
    ['TC-113','⏳ Pending','Admin','User Mgmt','Negative','Medium','404 deleting non-existent user','Admin token','1. DELETE /api/admin/users/0000...','Authorization: Bearer <admin_token>','404 Not Found','','','',today,'Local',''],
    ['TC-114','⏳ Pending','Activity Logs','List','Positive','Medium','List activity logs (admin)','Admin token','1. GET /api/activity-logs with admin token','Authorization: Bearer <admin_token>','200 OK, returns array of logs','','','',today,'Local',''],
    ['TC-115','⏳ Pending','Activity Logs','Get by ID','Positive','Low','Get activity log by ID','Admin token, log exists','1. GET /api/activity-logs/:id','Authorization: Bearer <admin_token>','200 OK, returns log','','','',today,'Local',''],
    ['TC-116','⏳ Pending','Activity Logs','Create','Positive','Low','Create activity log (admin)','Admin token','1. POST /api/activity-logs with admin token','{"action":"create","entity":"test","entityId":"0000...","description":"QA test"}','201 Created','','','',today,'Local',''],
    ['TC-117','⏳ Pending','Activity Logs','Security','Negative','High','Reject by non-admin','Mentee token','1. GET /api/activity-logs with mentee token','Authorization: Bearer <mentee_token>','403 Forbidden','','','',today,'Local',''],
    ['TC-118','⏳ Pending','Resources','Create','Positive','High','Mentor creates a resource','Mentor token','1. POST /api/resources with mentor token + data','{"mentorId":"<id>","title":"Node.js Guide","type":"document","fileUrl":"https://example.com/doc.pdf"}','201 Created → { id, title, type, fileUrl }','','','',today,'Local',''],
    ['TC-119','⏳ Pending','Resources','Create','Negative','High','Reject by non-mentor','Mentee token','1. POST /api/resources with mentee token','{"mentorId":"<id>","title":"Fail","type":"document"}','403 Forbidden','','','',today,'Local',''],
    ['TC-120','⏳ Pending','Resources','Create','Negative','Medium','Reject without title','Mentor token','1. POST /api/resources with only mentorId','{"mentorId":"<id>"}','400 Bad Request: title required','','','',today,'Local',''],
    ['TC-121','⏳ Pending','Resources','List','Positive','Medium','Get resources by mentor (public)','None (public)','1. GET /api/resources/:mentorId without token','No auth required','200 OK, returns array','','','',today,'Local',''],
    ['TC-122','⏳ Pending','Resources','Delete','Positive','Medium','Mentor deletes resource','Mentor token, resource exists','1. DELETE /api/resources/:id with mentor token','Authorization: Bearer <mentor_token>','200 OK, deleted','','','',today,'Local',''],
    ['TC-123','⏳ Pending','Resources','Delete','Negative','Medium','404 non-existent resource','Mentor token','1. DELETE /api/resources/0000...','Authorization: Bearer <mentor_token>','404 Not Found','','','',today,'Local',''],
    ['TC-124','⏳ Pending','Availability','Get','Positive','Medium','Get mentor availability (public)','None (public)','1. GET /api/availabilities/:mentorId without token','No auth required','200 OK, returns availability data','','','',today,'Local',''],
    ['TC-125','⏳ Pending','Availability','Slots','Positive','Medium','Get slots by date (public)','None (public)','1. GET /api/availabilities/:mentorId/slots?date=2026-06-15','No auth required','200 OK, returns slots array','','','',today,'Local',''],
    ['TC-126','⏳ Pending','Availability','Create','Positive','High','Mentor sets availability','Mentor token','1. POST /api/availabilities with mentor token + data','{"mentorId":"<id>","date":"2026-06-15","startTime":"09:00","endTime":"17:00"}','201 Created','','','',today,'Local',''],
    ['TC-127','⏳ Pending','Availability','Create','Negative','High','Reject by non-mentor','Mentee token','1. POST /api/availabilities with mentee token','{"mentorId":"<id>","date":"2026-06-15","startTime":"09:00","endTime":"17:00"}','403 Forbidden','','','',today,'Local',''],
    ['TC-128','⏳ Pending','Availability','Update','Positive','Medium','Mentor updates availability','Mentor token, availability exists','1. PUT /api/availabilities/:id with updated times','{"startTime":"10:00","endTime":"16:00"}','200 OK','','','',today,'Local',''],
    ['TC-129','⏳ Pending','Availability','Delete','Positive','Medium','Mentor deletes availability','Mentor token, availability exists','1. DELETE /api/availabilities/:id','Authorization: Bearer <mentor_token>','200 OK','','','',today,'Local',''],
    ['TC-130','⏳ Pending','Availability','Block','Positive','Low','Mentor blocks a date','Mentor token','1. POST /api/availabilities/block with mentor token','{"mentorId":"<id>","date":"2026-06-20","startTime":"00:00","endTime":"23:59"}','201 Created','','','',today,'Local',''],
  ];
}