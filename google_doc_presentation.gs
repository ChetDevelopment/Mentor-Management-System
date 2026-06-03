// ====================================================================
// Google Doc — Presentation for Teacher (SIMPLE VERSION)
// Google Drive → New → Google Doc → Extensions → Apps Script
// Paste ALL → Run "createDoc"
// ====================================================================

function createDoc() {
  var doc = DocumentApp.create("Mentor System - Key Features");
  var body = doc.getBody();
  body.setMarginLeft(60).setMarginRight(60);

  var blue = "#1565c0";
  var orange = "#e65100";
  var green = "#2e7d32";
  var dark = "#1a237e";

  // TITLE
  body.appendParagraph("").setFontSize(8);
  var t = body.appendParagraph("Mentor Management System");
  t.setFontSize(26).setBold(true).setForegroundColor(dark).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("What makes this project special (not just CRUD)").setFontSize(14).setForegroundColor("#666666").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("").setFontSize(10);
  body.appendParagraph("Most student projects = Create, Read, Update, Delete only").setFontSize(11).setForegroundColor("#999999").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("This project = CRUD + 8 advanced features").setFontSize(12).setBold(true).setForegroundColor(green).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendPageBreak();

  // ===== OVERVIEW TABLE =====
  addTitle(body, "QUICK OVERVIEW");
  body.appendParagraph("");

  var overview = [
    ["Feature", "What it does", "Why it's not CRUD"],
    ["1. Login System", "Users login with email + password, get a secure token", "JWT tokens, password hashing, session tracking, logout blacklist"],
    ["2. 3 User Roles", "Admin, Mentor, Mentee — each sees different things", "Role-based access control with @Roles() guards"],
    ["3. Mentor Approval", "Mentors must be approved by admin before they can work", "State machine: Pending → Approved / Rejected / Suspended"],
    ["4. Session Booking", "Mentee books → Mentor accepts → Session happens → Done", "6-step lifecycle, not just create/delete"],
    ["5. Smart Matching", "System suggests mentors based on skills matching mentee interests", "Matching algorithm, not just a list"],
    ["6. Messaging", "Users can chat with each other inside the system", "Real conversations with read/unread tracking"],
    ["7. Availability", "Mentors set their weekly schedule + block vacation days", "Time slot calculation, conflict detection"],
    ["8. Notifications", "Admin sends alerts to users, users mark as read", "Multi-type notification engine with read tracking"],
  ];

  overview.forEach(function(row, i) {
    var p = body.appendParagraph("");
    p.setFontSize(10);
    if (i === 0) {
      p.appendText(row[0] + "   " + row[1] + "   " + row[2]).setBold(true);
      p.setBackgroundColor(dark).setForegroundColor("#ffffff");
    } else {
      p.appendText(row[0] + "   " + row[1] + "   " + row[2]);
      if (i % 2 === 0) p.setBackgroundColor("#f5f5f5");
    }
  });
  body.appendPageBreak();

  // ===== FEATURE 1: LOGIN SYSTEM =====
  addTitle(body, "FEATURE 1: Login & Security System");
  body.appendParagraph("");

  var box1 = "WHAT HAPPENS WHEN USER LOGS IN:\n" +
    "\n" +
    "  1. User sends email + password\n" +
    "  2. Password is checked against stored hash (bcrypt, 10 rounds)\n" +
    "  3. If wrong password → count failed attempt\n" +
    "  4. If 5 failed attempts → Account locked for 15 minutes\n" +
    "  5. If correct → Generate JWT token (15 min) + Refresh token (7 days)\n" +
    "  6. Store session info: device, IP address, browser\n" +
    "  7. User can logout → Token goes to blacklist (cannot reuse)\n" +
    "  8. User can refresh token to stay logged in\n" +
    "\n" +
    "SECURITY FEATURES:\n" +
    "  ✓ Password minimum 12 characters\n" +
    "  ✓ Forgot password via email token\n" +
    "  ✓ Email verification required\n" +
    "  ✓ 20 requests/minute limit on login\n" +
    "  ✓ Old tokens invalidated on logout\n" +
    "\n" +
    "WHY NOT JUST CRUD: This is a full authentication system with\n" +
    "password hashing, token management, session tracking, rate limiting,\n" +
    "account lockout, and password reset flow. Not just 'create user'.";
  addCodeBlock(body, box1);
  body.appendPageBreak();

  // ===== FEATURE 2: ROLES =====
  addTitle(body, "FEATURE 2: Three User Roles with Different Powers");
  body.appendParagraph("");

  var box2 = "THREE ROLES, THREE DIFFERENT EXPERIENCES:\n" +
    "\n" +
    "  ADMIN:  Can do everything\n" +
    "          • See dashboard with all stats\n" +
    "          • Approve/reject/suspend mentors\n" +
    "          • Manage all users\n" +
    "          • Create notifications for anyone\n" +
    "          • Delete inappropriate feedback\n" +
    "          • View all activity logs\n" +
    "\n" +
    "  MENTOR: Can manage their work\n" +
    "          • Set weekly availability schedule\n" +
    "          • Upload learning resources\n" +
    "          • Accept or decline session requests\n" +
    "          • Message with mentees\n" +
    "          • Respond to feedback\n" +
    "\n" +
    "  MENTEE: Can learn from mentors\n" +
    "          • Book sessions with mentors\n" +
    "          • Get mentor recommendations\n" +
    "          • Submit feedback after sessions\n" +
    "          • Message with mentors\n" +
    "\n" +
    "HOW IT WORKS IN CODE:\n" +
    "  @Roles(UserRole.ADMIN)  → Only admin can access this endpoint\n" +
    "  @Roles(UserRole.MENTOR) → Only mentor can access\n" +
    "  @Public()               → Anyone can access (no token needed)\n" +
    "\n" +
    "Every endpoint automatically checks: Who are you? What role? Allowed?\n" +
    "If not allowed → 403 Forbidden (automatic, no extra code needed)";
  addCodeBlock(body, box2);
  body.appendPageBreak();

  // ===== FEATURE 3: MENTOR APPROVAL =====
  addTitle(body, "FEATURE 3: Mentor Approval Workflow");
  body.appendParagraph("");

  var box3 = "PROBLEM: In real life, not everyone who signs up as a mentor\n" +
    "should be a mentor. The admin must check their profile first.\n" +
    "\n" +
    "HOW IT WORKS:\n" +
    "\n" +
    "   Person registers as mentor\n" +
    "        │\n" +
    "        ▼\n" +
    "   [PENDING]  ← waiting for admin review\n" +
    "        │\n" +
    "   ┌────┴────┐\n" +
    "   │         │\n" +
    "   ▼         ▼\n" +
    "[APPROVED]  [REJECTED]\n" +
    "   │         (store reason why)\n" +
    "   │\n" +
    "   ▼\n" +
    "[Can now accept sessions and mentor students]\n" +
    "   │\n" +
    "   ▼\n" +
    "[SUSPENDED]  ← admin can suspend if mentor misbehaves\n" +
    "\n" +
    "CODE BEHIND IT:\n" +
    "  POST /mentors/:id/approve  → Pending → Approved\n" +
    "  POST /mentors/:id/reject   → Pending → Rejected (with reason)\n" +
    "  POST /mentors/:id/suspend  → Approved → Suspended\n" +
    "\n" +
    "WHY NOT JUST CRUD: This is a STATE MACHINE. A mentor goes through\n" +
    "multiple states with rules about which transitions are allowed.\n" +
    "You cannot just 'update' a mentor — you trigger a specific action.";
  addCodeBlock(body, box3);
  body.appendPageBreak();

  // ===== FEATURE 4: SESSION LIFECYCLE =====
  addTitle(body, "FEATURE 4: Session Booking Lifecycle");
  body.appendParagraph("");

  var box4 = "PROBLEM: A mentoring session is NOT just 'create a record'.\n" +
    "It goes through many stages before and after it happens.\n" +
    "\n" +
    "THE 6 STAGES OF A SESSION:\n" +
    "\n" +
    "  Stage 1: PENDING\n" +
    "    Mentee books a session → status = 'pending'\n" +
    "    Mentor is notified\n" +
    "\n" +
    "  Stage 2a: CONFIRMED (mentor accepts)\n" +
    "    Mentor clicks 'Accept' → status changes to 'confirmed'\n" +
    "    Meeting link is sent to both\n" +
    "\n" +
    "  Stage 2b: DECLINED (mentor declines)\n" +
    "    Mentor says no → Mentee must find another mentor\n" +
    "\n" +
    "  Stage 3: COMPLETED\n" +
    "    Session happened successfully\n" +
    "    Mentee can now submit feedback\n" +
    "    Mentor's totalSessions counter increases\n" +
    "\n" +
    "  Stage 4: CANCELLED\n" +
    "    Either person cancels before it happens\n" +
    "\n" +
    "  Stage 5: NO_SHOW\n" +
    "    Someone didn't show up — tracked for accountability\n" +
    "\n" +
    "ADDITIONAL RULES:\n" +
    "  • Session must be 15-180 minutes (validated)\n" +
    "  • Cannot book past dates\n" +
    "  • Cannot accept your own session\n" +
    "  • Only mentor can accept/decline\n" +
    "  • Meeting link auto-generated\n" +
    "\n" +
    "WHY NOT JUST CRUD: This is a WORKFLOW with 6 states and strict\n" +
    "rules about who can do what at each stage.";
  addCodeBlock(body, box4);
  body.appendPageBreak();

  // ===== FEATURE 5: MATCHING =====
  addTitle(body, "FEATURE 5: Smart Mentor-Mentee Matching");
  body.appendParagraph("");

  var box5 = "PROBLEM: A mentee wants to find a mentor who knows TypeScript.\n" +
    "There are 50 mentors — how to find the right one?\n" +
    "\n" +
    "HOW IT WORKS:\n" +
    "\n" +
    "  Step 1: Mentors list their skills\n" +
    "    Mentor Sophea: TypeScript, NestJS, Database Design\n" +
    "    Mentor Dara:    Data Analysis, Machine Learning\n" +
    "    Mentor Sreynich: Product Management, UX Research\n" +
    "\n" +
    "  Step 2: Mentees list their interests\n" +
    "    Mentee Nita: TypeScript, NestJS, Technical Interviewing\n" +
    "\n" +
    "  Step 3: System compares\n" +
    "    Nita's interests ∩ Mentor skills → Find best match\n" +
    "    Nita → Sophea: 2 matches (TypeScript + NestJS) ✓✓\n" +
    "    Nita → Dara: 0 matches ✗\n" +
    "    Nita → Sreynich: 0 matches ✗\n" +
    "\n" +
    "  Step 4: System recommends Sophea to Nita!\n" +
    "\n" +
    "  Admin can also manually create a match:\n" +
    "  POST /matchings { mentorId, menteeId, reason: 'Good skill match' }\n" +
    "\n" +
    "DATA STRUCTURE:\n" +
    "  Mentors ←→ mentor_skills ←→ Skills\n" +
    "  (Many-to-Many: one mentor has many skills, one skill has many mentors)\n" +
    "\n" +
    "WHY NOT JUST CRUD: This involves a JOIN table, matching algorithm,\n" +
    "and recommendation logic. Not just 'list mentors'.";
  addCodeBlock(body, box5);
  body.appendPageBreak();

  // ===== FEATURE 6: MESSAGING =====
  addTitle(body, "FEATURE 6: Real Messaging Between Users");
  body.appendParagraph("");

  var box6 = "PROBLEM: Mentors and mentees need to communicate.\n" +
    "They shouldn't need to use email or WhatsApp — it should\n" +
    "all happen inside the system.\n" +
    "\n" +
    "WHAT IT DOES:\n" +
    "\n" +
    "  • Any user can send a message to any other user\n" +
    "  • Messages show as conversation threads (like WhatsApp)\n" +
    "  • Each message tracks: sender, receiver, content, time\n" +
    "  • Read/unread status per message (blue ticks!)\n" +
    "  • Mark single message as read\n" +
    "  • Get all your conversations list\n" +
    "  • Get full chat history between you and another person\n" +
    "\n" +
    "EXAMPLE:\n" +
    "  Mentee Nita sends → \"Hi! I want to learn TypeScript\"\n" +
    "  Mentor Sophea reads it → message marked as read\n" +
    "  Mentor Sophea replies → \"Sure! When are you free?\"\n" +
    "  Both can see the full conversation thread\n" +
    "\n" +
    "ENDPOINTS:\n" +
    "  POST /messages          → Send message\n" +
    "  GET  /messages/conversations → All your chats\n" +
    "  GET  /messages/:a/:b    → Chat history with one person\n" +
    "  PUT  /messages/:id/read → Mark as read\n" +
    "\n" +
    "WHY NOT JUST CRUD: This is a messaging system with conversation\n" +
    "threading, read tracking, and bidirectional communication.";
  addCodeBlock(body, box6);
  body.appendPageBreak();

  // ===== FEATURE 7: AVAILABILITY =====
  addTitle(body, "FEATURE 7: Mentor Availability & Scheduling");
  body.appendParagraph("");

  var box7 = "PROBLEM: A mentee wants to book a session with Sophea on\n" +
    "July 15th at 2PM. Is Sophea free? The system must know.\n" +
    "\n" +
    "HOW IT WORKS:\n" +
    "\n" +
    "  Step 1: Mentor sets weekly schedule\n" +
    "    \"I work Monday 9AM-5PM, Wednesday 2PM-4PM, Friday 10AM-12PM\"\n" +
    "    POST /availabilities { dayOfWeek: 'Mon', start: '09:00', end: '17:00' }\n" +
    "\n" +
    "  Step 2: Mentor can block specific days\n" +
    "    \"I'm on vacation December 25th\"\n" +
    "    POST /availabilities/block { blockedDate: '2026-12-25', reason: 'Vacation' }\n" +
    "\n" +
    "  Step 3: Mentee checks available slots\n" +
    "    \"When is Sophea free on July 15th?\"\n" +
    "    GET /availabilities/:mentorId/slots?date=2026-07-15\n" +
    "    → [ \"09:00-10:00\", \"10:00-11:00\", \"11:00-12:00\", ... ]\n" +
    "\n" +
    "  Step 4: System checks 3 things:\n" +
    "    1. Is this day in the weekly schedule?\n" +
    "    2. Is this day blocked?\n" +
    "    3. Are there already sessions booked at that time?\n" +
    "    → Returns only the truly free time slots\n" +
    "\n" +
    "WHY NOT JUST CRUD: This is a scheduling system with recurring\n" +
    "weekly patterns, exception dates, and conflict detection.\n" +
    "It calculates availability, not just stores data.";
  addCodeBlock(body, box7);
  body.appendPageBreak();

  // ===== FEATURE 8: NOTIFICATIONS =====
  addTitle(body, "FEATURE 8: Notification System");
  body.appendParagraph("");

  var box8 = "PROBLEM: Admin needs to send announcements to users.\n" +
    "Users need to know when they have new messages or sessions.\n" +
    "\n" +
    "WHAT IT DOES:\n" +
    "\n" +
    "  • Admin creates notification → goes to specific user\n" +
    "  • 4 types: email, SMS, push notification, in-app\n" +
    "  • User sees unread count (red badge)\n" +
    "  • User can mark one notification as read\n" +
    "  • User can mark ALL notifications as read\n" +
    "  • Optional link (actionUrl) to take user to relevant page\n" +
    "  • Optional extra data (metadata) for flexibility\n" +
    "\n" +
    "EXAMPLE:\n" +
    "  Admin creates: \"Your mentor application was approved!\"\n" +
    "  → Shows in user's notification list as unread\n" +
    "  → User clicks it → marked as read with timestamp\n" +
    "\n" +
    "ENDPOINTS:\n" +
    "  POST /notifications              → Create (admin only)\n" +
    "  GET  /notifications              → Get my notifications\n" +
    "  GET  /notifications/unread       → How many unread?\n" +
    "  PUT  /notifications/:id/read     → Mark one as read\n" +
    "  PUT  /notifications/read-all     → Mark all as read\n" +
    "\n" +
    "WHY NOT JUST CRUD: This is a notification engine with\n" +
    "read/unread state tracking, bulk operations, and type-based\n" +
    "delivery (email/sms/push/in_app).";
  addCodeBlock(body, box8);
  body.appendPageBreak();

  // ===== FINAL SUMMARY =====
  addTitle(body, "SUMMARY: WHY THIS IS NOT JUST CRUD");
  body.appendParagraph("");

  var summary = [
    ["Feature", "CRUD or Not?", "What makes it special"],
    ["Login/Auth", "NOT CRUD", "JWT, password hashing, token blacklist, account lockout, session tracking"],
    ["User Roles", "NOT CRUD", "3 roles with different permissions, automatic guard system"],
    ["Mentor Approval", "NOT CRUD", "State machine: Pending→Approved→Rejected→Suspended"],
    ["Session Booking", "NOT CRUD", "6-stage lifecycle with role-based transitions"],
    ["Smart Matching", "NOT CRUD", "Algorithm comparing skills vs interests, many-to-many join"],
    ["Messaging", "NOT CRUD", "Real conversations with threading and read tracking"],
    ["Availability", "NOT CRUD", "Weekly schedule + date blocking + slot calculation"],
    ["Notifications", "NOT CRUD", "Engine with read tracking, bulk ops, multi-type delivery"],
    ["Skills", "CRUD", "Simple create/read/update/delete of skills"],
    ["Categories", "CRUD", "Simple grouping of skills"],
    ["Resources", "CRUD + Guard", "Only mentors can upload, but simple file storage"],
    ["Feedback", "CRUD + Logic", "Create/read with auto rating calculation for mentors"],
    ["Admin Dashboard", "NOT CRUD", "Aggregates statistics from multiple tables"],
  ];

  summary.forEach(function(row, i) {
    var p = body.appendParagraph("");
    p.setFontSize(10);
    if (i === 0) {
      p.appendText(row[0] + "   " + row[1] + "   " + row[2]).setBold(true);
      p.setBackgroundColor(dark).setForegroundColor("#ffffff");
    } else {
      p.appendText(row[0] + "   " + row[1] + "   " + row[2]);
      var color = row[1] === "NOT CRUD" ? orange : green;
      var idx = row[0].length + 3;
      p.editAsText().setForegroundColor(idx, idx + row[1].length, color).setBold(idx, idx + row[1].length, true);
      if (i % 2 === 0) p.setBackgroundColor("#f5f5f5");
    }
  });

  body.appendParagraph("");
  body.appendParagraph("");

  var final = body.appendParagraph("Result: 8 advanced features + 5 CRUD modules = NOT a simple CRUD project");
  final.setFontSize(13).setBold(true).setForegroundColor(blue).setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  body.appendParagraph("");
  body.appendParagraph("Tech Stack: NestJS + TypeORM + MySQL + JWT + TypeScript").setFontSize(10).setForegroundColor("#999999").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("101 API Endpoints | 16 Modules | 117 Test Cases | 94.9% Pass Rate").setFontSize(10).setForegroundColor("#999999").setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  doc.saveAndClose();
  Logger.log("Done! " + doc.getUrl());
}

function addTitle(body, text) {
  body.appendParagraph(text).setFontSize(16).setBold(true).setForegroundColor("#1a237e").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
}

function addCodeBlock(body, text) {
  body.appendParagraph(text).setFontSize(8).setFontFamily("Courier New").setBackgroundColor("#f5f5f5");
}
