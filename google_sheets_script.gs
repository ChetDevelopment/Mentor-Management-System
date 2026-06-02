/**
 * 🧪 MMS Test Suite Generator
 * Paste this in Google Sheets → Extensions → Apps Script → Save → Run
 */

const C = {
  navy: '#0F3B5E', blue: '#1A5A8A', cyan: '#00A3E0',
  green: '#10B981', red: '#EF4444', amber: '#F59E0B',
  white: '#FFFFFF', dark: '#1E293B', mute: '#64748B',
  bg: '#F8FAFC', row1: '#FFFFFF', row2: '#F1F5F9',
  passBg: '#D1FAE5', failBg: '#FEE2E2', pendBg: '#FEF3C7',
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧪 MMS')
    .addItem('🔄 Generate All', 'generateAll')
    .addToUi();
}

function generateAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['📋 Test Cases','📊 Dashboard','🐛 Bugs','📝 Plan'].forEach(n => {
    const s = ss.getSheetByName(n);
    if (s) ss.deleteSheet(s);
  });
  makePlan(ss);
  makeCases(ss);
  makeDashboard(ss);
  makeBugs(ss);
  ss.setActiveSheet(ss.getSheetByName('📊 Dashboard'));
  SpreadsheetApp.getUi().alert('✅ Done! 4 sheets created.');
}

// ─── TEST PLAN ──────────────────────────────────────────
function makePlan(ss) {
  const sh = ss.insertSheet('📝 Plan', 0);
  const d = [
    ['',''],['🧪 TEST PLAN — MMS',''],['',''],
    ['Project','MMS'],['Version','1.0.0'],
    ['Date',new Date().toISOString().split('T')[0]],['Tester','[Name]'],['',''],
    ['📋 SCOPE',''],['In Scope','All API endpoints'],['Out of Scope','UI/Frontend'],['',''],
    ['📊 SUMMARY',''],['Total','=COUNTA(\'📋 Test Cases\'!A2:A)'],
    ['✅ Pass','=COUNTIF(\'📋 Test Cases\'!B2:B,"✅ Pass")'],
    ['❌ Fail','=COUNTIF(\'📋 Test Cases\'!B2:B,"❌ Fail")'],
    ['⏳ Pending','=COUNTIF(\'📋 Test Cases\'!B2:B,"⏳ Pending")'],
    ['Rate','=IF(B14=0,0,ROUND(B15/B14*100,1))&"%"'],['',''],
    ['✅ APPROVALS',''],['Test Lead','________'],['PM','________'],['Date','________'],
  ];
  sh.getRange(1,1,d.length,2).setValues(d);
  sh.getRange('B2').setFontSize(20).setFontWeight('bold').setFontColor(C.navy);
  sh.setColumnWidth(1,150); sh.setColumnWidth(2,400);
}

// ─── TEST CASES ─────────────────────────────────────────
function makeCases(ss) {
  const sh = ss.insertSheet('📋 Test Cases', 1);
  sh.setFrozenRows(1).setFrozenColumns(2);
  const h = ['TC ID','Status','Module','Feature','Type','Priority',
    'Description','Preconditions','Steps','Test Data','Expected','Actual',
    'Bug Ref','Tester','Date','Env','Notes'];
  const hr = sh.getRange(1,1,1,h.length);
  hr.setValues([h]).setBackground(C.navy).setFontColor(C.white).setFontWeight('bold');
  const data = getData();
  if (!data.length) return;
  const r = sh.getRange(2,1,data.length,h.length);
  r.setValues(data).setVerticalAlignment('top').setFontSize(10);
  for (let i=0;i<data.length;i++) {
    sh.getRange(i+2,1,1,h.length).setBackground(i%2===0?C.row1:C.row2);
  }
  const widths = [75,90,100,120,80,70,260,180,300,240,260,200,65,100,85,80,180];
  widths.forEach((w,i)=>sh.setColumnWidth(i+1,w));
  // Status dropdown
  sh.getRange(2,2,data.length,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['⏳ Pending','✅ Pass','❌ Fail','⛔ Blocked'],true).setAllowInvalid(false).build()
  ).setValue('⏳ Pending');
  sh.getRange(2,5,data.length,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Positive','Negative','Edge Case'],true).build());
  sh.getRange(2,6,data.length,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['High','Medium','Low'],true).build());
  sh.getRange(2,16,data.length,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Local','Staging','Production'],true).build()).setValue('Local');
  sh.getRange(2,15,data.length,1).setValue(new Date().toISOString().split('T')[0]);
  sh.getRange(1,1,data.length+1,h.length).createFilter();
}

// ─── DASHBOARD ──────────────────────────────────────────
function makeDashboard(ss) {
  const sh = ss.insertSheet('📊 Dashboard', 2);
  sh.getRange('A1:D1').merge();
  sh.getRange('A1').setValue('📊 DASHBOARD').setFontSize(22).setFontWeight('bold').setFontColor(C.navy).setHorizontalAlignment('center').setBackground(C.bg);
  const kpis = [
    ['🧪 Total','=COUNTA(\'📋 Test Cases\'!A2:A)',C.navy],
    ['✅ Pass','=COUNTIF(\'📋 Test Cases\'!B2:B,"✅ Pass")',C.green],
    ['❌ Fail','=COUNTIF(\'📋 Test Cases\'!B2:B,"❌ Fail")',C.red],
    ['📊 Rate','=IF(B2=0,0,ROUND(B3/B2*100,1))',C.cyan]];
  kpis.forEach((k,i)=>{
    const col=i*2+1;
    sh.getRange(3,col).setValue(k[0]).setFontSize(11).setFontColor(C.mute).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange(4,col).setFormula(k[1]).setFontSize(36).setFontWeight('bold').setFontColor(k[2]).setHorizontalAlignment('center');
    sh.getRange(3,col,2,2).merge();
    sh.setColumnWidth(col,145); sh.setColumnWidth(col+1,20);
  });
  sh.setRowHeight(1,40); sh.setRowHeight(3,25); sh.setRowHeight(4,70);

  const mods = ['Auth','Auth Guard','Users','Skills','Mentors','Mentees',
    'Sessions','Matchings','Feedback','Notifications','Admin','Activity Logs','Resources','Availability'];
  sh.getRange('A7:G7').merge();
  sh.getRange('A7').setValue('📋 MODULE BREAKDOWN').setFontSize(14).setFontWeight('bold').setFontColor(C.navy).setBackground(C.bg);
  const th = ['Module','Total','✅ Pass','❌ Fail','⏳ Pending','⛔ Blocked','Rate'];
  sh.getRange(8,1,1,7).setValues([th]).setBackground(C.navy).setFontColor(C.white).setFontWeight('bold').setHorizontalAlignment('center');
  mods.forEach((m,i)=>{
    const row=9+i;
    sh.getRange(row,1).setValue(m).setFontWeight('bold');
    sh.getRange(row,2).setFormula(`=COUNTIF('📋 Test Cases'!C2:C,"${m}")`);
    sh.getRange(row,3).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C,"${m}",'📋 Test Cases'!B2:B,"✅ Pass")`);
    sh.getRange(row,4).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C,"${m}",'📋 Test Cases'!B2:B,"❌ Fail")`);
    sh.getRange(row,5).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C,"${m}",'📋 Test Cases'!B2:B,"⏳ Pending")`);
    sh.getRange(row,6).setFormula(`=COUNTIFS('📋 Test Cases'!C2:C,"${m}",'📋 Test Cases'!B2:B,"⛔ Blocked")`);
    sh.getRange(row,7).setFormula(`=IF(B${row}=0,0,ROUND(C${row}/B${row}*100,1))`);
    sh.getRange(row,1,1,7).setBackground(i%2===0?C.row1:C.row2).setHorizontalAlignment('center');
  });
  const tRow=9+mods.length;
  sh.getRange(tRow,1,1,7).setBackground(C.blue).setFontColor(C.white).setFontWeight('bold');
  sh.getRange(tRow,1).setValue('TOTAL');
  for(let c=2;c<=6;c++) sh.getRange(tRow,c).setFormula(`=SUM(${String.fromCharCode(64+c)}9:${String.fromCharCode(64+c)}${tRow-1})`);
  sh.getRange(tRow,7).setFormula(`=IF(B${tRow}=0,0,ROUND(C${tRow}/B${tRow}*100,1))`);
  [130,70,70,70,70,70,80].forEach((w,i)=>sh.setColumnWidth(i+1,w));

  // Bugs section on Dashboard
  const bRow=tRow+2;
  sh.getRange(`A${bRow}:G${bRow}`).merge();
  sh.getRange(`A${bRow}`).setValue('🐛 BUGS').setFontSize(14).setFontWeight('bold').setFontColor(C.navy).setBackground(C.bg);
  const bh=['Bug ID','Severity','Status','Module','Title','Assigned','Date'];
  sh.getRange(bRow+1,1,1,7).setValues([bh]).setBackground(C.blue).setFontColor(C.white).setFontWeight('bold');
  for(let c=1;c<=7;c++) sh.getRange(bRow+2,c).setFormula(`=IFERROR('🐛 Bugs'!${String.fromCharCode(64+c)}2,"")`);
}

// ─── BUG REPORT ─────────────────────────────────────────
function makeBugs(ss) {
  const sh = ss.insertSheet('🐛 Bugs', 3);
  sh.setFrozenRows(1);
  const h = ['Bug ID','Severity','Status','Module','TC Ref','Title','Description',
    'Steps to Reproduce','Expected','Actual','Reported By','Date Reported',
    'Assigned To','Screenshot/Link','Environment','Date Fixed','Fix Commit','Notes'];
  const hr = sh.getRange(1,1,1,h.length);
  hr.setValues([h]).setBackground(C.red).setFontColor(C.white).setFontWeight('bold').setHorizontalAlignment('center');
  const widths = [70,90,100,90,60,200,280,260,180,180,110,100,120,120,90,90,90,200];
  widths.forEach((w,i)=>sh.setColumnWidth(i+1,w));

  // Example bug row
  sh.getRange('A2').setValue('BUG-001');
  sh.getRange('B2').setValue('🔴 Critical');
  sh.getRange('C2').setValue('Open');
  sh.getRange('D2').setValue('Auth');
  sh.getRange('E2').setValue('TC-010');
  sh.getRange('F2').setValue('Login returns 500 instead of 401');
  sh.getRange('G2').setValue('When user logs in with wrong password, API returns 500 error instead of 401 Unauthorized.');
  sh.getRange('H2').setValue('1. POST /api/auth/login\n2. Use wrong password\n3. Check status code');
  sh.getRange('I2').setValue('401 Unauthorized');
  sh.getRange('J2').setValue('500 Server Error');
  sh.getRange('K2').setValue('[Tester]');
  sh.getRange('L2').setFormula('=IF(A2="","",TODAY())');
  sh.getRange('M2').setValue('[Dev]');
  sh.getRange('N2').setValue('[Link]');
  sh.getRange('O2').setValue('Local');
  sh.getRange('P2').setFormula('=IF(C2="Fixed",TODAY(),"")');
  sh.getRange('Q2').setValue('');
  sh.getRange('R2').setValue('Blocks login flow');
  sh.getRange('A2:R2').setVerticalAlignment('top').setFontSize(10);

  // Auto-date formulas for all rows
  sh.getRange(2,12,99,1).setFormula('=IF(A2="","",TODAY())').setNumberFormat('yyyy-mm-dd');
  sh.getRange(2,16,99,1).setFormula('=IF(C2="Fixed",TODAY(),"")').setNumberFormat('yyyy-mm-dd');

  // Bug ID auto-fill
  for(let i=3;i<=100;i++) sh.getRange(i,1).setValue(`BUG-${String(i-1).padStart(3,'0')}`);

  // Dropdowns
  sh.getRange(2,2,99,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['🔴 Critical','🟠 Major','🟡 Minor','⚪ Trivial'],true).setAllowInvalid(false).build());
  sh.getRange(2,3,99,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Open','In Progress','Fixed','Closed','Won\'t Fix'],true).setAllowInvalid(false).build());
  sh.getRange(2,4,99,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Auth','Auth Guard','Users','Skills','Mentors','Mentees','Sessions','Matchings','Feedback','Notifications','Admin','Activity Logs','Resources','Availability','General'],true).build());
  sh.getRange(2,15,99,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Local','Staging','Production'],true).build()).setValue('Local');

  // Filters
  sh.getRange(1,1,100,h.length).createFilter();
}

// ─── 130 TEST CASES ─────────────────────────────────────
function getData() {
  const t=new Date().toISOString().split('T')[0];
  return [
    ['TC-001','','Auth','Registration','Positive','High','Register admin','User not exist','POST /api/auth/register','{"email":"admin@test.com","password":"Pass123!","firstName":"A","lastName":"U","role":"admin"}','201 → {user,accessToken}','','','',t,'Local',''],
    ['TC-002','','Auth','Registration','Positive','High','Register mentor','User not exist','POST /api/auth/register with role=mentor','{"email":"m@t.com","password":"Pass123!","firstName":"M","lastName":"U","role":"mentor"}','201, role=mentor','','','',t,'Local',''],
    ['TC-003','','Auth','Registration','Positive','High','Register mentee','User not exist','POST /api/auth/register with role=mentee','{"email":"e@t.com","password":"Pass123!","firstName":"E","lastName":"U","role":"mentee"}','201, role=mentee','','','',t,'Local',''],
    ['TC-004','','Auth','Registration','Negative','High','Reject duplicate email','TC-001 exists','POST /api/auth/register same email','{"email":"admin@test.com","password":"Pass123!","firstName":"D","lastName":"U","role":"mentee"}','400 duplicate email','','','',t,'Local',''],
    ['TC-005','','Auth','Registration','Negative','High','Reject missing fields','None','POST /api/auth/register only email','{"email":"x@t.com"}','400 validation error','','','',t,'Local',''],
    ['TC-006','','Auth','Registration','Negative','High','Reject weak password','None','POST /api/auth/register password<6','{"email":"w@t.com","password":"123","firstName":"W","lastName":"P","role":"mentee"}','400 password too short','','','',t,'Local',''],
    ['TC-007','','Auth','Registration','Negative','Medium','Reject invalid email','None','POST /api/auth/register bad email','{"email":"bad","password":"Pass123!","firstName":"B","lastName":"E","role":"mentee"}','400 invalid email','','','',t,'Local',''],
    ['TC-008','','Auth','Registration','Negative','Medium','Reject invalid role','None','POST /api/auth/register bad role','{"email":"b@t.com","password":"Pass123!","firstName":"B","lastName":"R","role":"superadmin"}','400 invalid enum','','','',t,'Local',''],
    ['TC-009','','Auth','Login','Positive','High','Login valid','TC-001 exists','POST /api/auth/login','{"email":"admin@test.com","password":"Pass123!"}','201 → {user,accessToken}','','','',t,'Local',''],
    ['TC-010','','Auth','Login','Negative','High','Reject wrong password','TC-001 exists','POST /api/auth/login wrong pw','{"email":"admin@test.com","password":"Wrong!"}','401 Unauthorized','','','',t,'Local',''],
    ['TC-011','','Auth','Login','Negative','High','Reject non-existent email','None','POST /api/auth/login bad email','{"email":"x@t.com","password":"Pass123!"}','401 Unauthorized','','','',t,'Local',''],
    ['TC-012','','Auth','Login','Negative','Medium','Reject missing fields','None','POST /api/auth/login email only','{"email":"admin@test.com"}','400 missing password','','','',t,'Local',''],
    ['TC-013','','Auth','Password Reset','Positive','High','Forgot password','TC-001 exists','POST /api/auth/forgot-password','{"email":"admin@test.com"}','201 → {resetToken}','','','',t,'Local',''],
    ['TC-014','','Auth','Password Reset','Negative','Medium','Reject forgot pw bad email','None','POST /api/auth/forgot-password bad email','{"email":"x@t.com"}','400 email not found','','','',t,'Local',''],
    ['TC-015','','Auth','Password Reset','Positive','High','Reset password','Token from TC-013','POST /api/auth/reset-password','{"token":"<token>","password":"New123!"}','201 success','','','',t,'Local',''],
    ['TC-016','','Auth','Password Reset','Positive','High','Login new password','Password reset','POST /api/auth/login new pw','{"email":"admin@test.com","password":"New123!"}','201 success','','','',t,'Local',''],
    ['TC-017','','Auth','Password Reset','Negative','High','Reject invalid token','None','POST /api/auth/reset-password bad token','{"token":"x","password":"New123!"}','400 invalid token','','','',t,'Local',''],
    ['TC-018','','Auth','Password Reset','Negative','Medium','Reject weak pw','Any token','POST /api/auth/reset-password short pw','{"token":"x","password":"123"}','400 too short','','','',t,'Local',''],
    ['TC-019','','Auth','Logout','Positive','Medium','Logout','Valid token','POST /api/auth/logout','Auth: Bearer <token>','201 logout success','','','',t,'Local',''],
    ['TC-020','','Auth','Refresh Token','Positive','Medium','Refresh token','Valid token','POST /api/auth/refresh-token','Auth: Bearer <token>','201 new tokens','','','',t,'Local',''],
    ['TC-021','','Auth Guard','Route Protection','Negative','High','No token','None','GET /api/users/profile no auth','No header','401 no token','','','',t,'Local',''],
    ['TC-022','','Auth Guard','Route Protection','Negative','High','Malformed token','None','GET /api/users/profile Bearer invalid','Auth: Bearer x','401 invalid token','','','',t,'Local',''],
    ['TC-023','','Auth Guard','Route Protection','Negative','Medium','Empty Bearer','None','GET /api/users/profile Bearer empty','Auth: Bearer ','401 unauthorized','','','',t,'Local',''],
    ['TC-024','','Auth Guard','Public Routes','Positive','High','Public route','None','GET /api/skills no auth','No header','200 OK','','','',t,'Local',''],
    ['TC-025','','Auth Guard','Role Guard','Negative','High','Admin route by mentee','Mentee token','GET /api/admin/dashboard','Auth: Bearer <mentee>','403 Forbidden','','','',t,'Local',''],
    ['TC-026','','Auth Guard','Role Guard','Negative','High','Users list by mentor','Mentor token','GET /api/users','Auth: Bearer <mentor>','403 Forbidden','','','',t,'Local',''],
    ['TC-027','','Auth Guard','Role Guard','Negative','High','Approve by mentee','Mentee token','POST /api/mentors/x/approve','Auth: Bearer <mentee>','403 Forbidden','','','',t,'Local',''],
    ['TC-028','','Users','Profile','Positive','High','Get profile','Valid token','GET /api/users/profile','Auth: Bearer <token>','200 → {id,email,role}','','','',t,'Local',''],
    ['TC-029','','Users','Profile','Positive','High','Update profile','Valid token','PUT /api/users/profile','{"userId":"<id>","firstName":"Upd"}','200 OK','','','',t,'Local',''],
    ['TC-030','','Users','Profile','Negative','Medium','Update empty body','Valid token','PUT /api/users/profile only userId','{"userId":"<id>"}','400 no fields','','','',t,'Local',''],
    ['TC-031','','Users','Admin CRUD','Positive','High','Admin list users','Admin token','GET /api/users','Auth: Bearer <admin>','200 array','','','',t,'Local',''],
    ['TC-032','','Users','Admin CRUD','Positive','Medium','Admin get user','Admin token','GET /api/users/:id','Auth: Bearer <admin>','200 user','','','',t,'Local',''],
    ['TC-033','','Users','Admin CRUD','Negative','Medium','404 user','Admin token','GET /api/users/0000...','Auth: Bearer <admin>','404','','','',t,'Local',''],
    ['TC-034','','Users','Security','Negative','High','Update no token','None','PUT /api/users/profile no auth','No header','401','','','',t,'Local',''],
    ['TC-035','','Skills','List','Positive','High','List skills public','None','GET /api/skills no auth','No header','200 array','','','',t,'Local',''],
    ['TC-036','','Skills','Create','Positive','High','Admin create skill','Admin token','POST /api/skills','{"name":"TS","description":"Lang"}','201 → {id,name}','','','',t,'Local',''],
    ['TC-037','','Skills','Create','Negative','High','Reject no name','Admin token','POST /api/skills no name','{"description":"x"}','400 name required','','','',t,'Local',''],
    ['TC-038','','Skills','Create','Negative','High','Reject duplicate name','Skill exists','POST /api/skills same name','{"name":"TS"}','400 duplicate','','','',t,'Local',''],
    ['TC-039','','Skills','Create','Negative','High','Non-admin','Mentee token','POST /api/skills','{"name":"X"}','403','','','',t,'Local',''],
    ['TC-040','','Skills','Get by ID','Positive','Medium','Get skill public','Skill exists','GET /api/skills/:id no auth','No header','200 skill','','','',t,'Local',''],
    ['TC-041','','Skills','Get by ID','Negative','Medium','404 skill','None','GET /api/skills/0000...','No header','404','','','',t,'Local',''],
    ['TC-042','','Skills','Update','Positive','Medium','Admin update skill','Admin token','PUT /api/skills/:id','{"desc":"Updated"}','200 OK','','','',t,'Local',''],
    ['TC-043','','Skills','Update','Negative','High','Non-admin update','Mentee token','PUT /api/skills/:id','{"name":"Hack"}','403','','','',t,'Local',''],
    ['TC-044','','Skills','Delete','Positive','Medium','Admin delete skill','Admin token','DELETE /api/skills/:id','Auth: Bearer <admin>','200 OK','','','',t,'Local',''],
    ['TC-045','','Skills','Get by ID','Negative','Medium','404 deleted skill','Deleted skill','GET /api/skills/:id deleted','No header','404','','','',t,'Local',''],
    ['TC-046','','Skills','Category','Positive','Low','Skills by category','Category exists','GET /api/skills/category/:id','No header','200 array','','','',t,'Local',''],
    ['TC-047','','Skills','Create','Negative','Medium','Unknown fields','Admin token','POST /api/skills unknown field','{"name":"V","hack":"x"}','400 unknown field','','','',t,'Local',''],
    ['TC-048','','Mentors','Create','Positive','High','Create mentor','Admin token','POST /api/mentors','{"userId":"<id>","title":"Dev","nid":"0123456789","phone":"01234567890"}','201 → {id,title}','','','',t,'Local',''],
    ['TC-049','','Mentors','Create','Negative','High','Duplicate NID','Mentor exists','POST /api/mentors same NID','{"userId":"<id>","nid":"0123456789"}','400 duplicate NID','','','',t,'Local',''],
    ['TC-050','','Mentors','List','Positive','High','List mentors','Valid token','GET /api/mentors','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-051','','Mentors','Update','Positive','Medium','Update mentor','Mentor exists','PUT /api/mentors/:id','{"title":"Lead"}','200 OK','','','',t,'Local',''],
    ['TC-052','','Mentors','Update','Negative','Medium','Invalid phone','Mentor exists','PUT /api/mentors/:id invalid phone','{"phone":"abc"}','400 invalid phone','','','',t,'Local',''],
    ['TC-053','','Mentors','Approval','Positive','High','Approve mentor','Admin token','POST /api/mentors/:id/approve','Auth: Bearer <admin>','201 approved','','','',t,'Local',''],
    ['TC-054','','Mentors','Approval','Negative','High','Non-admin approve','Mentee token','POST /api/mentors/:id/approve','Auth: Bearer <mentee>','403','','','',t,'Local',''],
    ['TC-055','','Mentors','Rejection','Positive','High','Reject mentor','Admin token','POST /api/mentors/:id/reject','{"reason":"Not qualified"}','201 rejected','','','',t,'Local',''],
    ['TC-056','','Mentors','Suspend','Positive','High','Suspend mentor','Admin token','POST /api/mentors/:id/suspend','Auth: Bearer <admin>','201 suspended','','','',t,'Local',''],
    ['TC-057','','Mentors','Delete','Positive','Medium','Delete mentor','Admin token','DELETE /api/mentors/:id','Auth: Bearer <admin>','200 OK','','','',t,'Local',''],
    ['TC-058','','Mentors','Approval','Negative','Medium','404 non-existent','Admin token','POST /api/mentors/0000.../approve','Auth: Bearer <admin>','404','','','',t,'Local',''],
    ['TC-059','','Mentees','Create','Positive','High','Create mentee','Valid token','POST /api/mentees','{"userId":"<id>","occupation":"Student","goals":"Learn"}','201 → {id}','','','',t,'Local',''],
    ['TC-060','','Mentees','List','Positive','Medium','List mentees','Valid token','GET /api/mentees','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-061','','Mentees','Get by ID','Positive','Medium','Get mentee','Mentee exists','GET /api/mentees/:id','Auth: Bearer <token>','200 mentee','','','',t,'Local',''],
    ['TC-062','','Mentees','Update','Positive','Medium','Update mentee','Mentee exists','PUT /api/mentees/:id','{"occupation":"Junior"}','200 OK','','','',t,'Local',''],
    ['TC-063','','Mentees','Delete','Negative','High','Non-admin delete','Mentee token','DELETE /api/mentees/:id','Auth: Bearer <mentee>','403','','','',t,'Local',''],
    ['TC-064','','Mentees','Delete','Positive','Medium','Admin delete mentee','Admin token','DELETE /api/mentees/:id','Auth: Bearer <admin>','200 OK','','','',t,'Local',''],
    ['TC-065','','Sessions','Create','Positive','High','Create session','Mentee token','POST /api/sessions','{"mentorId":"<id>","menteeId":"<id>","title":"Career","scheduledAt":"2026-06-15T14:00:00Z","duration":60}','201 → {id,title,status}','','','',t,'Local',''],
    ['TC-066','','Sessions','Create','Negative','High','Past date','Mentee token','POST /api/sessions past date','{"mentorId":"<id>","menteeId":"<id>","title":"Past","scheduledAt":"2020-01-01T00:00:00Z"}','400 past date','','','',t,'Local',''],
    ['TC-067','','Sessions','Create','Negative','High','Missing fields','Mentee token','POST /api/sessions only title','{"title":"Inc"}','400 validation','','','',t,'Local',''],
    ['TC-068','','Sessions','Create','Negative','Medium','Duration > 180','Mentee token','POST /api/sessions duration=200','{"mentorId":"<id>","menteeId":"<id>","title":"Long","scheduledAt":"2026-06-15T14:00:00Z","duration":200}','400 max 180','','','',t,'Local',''],
    ['TC-069','','Sessions','Create','Negative','Medium','Duration < 15','Mentee token','POST /api/sessions duration=5','{"mentorId":"<id>","menteeId":"<id>","title":"Short","scheduledAt":"2026-06-15T14:00:00Z","duration":5}','400 min 15','','','',t,'Local',''],
    ['TC-070','','Sessions','List','Positive','High','List sessions','Valid token','GET /api/sessions','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-071','','Sessions','Get by ID','Positive','Medium','Get session','Session exists','GET /api/sessions/:id','Auth: Bearer <token>','200 session','','','',t,'Local',''],
    ['TC-072','','Sessions','Update','Positive','Medium','Update session','Session exists','PUT /api/sessions/:id','{"title":"Updated"}','200 OK','','','',t,'Local',''],
    ['TC-073','','Sessions','Accept','Negative','High','Non-mentor accept','Mentee token','POST /api/sessions/:id/accept','Auth: Bearer <mentee>','403','','','',t,'Local',''],
    ['TC-074','','Sessions','Accept','Positive','High','Mentor accept','Mentor token','POST /api/sessions/:id/accept','Auth: Bearer <mentor>','201 accepted','','','',t,'Local',''],
    ['TC-075','','Sessions','Decline','Negative','High','Non-mentor decline','Mentee token','POST /api/sessions/:id/decline','Auth: Bearer <mentee>','403','','','',t,'Local',''],
    ['TC-076','','Sessions','Complete','Positive','High','Complete session','Valid token','POST /api/sessions/:id/complete','Auth: Bearer <token>','201 completed','','','',t,'Local',''],
    ['TC-077','','Sessions','Cancel','Positive','Medium','Cancel session','Valid token','POST /api/sessions/:id/cancel','Auth: Bearer <token>','201 cancelled','','','',t,'Local',''],
    ['TC-078','','Sessions','No-Show','Positive','Medium','No-show session','Valid token','POST /api/sessions/:id/no-show','Auth: Bearer <token>','201 no-show','','','',t,'Local',''],
    ['TC-079','','Sessions','Cancel','Negative','Medium','404 cancel','Valid token','POST /api/sessions/0000.../cancel','Auth: Bearer <token>','404','','','',t,'Local',''],
    ['TC-080','','Sessions','Delete','Positive','Low','Delete session','Valid token','DELETE /api/sessions/:id','Auth: Bearer <token>','200 OK','','','',t,'Local',''],
    ['TC-081','','Matchings','Create','Positive','High','Admin create matching','Admin token','POST /api/matchings','{"mentorId":"<id>","menteeId":"<id>","reason":"Good"}','201 → {id}','','','',t,'Local',''],
    ['TC-082','','Matchings','Create','Negative','High','Non-admin','Mentee token','POST /api/matchings','{"mentorId":"<id>","menteeId":"<id>"}','403','','','',t,'Local',''],
    ['TC-083','','Matchings','List','Positive','Medium','List matchings','Valid token','GET /api/matchings','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-084','','Matchings','Get by ID','Positive','Low','Get matching','Matching exists','GET /api/matchings/:id','Auth: Bearer <token>','200 matching','','','',t,'Local',''],
    ['TC-085','','Matchings','Update','Positive','Medium','Update matching','Matching exists','PUT /api/matchings/:id','{"status":"accepted"}','200 OK','','','',t,'Local',''],
    ['TC-086','','Matchings','Delete','Positive','Medium','Admin delete','Admin token','DELETE /api/matchings/:id','Auth: Bearer <admin>','200 OK','','','',t,'Local',''],
    ['TC-087','','Feedback','Create','Positive','High','Submit feedback','Mentee token','POST /api/feedback','{"mentorId":"<id>","menteeId":"<id>","rating":5,"comment":"Great!"}','201 → {id,rating}','','','',t,'Local',''],
    ['TC-088','','Feedback','Create','Negative','High','Rating > 5','Mentee token','POST /api/feedback rating 10','{"mentorId":"<id>","menteeId":"<id>","rating":10}','400 max 5','','','',t,'Local',''],
    ['TC-089','','Feedback','Create','Negative','Medium','Rating < 1','Mentee token','POST /api/feedback rating 0','{"mentorId":"<id>","menteeId":"<id>","rating":0}','400 min 1','','','',t,'Local',''],
    ['TC-090','','Feedback','Create','Negative','High','Missing rating','Mentee token','POST /api/feedback no rating','{"mentorId":"<id>","menteeId":"<id>"}','400 rating required','','','',t,'Local',''],
    ['TC-091','','Feedback','List','Positive','Medium','List feedback','Valid token','GET /api/feedback','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-092','','Feedback','Get by ID','Positive','Low','Get feedback','Feedback exists','GET /api/feedback/:id','Auth: Bearer <token>','200 feedback','','','',t,'Local',''],
    ['TC-093','','Feedback','Get by Mentor','Positive','Medium','Feedback by mentor','Mentor exists','GET /api/feedback/mentor/:id','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-094','','Feedback','Update','Positive','Medium','Update feedback','Feedback exists','PUT /api/feedback/:id','{"rating":4,"comment":"Upd"}','200 OK','','','',t,'Local',''],
    ['TC-095','','Feedback','Delete','Positive','Medium','Delete feedback','Feedback exists','DELETE /api/feedback/:id','Auth: Bearer <token>','200 OK','','','',t,'Local',''],
    ['TC-096','','Notifications','Create','Positive','High','Admin create notif','Admin token','POST /api/notifications','{"userId":"<id>","title":"Test","message":"Hi","type":"in_app"}','201 → {id}','','','',t,'Local',''],
    ['TC-097','','Notifications','Create','Negative','High','Non-admin','Mentee token','POST /api/notifications','{"userId":"<id>","title":"X","message":"X"}','403','','','',t,'Local',''],
    ['TC-098','','Notifications','List','Positive','Medium','List notifs','Valid token','GET /api/notifications','Auth: Bearer <token>','200 array','','','',t,'Local',''],
    ['TC-099','','Notifications','Get by ID','Positive','Low','Get notif','Notif exists','GET /api/notifications/:id','Auth: Bearer <token>','200 notif','','','',t,'Local',''],
    ['TC-100','','Notifications','Unread','Positive','Medium','Unread count','Valid token','GET /api/notifications/unread','Auth: Bearer <token>','200 count','','','',t,'Local',''],
    ['TC-101','','Notifications','Mark Read','Positive','Medium','Mark read','Notif exists','PUT /api/notifications/:id/read','Auth: Bearer <token>','200 OK','','','',t,'Local',''],
    ['TC-102','','Notifications','Delete','Positive','Medium','Delete notif','Notif exists','DELETE /api/notifications/:id','Auth: Bearer <token>','200 OK','','','',t,'Local',''],
    ['TC-103','','Notifications','Delete','Negative','Medium','404 notif','Valid token','DELETE /api/notifications/0000...','Auth: Bearer <token>','404','','','',t,'Local',''],
    ['TC-104','','Admin','Dashboard','Positive','High','Dashboard stats','Admin token','GET /api/admin/dashboard','Auth: Bearer <admin>','200 stats','','','',t,'Local',''],
    ['TC-105','','Admin','Users','Positive','High','List users','Admin token','GET /api/admin/users','Auth: Bearer <admin>','200 array','','','',t,'Local',''],
    ['TC-106','','Admin','Mentors','Positive','Medium','List mentors','Admin token','GET /api/admin/mentors','Auth: Bearer <admin>','200 array','','','',t,'Local',''],
    ['TC-107','','Admin','Mentees','Positive','Medium','List mentees','Admin token','GET /api/admin/mentees','Auth: Bearer <admin>','200 array','','','',t,'Local',''],
    ['TC-108','','Admin','User Mgmt','Positive','High','Deactivate user','Admin token','POST /api/admin/users/:id/deactivate','Auth: Bearer <admin>','201 OK','','','',t,'Local',''],
    ['TC-109','','Admin','User Mgmt','Negative','Medium','404 deactivate','Admin token','POST /api/admin/users/0000.../deactivate','Auth: Bearer <admin>','404','','','',t,'Local',''],
    ['TC-110','','Admin','User Mgmt','Positive','High','Reset password','Admin token','POST /api/admin/users/:id/reset-password','{"password":"New123!"}','201 OK','','','',t,'Local',''],
    ['TC-111','','Admin','Feedback','Positive','Medium','Moderate feedback','Admin token','DELETE /api/admin/feedback/:id','Auth: Bearer <admin>','200 OK','','','',t,'Local',''],
    ['TC-112','','Admin','User Mgmt','Positive','High','Delete user','Admin token','DELETE /api/admin/users/:id','Auth: Bearer <admin>','200 OK','','','',t,'Local',''],
    ['TC-113','','Admin','User Mgmt','Negative','Medium','404 delete user','Admin token','DELETE /api/admin/users/0000...','Auth: Bearer <admin>','404','','','',t,'Local',''],
    ['TC-114','','Activity Logs','List','Positive','Medium','List logs','Admin token','GET /api/activity-logs','Auth: Bearer <admin>','200 array','','','',t,'Local',''],
    ['TC-115','','Activity Logs','Get by ID','Positive','Low','Get log','Admin token','GET /api/activity-logs/:id','Auth: Bearer <admin>','200 log','','','',t,'Local',''],
    ['TC-116','','Activity Logs','Create','Positive','Low','Create log','Admin token','POST /api/activity-logs','{"action":"create","entity":"test","entityId":"0000...","description":"QA"}','201 OK','','','',t,'Local',''],
    ['TC-117','','Activity Logs','Security','Negative','High','Non-admin','Mentee token','GET /api/activity-logs','Auth: Bearer <mentee>','403','','','',t,'Local',''],
    ['TC-118','','Resources','Create','Positive','High','Mentor creates','Mentor token','POST /api/resources','{"mentorId":"<id>","title":"Guide","type":"document","fileUrl":"https://x.pdf"}','201 → {id,title}','','','',t,'Local',''],
    ['TC-119','','Resources','Create','Negative','High','Non-mentor','Mentee token','POST /api/resources','{"mentorId":"<id>","title":"X","type":"document"}','403','','','',t,'Local',''],
    ['TC-120','','Resources','Create','Negative','Medium','No title','Mentor token','POST /api/resources only mentorId','{"mentorId":"<id>"}','400 title required','','','',t,'Local',''],
    ['TC-121','','Resources','List','Positive','Medium','Get resources public','None','GET /api/resources/:mentorId no auth','No header','200 array','','','',t,'Local',''],
    ['TC-122','','Resources','Delete','Positive','Medium','Mentor deletes','Mentor token','DELETE /api/resources/:id','Auth: Bearer <mentor>','200 OK','','','',t,'Local',''],
    ['TC-123','','Resources','Delete','Negative','Medium','404 resource','Mentor token','DELETE /api/resources/0000...','Auth: Bearer <mentor>','404','','','',t,'Local',''],
    ['TC-124','','Availability','Get','Positive','Medium','Get availability','None','GET /api/availabilities/:mentorId no auth','No header','200 OK','','','',t,'Local',''],
    ['TC-125','','Availability','Slots','Positive','Medium','Get slots','None','GET /api/availabilities/:mentorId/slots?date=2026-06-15','No header','200 array','','','',t,'Local',''],
    ['TC-126','','Availability','Create','Positive','High','Set availability','Mentor token','POST /api/availabilities','{"mentorId":"<id>","date":"2026-06-15","startTime":"09:00","endTime":"17:00"}','201 OK','','','',t,'Local',''],
    ['TC-127','','Availability','Create','Negative','High','Non-mentor','Mentee token','POST /api/availabilities','{"mentorId":"<id>","date":"2026-06-15","startTime":"09:00","endTime":"17:00"}','403','','','',t,'Local',''],
    ['TC-128','','Availability','Update','Positive','Medium','Update avail','Mentor token','PUT /api/availabilities/:id','{"startTime":"10:00","endTime":"16:00"}','200 OK','','','',t,'Local',''],
    ['TC-129','','Availability','Delete','Positive','Medium','Delete avail','Mentor token','DELETE /api/availabilities/:id','Auth: Bearer <mentor>','200 OK','','','',t,'Local',''],
    ['TC-130','','Availability','Block','Positive','Low','Block date','Mentor token','POST /api/availabilities/block','{"mentorId":"<id>","date":"2026-06-20","startTime":"00:00","endTime":"23:59"}','201 OK','','','',t,'Local',''],
  ];
}
