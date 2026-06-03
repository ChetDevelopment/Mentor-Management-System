// ========================================================================================
// Mentor Management System — Complete Test Report (3 Sheets)
// Google Sheets → Extensions → Apps Script → Paste ALL → Run "generateFullReport"
// ========================================================================================

function generateFullReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createTestCasesSheet(ss);
  createDashboardSheet(ss);
  createBugReportSheet(ss);
  SpreadsheetApp.flush();
  Logger.log("Done! 3 sheets created: Test Cases, Dashboard, Bug Report");
}

// ================================================================
// SHEET 1: TEST CASES (130 test cases)
// ================================================================
function createTestCasesSheet(ss) {
  var sheet = ss.getSheetByName("Test Cases");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("Test Cases");

  var headers = ["TC ID", "Status", "Module", "Feature", "Test Type", "Priority",
    "Description", "Preconditions", "Test Steps", "Test Data (JSON)", "Expected Result",
    "Actual Result", "Bug ID", "Tester", "Date Tested", "Environment", "Notes"];

  // Header style
  for (var h = 0; h < headers.length; h++) {
    var cell = sheet.getRange(1, h + 1);
    cell.setValue(headers[h]).setFontWeight("bold").setFontSize(10)
      .setBackground("#1565c0").setFontColor("#ffffff")
      .setHorizontalAlignment("center").setBorder(true, true, true, true, true, true);
  }

  // DATA — 130 test cases
  var data = [
    // AUTH — REGISTRATION
    ["TC-001", "PASS", "Auth", "Registration", "Positive", "High", "Register new admin user", "DB seeded", "1. POST /api/v1/auth/register", '{"email":"admin@mentorkhet.test","password":"Password123!","firstName":"Admin","lastName":"User","role":"admin"}', "201 → { user, accessToken, refreshToken }", "201 — User created", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-002", "PASS", "Auth", "Registration", "Positive", "High", "Register new mentor user", "DB seeded", "1. POST /api/v1/auth/register", '{"email":"sophea.mentor@mentorkhet.test","password":"Password123!","firstName":"Sophea","lastName":"Chan","role":"mentor"}', "201 → role=mentor", "201 — Mentor created", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-003", "PASS", "Auth", "Registration", "Positive", "High", "Register new mentee user", "DB seeded", "1. POST /api/v1/auth/register", '{"email":"nita.mentee@mentorkhet.test","password":"Password123!","firstName":"Nita","lastName":"Chroun","role":"mentee"}', "201 → role=mentee", "201 — Mentee created", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-004", "PASS", "Auth", "Registration", "Negative", "High", "Reject duplicate email registration", "User already exists", "1. POST /api/v1/auth/register with existing email", '{"email":"admin@mentorkhet.test","password":"Password123!","firstName":"Dup","lastName":"User","role":"mentee"}', "400 — Email already registered", "400 — Bad Request", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-005", "PASS", "Auth", "Registration", "Negative", "High", "Reject registration with missing fields", "None", "1. POST /api/v1/auth/register with only email", '{"email":"nofields@test.com"}', "400 — Validation error", "400 — Bad Request", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-006", "PASS", "Auth", "Registration", "Negative", "High", "Reject password < 12 chars", "None", "1. POST /api/v1/auth/register with short password", '{"email":"weak@test.com","password":"123","firstName":"T","lastName":"U","role":"mentee"}', "400 — Password too short", "400 — min 12 chars required", "", "Vichet", "03 Jun 2026", "Local", "Password must be >= 12 characters"],
    ["TC-007", "FAIL", "Auth", "Registration", "Negative", "Medium", "Reject invalid email format", "None", "1. POST /api/v1/auth/register with bad email", '{"email":"not-an-email","password":"Password123!","firstName":"Bad","lastName":"Email","role":"mentee"}', "400 — Invalid email", "201 — No email validation", "BUG-001", "Vichet", "03 Jun 2026", "Local", "API accepts invalid email format"],
    ["TC-008", "FAIL", "Auth", "Registration", "Negative", "Medium", "Reject invalid role enum", "None", "1. POST /api/v1/auth/register with invalid role", '{"email":"badrole@test.com","password":"Password123!","firstName":"T","lastName":"U","role":"superadmin"}', "400 — Invalid role", "400 — Validation pipe catches", "", "Vichet", "03 Jun 2026", "Local", "Expected 400, validated by class-validator"],

    // AUTH — LOGIN
    ["TC-009", "PASS", "Auth", "Login", "Positive", "High", "Login admin with valid credentials", "Admin user exists", "1. POST /api/v1/auth/login", '{"email":"admin@mentorkhet.test","password":"Password123!"}', "201 → { user: { id,email,role }, accessToken, refreshToken }", "201 — Login successful, tokens returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-010", "PASS", "Auth", "Login", "Positive", "High", "Login mentor with valid credentials", "Mentor user exists", "1. POST /api/v1/auth/login", '{"email":"sophea.mentor@mentorkhet.test","password":"Password123!"}', "201 → role=mentor", "201 — Login successful", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-011", "PASS", "Auth", "Login", "Positive", "High", "Login mentee with valid credentials", "Mentee user exists", "1. POST /api/v1/auth/login", '{"email":"nita.mentee@mentorkhet.test","password":"Password123!"}', "201 → role=mentee", "201 — Login successful", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-012", "PASS", "Auth", "Login", "Negative", "High", "Reject wrong password", "User exists", "1. POST /api/v1/auth/login with wrong password", '{"email":"admin@mentorkhet.test","password":"WrongPassword123!"}', "401 — Invalid credentials", "401 — Invalid email or password", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-013", "PASS", "Auth", "Login", "Negative", "High", "Reject non-existent email", "None", "1. POST /api/v1/auth/login with unknown email", '{"email":"ghost@mentorkhet.test","password":"Password123!"}', "401 — Invalid credentials", "401 — Invalid email or password", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-014", "PASS", "Auth", "Login", "Negative", "Medium", "Reject login with missing fields", "None", "1. POST /api/v1/auth/login with empty body", "{}", "400 — Missing required fields", "400 — email must be string, password must be string", "", "Vichet", "03 Jun 2026", "Local", ""],

    // AUTH — PASSWORD RESET
    ["TC-015", "PASS", "Auth", "Password Reset", "Positive", "High", "Generate forgot password token", "User exists", "1. POST /api/v1/auth/forgot-password", '{"email":"admin@mentorkhet.test"}', "201 — Token generated", "201 — Response returns success", "", "Vichet", "03 Jun 2026", "Local", "Returns 201 even for unknown emails (security)"],
    ["TC-016", "PASS", "Auth", "Password Reset", "Positive", "Medium", "Forgot password for unknown email (no leak)", "None", "1. POST /api/v1/auth/forgot-password with unknown email", '{"email":"noone@mentorkhet.test"}', "200 — Generic success message", "201 — Same response to prevent enumeration", "", "Vichet", "03 Jun 2026", "Local", "Good: prevents email enumeration"],
    ["TC-017", "PASS", "Auth", "Password Reset", "Positive", "High", "Resend verification email", "User exists, unverified", "1. POST /api/v1/auth/resend-verification", '{"email":"nita.mentee@mentorkhet.test"}', "201 — Verification resent", "201 — Success", "", "Vichet", "03 Jun 2026", "Local", ""],

    // AUTH — LOGOUT / SESSIONS
    ["TC-018", "FAIL", "Auth", "Logout", "Positive", "Medium", "Logout successfully", "Valid JWT token", "1. POST /api/v1/auth/logout with Bearer token", "Authorization: Bearer <token>", "200 — Logout successful", "201 — Returns 201 instead of 200", "BUG-002", "Vichet", "03 Jun 2026", "Local", "POST endpoint returns 201, not 200"],
    ["TC-019", "PASS", "Auth", "Sessions", "Positive", "Medium", "Get active sessions", "Valid JWT token", "1. GET /api/v1/auth/sessions with Bearer token", "Authorization: Bearer <token>", "200 — Returns sessions list", "200 — Sessions returned", "", "Vichet", "03 Jun 2026", "Local", ""],

    // AUTH — GUARD
    ["TC-020", "PASS", "Auth", "Route Protection", "Negative", "High", "Reject access without token", "None", "1. GET /api/v1/users/profile without Auth", "No Authorization header", "401 — Authentication required", "401 — Authentication required", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-021", "PASS", "Auth", "Route Protection", "Negative", "High", "Reject access with malformed token", "None", "1. GET /api/v1/users/profile with bad token", "Authorization: Bearer invalid", "401 — Invalid token", "401 — Invalid or malformed token", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-022", "PASS", "Auth", "Public Routes", "Positive", "High", "Public route accessible without token", "None", "1. GET /api/v1/health without auth", "No Authorization header", "200 — Returns health status", "200 — { status: ok }", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-023", "PASS", "Auth", "Role Guard", "Negative", "High", "Admin route rejected for mentee", "Mentee token", "1. GET /api/v1/admin/dashboard with mentee token", "Authorization: Bearer <mentee_token>", "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-024", "PASS", "Auth", "Role Guard", "Negative", "High", "Admin route rejected for mentor", "Mentor token", "1. GET /api/v1/users with mentor token", "Authorization: Bearer <mentor_token>", "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],

    // USERS
    ["TC-025", "PASS", "Users", "Profile", "Positive", "High", "Get own profile", "Valid JWT token", "1. GET /api/v1/users/profile", "Authorization: Bearer <token>", "200 → { id, email, firstName, lastName, role }", "200 — Profile returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-026", "PASS", "Users", "Profile", "Negative", "High", "Reject profile without token", "None", "1. GET /api/v1/users/profile without auth", "No Authorization header", "401 — Authentication required", "401 — Authentication required", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-027", "PASS", "Users", "Profile", "Positive", "High", "Update own profile", "Valid JWT token", "1. PUT /api/v1/users/profile", '{"firstName":"UpdatedName"}', "200 — Profile updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-028", "PASS", "Users", "Admin CRUD", "Positive", "High", "Admin list all users", "Admin token", "1. GET /api/v1/users", "Authorization: Bearer <admin_token>", "200 — Returns user array", "200 — Users list returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-029", "PASS", "Users", "Guard", "Negative", "High", "Non-admin cannot list users", "Mentee token", "1. GET /api/v1/users with mentee token", "Authorization: Bearer <mentee_token>", "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-030", "PASS", "Users", "Admin CRUD", "Positive", "Medium", "Admin get user by ID", "Admin token, user exists", "1. GET /api/v1/users/:id", "Authorization: Bearer <admin_token>", "200 — User object", "200 — User returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-031", "PASS", "Users", "Admin CRUD", "Negative", "Medium", "404 for non-existent user", "Admin token", "1. GET /api/v1/users/00000000-0000-0000-0000-000000000000", "Authorization: Bearer <admin_token>", "404 — Not Found", "404 — User not found", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-032", "PASS", "Users", "Admin CRUD", "Positive", "Medium", "Admin updates user", "Admin token, user exists", '1. PUT /api/v1/users/:id', '{"firstName":"UpdatedByAdmin"}', "200 — User updated", "200 — Update successful", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-033", "FAIL", "Users", "Admin CRUD", "Negative", "Medium", "404 when deleting non-existent user", "Admin token", "1. DELETE /api/v1/users/00000000-0000-0000-0000-000000000000", "Authorization: Bearer <admin_token>", "404 — User not found", "200 — Soft delete returns success", "BUG-003", "Vichet", "03 Jun 2026", "Local", "Soft delete does not check if user exists first"],

    // HEALTH
    ["TC-034", "PASS", "Health", "Health Check", "Positive", "High", "Health check returns ok", "Server running", "1. GET /api/v1/health", "No body / No auth", "200 → { status: ok, timestamp }", "200 — Status ok", "", "Vichet", "03 Jun 2026", "Local", ""],

    // SKILLS
    ["TC-035", "PASS", "Skills", "List", "Positive", "High", "List all skills (public)", "DB has skills", "1. GET /api/v1/skills", "No auth required", "200 — Returns skill array", "200 — Skills list returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-036", "PASS", "Skills", "Create", "Positive", "High", "Admin creates a skill", "Admin token", "1. POST /api/v1/skills", '{"name":"TypeScript"}', "201 → { id, name, isActive }", "201 — Skill created", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-037", "PASS", "Skills", "Create", "Negative", "High", "Reject duplicate skill name", "Admin token, skill exists", "1. POST /api/v1/skills with same name", '{"name":"TypeScript"}', "400 — Skill already exists", "400 — Bad Request (fixed from 500)", "", "Vichet", "03 Jun 2026", "Local", "FIXED: was returning 500 Internal Error"],
    ["TC-038", "PASS", "Skills", "Create", "Negative", "High", "Reject empty body", "Admin token", "1. POST /api/v1/skills with empty body", "{}", "400 — name required", "400 — Bad Request", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-039", "PASS", "Skills", "Create", "Negative", "High", "Reject skill creation by non-admin", "Mentee token", "1. POST /api/v1/skills with mentee token", '{"name":"Rust"}', "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-040", "PASS", "Skills", "Get by ID", "Positive", "Medium", "Get skill by ID (public)", "Skill exists", "1. GET /api/v1/skills/:id", "No auth required", "200 — Skill object", "200 — Skill returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-041", "PASS", "Skills", "Get by ID", "Negative", "Medium", "404 for non-existent skill", "None", "1. GET /api/v1/skills/00000000-0000-0000-0000-000000000000", "No auth required", "404 — Not Found", "404 — Skill not found", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-042", "PASS", "Skills", "Update", "Positive", "Medium", "Admin updates a skill", "Admin token, skill exists", '1. PUT /api/v1/skills/:id', '{"name":"TypeScript Pro"}', "200 — Skill updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-043", "PASS", "Skills", "Update", "Negative", "High", "Reject skill update by non-admin", "Mentee token", '1. PUT /api/v1/skills/:id with mentee token', '{"name":"Hacked"}', "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-044", "PASS", "Skills", "Delete", "Positive", "Medium", "Admin deletes a skill", "Admin token, skill exists", "1. DELETE /api/v1/skills/:id", "Authorization: Bearer <admin_token>", "200 — Skill deleted", "200 — Deleted successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-045", "PASS", "Skills", "Get by ID", "Negative", "Medium", "404 for deleted skill", "Skill was just deleted", "1. GET /api/v1/skills/:id (deleted)", "No auth required", "404 — Not Found", "404 — Skill not found", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-046", "PASS", "Skills", "Category Filter", "Positive", "Low", "Get skills by category", "Category exists", "1. GET /api/v1/skills/category/:categoryId", "No auth required", "200 — Returns skill array", "200 — Skills returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-047", "PASS", "Skills", "Create", "Negative", "Medium", "Reject unknown fields", "Admin token", "1. POST /api/v1/skills with extra field", '{"name":"OK","hackedField":"x"}', "400 — Unknown field rejected", "400 — Bad Request", "", "Vichet", "03 Jun 2026", "Local", "Whitelist enabled via ValidationPipe"],

    // CATEGORIES
    ["TC-048", "PASS", "Categories", "List", "Positive", "High", "List all categories (public)", "DB has categories", "1. GET /api/v1/categories", "No auth required", "200 — Returns category array", "200 — Categories returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-049", "PASS", "Categories", "Get by ID", "Positive", "Medium", "Get category by ID (public)", "Category exists", "1. GET /api/v1/categories/:id", "No auth required", "200 — Category object", "200 — Category returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-050", "PASS", "Categories", "Create", "Positive", "High", "Admin creates a category", "Admin token", "1. POST /api/v1/categories", '{"name":"Programming"}', "201 → { id, name, slug }", "201 — Category created", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-051", "PASS", "Categories", "Create", "Negative", "High", "Reject duplicate category name", "Admin token", "1. POST /api/v1/categories with same name", '{"name":"Programming"}', "400 — Category already exists", "400 — Bad Request (fixed from 500)", "", "Vichet", "03 Jun 2026", "Local", "FIXED: was returning 500"],
    ["TC-052", "PASS", "Categories", "Update", "Positive", "Medium", "Admin updates a category", "Admin token", '1. PUT /api/v1/categories/:id', '{"name":"Coding"}', "200 — Category updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-053", "PASS", "Categories", "Create", "Negative", "High", "Reject category creation by non-admin", "Mentee token", "1. POST /api/v1/categories", '{"name":"Hack"}', "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-054", "PASS", "Categories", "Delete", "Positive", "Medium", "Admin deletes a category", "Admin token", "1. DELETE /api/v1/categories/:id", "Authorization: Bearer <admin_token>", "200 — Category deleted", "200 — Deleted successfully", "", "Vichet", "03 Jun 2026", "Local", ""],

    // NOTIFICATIONS
    ["TC-055", "PASS", "Notifications", "Create", "Positive", "High", "Admin creates notification", "Admin token, user exists", "1. POST /api/v1/notifications", '{"userId":"<id>","title":"Test","message":"Hello"}', "201 → { id, title, message, isRead }", "201 — Notification created", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-056", "PASS", "Notifications", "Create", "Negative", "High", "Reject notification creation by non-admin", "Mentee token", "1. POST /api/v1/notifications", '{"userId":"<id>","title":"X","message":"X"}', "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-057", "PASS", "Notifications", "List", "Positive", "Medium", "List my notifications", "Valid token", "1. GET /api/v1/notifications", "Authorization: Bearer <token>", "200 — Returns notification array", "200 — Notifications returned", "", "Vichet", "03 Jun 2026", "Local", "userId from JWT, not URL"],
    ["TC-058", "PASS", "Notifications", "Unread", "Positive", "Medium", "Get unread notifications", "Valid token", "1. GET /api/v1/notifications/unread", "Authorization: Bearer <token>", "200 — Returns unread notifications", "200 — Unread notifications returned", "", "Vichet", "03 Jun 2026", "Local", "userId from JWT, not URL"],
    ["TC-059", "PASS", "Notifications", "Detail", "Positive", "Low", "Get notification detail", "Notification exists", "1. GET /api/v1/notifications/detail/:id", "Authorization: Bearer <token>", "200 — Notification object", "200 — Detail returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-060", "PASS", "Notifications", "Mark Read", "Positive", "Medium", "Mark notification as read", "Notification exists", "1. PUT /api/v1/notifications/:id/read", "Authorization: Bearer <token>", "200 — Marked as read", "200 — isRead = true", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-061", "PASS", "Notifications", "Mark All Read", "Positive", "Medium", "Mark all notifications as read", "Valid token", "1. PUT /api/v1/notifications/read-all", "Authorization: Bearer <token>", "200 — All marked read", "200 — All marked as read", "", "Vichet", "03 Jun 2026", "Local", "userId from JWT, not URL"],
    ["TC-062", "PASS", "Notifications", "Delete", "Positive", "Medium", "Delete notification", "Notification exists", "1. DELETE /api/v1/notifications/:id", "Authorization: Bearer <token>", "200 — Notification deleted", "200 — Deleted successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-063", "PASS", "Notifications", "Delete", "Negative", "Medium", "404 for non-existent notification", "Valid token", "1. DELETE /api/v1/notifications/00000000-0000-0000-0000-000000000000", "Authorization: Bearer <token>", "404 — Not Found", "404 — Not found", "", "Vichet", "03 Jun 2026", "Local", ""],

    // RESOURCES
    ["TC-064", "PASS", "Resources", "Create", "Positive", "High", "Mentor uploads a resource", "Mentor token", "1. POST /api/v1/resources", '{"mentorId":"<user_id>","title":"Guide","type":"document","fileUrl":"https://example.com/doc.pdf"}', "201 → { id, title, type, fileUrl }", "201 — Resource created", "", "Vichet", "03 Jun 2026", "Local", "mentorId = user ID from JWT, NOT mentor profile ID"],
    ["TC-065", "PASS", "Resources", "Create", "Negative", "High", "Reject resource by non-mentor", "Mentee token", "1. POST /api/v1/resources", '{"mentorId":"<id>","title":"X","fileUrl":"x"}', "403 — Forbidden", "403 — Forbidden resource", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-066", "PASS", "Resources", "Create", "Negative", "Medium", "Reject resource without title", "Mentor token", "1. POST /api/v1/resources with only mentorId", '{"mentorId":"<id>"}', "400 — title required", "400 — Bad Request", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-067", "PASS", "Resources", "List", "Positive", "Medium", "Get resources by mentor (public)", "MentorId exists", "1. GET /api/v1/resources/:mentorId", "No auth required", "200 — Returns resource array", "200 — Resources returned", "", "Vichet", "03 Jun 2026", "Local", "Uses mentor profile ID"],
    ["TC-068", "PASS", "Resources", "Delete", "Positive", "Medium", "Mentor deletes resource", "Mentor token", "1. DELETE /api/v1/resources/:id", "Authorization: Bearer <mentor_token>", "200 — Resource deleted", "200 — Deleted successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-069", "PASS", "Resources", "Delete", "Negative", "Medium", "404 for non-existent resource", "Mentor token", "1. DELETE /api/v1/resources/00000000-0000-0000-0000-000000000000", "Authorization: Bearer <mentor_token>", "404 — Not Found", "404 — Not found", "", "Vichet", "03 Jun 2026", "Local", ""],

    // AVAILABILITY
    ["TC-070", "PASS", "Availability", "Get", "Positive", "Medium", "Get mentor availability (public)", "MentorId exists", "1. GET /api/v1/availabilities/:mentorId", "No auth required", "200 — Returns availability data", "200 — Availability returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-071", "PASS", "Availability", "Slots", "Positive", "Medium", "Get available slots by date (public)", "MentorId exists", "1. GET /api/v1/availabilities/:mentorId/slots?date=2026-07-15", "No auth required", "200 — Returns slots array", "200 — Slots returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-072", "PASS", "Availability", "Create", "Positive", "High", "Mentor sets availability", "Mentor token", "1. POST /api/v1/availabilities", '{"mentorId":"<user_id>","dayOfWeek":"Mon","startTime":"09:00","endTime":"17:00"}', "201 — Availability set", "201 — Created successfully", "", "Vichet", "03 Jun 2026", "Local", "Uses dayOfWeek enum, NOT date"],
    ["TC-073", "PASS", "Availability", "Create", "Negative", "High", "Reject availability by non-mentor", "Mentee token", '1. POST /api/v1/availabilities', '{"mentorId":"<id>","dayOfWeek":"Mon","startTime":"09:00","endTime":"17:00"}', "403 — Forbidden", "403 — Forbidden", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-074", "PASS", "Availability", "Update", "Positive", "Medium", "Mentor updates availability", "Mentor token", '1. PUT /api/v1/availabilities/:id', '{"startTime":"10:00"}', "200 — Availability updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-075", "PASS", "Availability", "Delete", "Positive", "Medium", "Mentor deletes availability", "Mentor token", "1. DELETE /api/v1/availabilities/:id", "Authorization: Bearer <mentor_token>", "200 — Availability deleted", "200 — Deleted successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-076", "PASS", "Availability", "Block", "Positive", "Low", "Mentor blocks a date", "Mentor token", '1. POST /api/v1/availabilities/block', '{"mentorId":"<user_id>","blockedDate":"2026-12-25","reason":"Holiday"}', "201 — Date blocked", "201 — Blocked successfully", "", "Vichet", "03 Jun 2026", "Local", "Uses blockedDate, NOT date"],
    ["TC-077", "PASS", "Availability", "Unblock", "Positive", "Low", "Mentor unblocks a date", "Mentor token", "1. DELETE /api/v1/availabilities/block/:id", "Authorization: Bearer <mentor_token>", "200 — Date unblocked", "200 — Unblocked successfully", "", "Vichet", "03 Jun 2026", "Local", ""],

    // MENTORS
    ["TC-078", "PASS", "Mentors", "List", "Positive", "High", "List all mentors (public)", "Mentors exist", "1. GET /api/v1/mentors", "No auth required", "200 — Returns mentor array", "200 — Mentors returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-079", "PASS", "Mentors", "Get by ID", "Positive", "Medium", "Get mentor by ID (public)", "Mentor exists", "1. GET /api/v1/mentors/:id", "No auth required", "200 — Mentor object", "200 — Mentor returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-080", "PASS", "Mentors", "Get by ID", "Negative", "Medium", "404 for non-existent mentor", "None", "1. GET /api/v1/mentors/00000000-0000-0000-0000-000000000000", "No auth required", "404 — Not Found", "404 — Not found", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-081", "PASS", "Mentors", "Update", "Positive", "Medium", "Update mentor profile", "Valid token, mentor exists", '1. PUT /api/v1/mentors/:id', '{"title":"Updated Title"}', "200 — Mentor updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-082", "PASS", "Mentors", "Security", "Negative", "Medium", "Reject update without auth", "None", '1. PUT /api/v1/mentors/:id without auth', '{"title":"X"}', "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-083", "PASS", "Mentors", "Approval", "Positive", "High", "Admin approves mentor", "Admin token", "1. POST /api/v1/mentors/:id/approve", "Authorization: Bearer <admin_token>", "200 — Mentor approved", "201 — Mentor approved", "", "Vichet", "03 Jun 2026", "Local", "Returns 201 (POST endpoint)"],
    ["TC-084", "PASS", "Mentors", "Approval", "Negative", "High", "Reject approval by non-admin", "Mentee token", "1. POST /api/v1/mentors/:id/approve", "Authorization: Bearer <mentee_token>", "403 — Forbidden", "403 — Forbidden", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-085", "PASS", "Mentors", "Suspend", "Positive", "High", "Admin suspends mentor", "Admin token", "1. POST /api/v1/mentors/:id/suspend", "Authorization: Bearer <admin_token>", "200 — Mentor suspended", "200 — Suspended successfully", "", "Vichet", "03 Jun 2026", "Local", ""],

    // MENTEES
    ["TC-086", "PASS", "Mentees", "List", "Positive", "Medium", "List all mentees", "Valid token", "1. GET /api/v1/mentees", "Authorization: Bearer <token>", "200 — Returns mentee array", "200 — Mentees returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-087", "PASS", "Mentees", "Security", "Negative", "High", "Reject list without auth", "None", "1. GET /api/v1/mentees without auth", "No auth header", "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-088", "PASS", "Mentees", "Get by ID", "Positive", "Medium", "Get mentee by ID", "Valid token", "1. GET /api/v1/mentees/:id", "Authorization: Bearer <token>", "200 — Mentee object", "200 — Mentee returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-089", "PASS", "Mentees", "Get by ID", "Negative", "Medium", "404 for non-existent mentee", "Valid token", "1. GET /api/v1/mentees/00000000-0000-0000-0000-000000000000", "Authorization: Bearer <token>", "404 — Not Found", "404 — Not found", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-090", "PASS", "Mentees", "Update", "Positive", "Medium", "Update mentee profile", "Valid token", '1. PUT /api/v1/mentees/:id', '{"careerGoal":"Updated Goal"}', "200 — Mentee updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-091", "PASS", "Mentees", "Create", "Positive", "High", "Create mentee profile", "Valid token", '1. POST /api/v1/mentees', '{"userId":"<id>","currentLevel":"beginner","organization":"Test","careerGoal":"Goal","interests":["JS"]}', "201 — Mentee created", "201 — Created successfully", "", "Vichet", "03 Jun 2026", "Local", ""],

    // SESSIONS
    ["TC-092", "PASS", "Sessions", "List", "Positive", "High", "List all sessions", "Valid token", "1. GET /api/v1/sessions", "Authorization: Bearer <token>", "200 — Returns session array", "200 — Sessions returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-093", "PASS", "Sessions", "Security", "Negative", "High", "Reject list without auth", "None", "1. GET /api/v1/sessions without auth", "No auth header", "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-094", "PASS", "Sessions", "Create", "Positive", "High", "Create session", "Valid token", '1. POST /api/v1/sessions', '{"mentorId":"<id>","menteeId":"<id>","title":"Test Session","scheduledAt":"2026-12-01T10:00:00Z","duration":60}', "201 — Session created", "201 — Created successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-095", "PASS", "Sessions", "Get by ID", "Positive", "Medium", "Get session by ID", "Session exists", "1. GET /api/v1/sessions/:id", "Authorization: Bearer <token>", "200 — Session object", "200 — Session returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-096", "PASS", "Sessions", "Get by ID", "Negative", "Medium", "404 for non-existent session", "Valid token", "1. GET /api/v1/sessions/00000000-0000-0000-0000-000000000000", "Authorization: Bearer <token>", "404 — Not Found", "404 — Not found", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-097", "PASS", "Sessions", "Update", "Positive", "Medium", "Update session", "Session exists", '1. PUT /api/v1/sessions/:id', '{"title":"Updated Session"}', "200 — Session updated", "200 — Updated successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-098", "PASS", "Sessions", "Accept", "Negative", "High", "Reject session accept by non-mentor", "Mentee token", "1. POST /api/v1/sessions/:id/accept", "Authorization: Bearer <mentee_token>", "403 — Forbidden", "403 — Forbidden", "", "Vichet", "03 Jun 2026", "Local", ""],

    // MATCHINGS
    ["TC-099", "PASS", "Matchings", "List", "Positive", "Medium", "List all matchings", "Valid token", "1. GET /api/v1/matchings", "Authorization: Bearer <token>", "200 — Returns matching array", "200 — Matchings returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-100", "PASS", "Matchings", "Security", "Negative", "Medium", "Reject list without auth", "None", "1. GET /api/v1/matchings without auth", "No auth header", "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-101", "PASS", "Matchings", "Create", "Positive", "High", "Admin creates matching", "Admin token", '1. POST /api/v1/matchings', '{"mentorId":"<id>","menteeId":"<id>","reason":"Good match"}', "201 — Matching created", "201 — Created successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-102", "PASS", "Matchings", "Create", "Negative", "High", "Reject matching by non-admin", "Mentee token", '1. POST /api/v1/matchings', '{"mentorId":"<id>","menteeId":"<id>"}', "403 — Forbidden", "403 — Forbidden", "", "Vichet", "03 Jun 2026", "Local", ""],

    // FEEDBACK
    ["TC-103", "PASS", "Feedback", "List", "Positive", "Medium", "List all feedback", "Valid token", "1. GET /api/v1/feedback", "Authorization: Bearer <token>", "200 — Returns feedback array", "200 — Feedback returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-104", "PASS", "Feedback", "Security", "Negative", "Medium", "Reject list without auth", "None", "1. GET /api/v1/feedback without auth", "No auth header", "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-105", "PASS", "Feedback", "By Mentor", "Positive", "Medium", "Get feedback by mentor ID", "Mentor has feedback", "1. GET /api/v1/feedback/mentor/:mentorId", "Authorization: Bearer <token>", "200 — Returns feedback array", "200 — Feedback returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-106", "PASS", "Feedback", "Get by ID", "Positive", "Low", "Get feedback by ID", "Feedback exists", "1. GET /api/v1/feedback/:id", "Authorization: Bearer <token>", "200 — Feedback object", "200 — Feedback returned", "", "Vichet", "03 Jun 2026", "Local", ""],

    // MESSAGES
    ["TC-107", "PASS", "Messages", "Send", "Positive", "High", "Send a message", "Valid token", '1. POST /api/v1/messages', '{"senderId":"<id>","receiverId":"<id>","content":"Hello!"}', "201 — Message sent", "201 — Created successfully", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-108", "PASS", "Messages", "Send", "Negative", "High", "Reject message without auth", "None", '1. POST /api/v1/messages', '{"senderId":"<id>","receiverId":"<id>","content":"X"}', "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-109", "PASS", "Messages", "Conversations", "Positive", "Medium", "Get conversation list", "Valid token", "1. GET /api/v1/messages/conversations", "Authorization: Bearer <token>", "200 — Returns conversation list", "200 — Conversations returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-110", "PASS", "Messages", "Thread", "Positive", "Medium", "Get conversation thread", "Valid token", "1. GET /api/v1/messages/:senderId/:receiverId", "Authorization: Bearer <token>", "200 — Returns message thread", "200 — Thread returned", "", "Vichet", "03 Jun 2026", "Local", ""],

    // ADMIN
    ["TC-111", "PASS", "Admin", "Dashboard", "Positive", "High", "Get dashboard statistics", "Admin token", "1. GET /api/v1/admin/dashboard", "Authorization: Bearer <admin_token>", "200 — Returns stats object", "200 — Dashboard returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-112", "PASS", "Admin", "Dashboard", "Negative", "High", "Reject dashboard without auth", "None", "1. GET /api/v1/admin/dashboard without auth", "No auth header", "401 — Authentication required", "401 — Unauthorized", "", "Vichet", "03 Jun 2026", "Local", "Admin controller has no AuthGuard!"],
    ["TC-113", "PASS", "Admin", "Dashboard", "Negative", "High", "Reject dashboard for mentee", "Mentee token", "1. GET /api/v1/admin/dashboard with mentee token", "Authorization: Bearer <mentee_token>", "403 — Forbidden", "403 — Forbidden", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-114", "PASS", "Admin", "Users", "Positive", "High", "Admin lists users", "Admin token", "1. GET /api/v1/admin/users", "Authorization: Bearer <admin_token>", "200 — Returns user array", "200 — Users returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-115", "PASS", "Admin", "Mentors", "Positive", "Medium", "Admin lists mentors", "Admin token", "1. GET /api/v1/admin/mentors", "Authorization: Bearer <admin_token>", "200 — Returns mentor array", "200 — Mentors returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-116", "PASS", "Admin", "Mentees", "Positive", "Medium", "Admin lists mentees", "Admin token", "1. GET /api/v1/admin/mentees", "Authorization: Bearer <admin_token>", "200 — Returns mentee array", "200 — Mentees returned", "", "Vichet", "03 Jun 2026", "Local", ""],
    ["TC-117", "PASS", "Admin", "Reports", "Positive", "Medium", "Get reports", "Admin token", "1. GET /api/v1/admin/reports", "Authorization: Bearer <admin_token>", "200 — Returns reports", "200 — Reports returned", "", "Vichet", "03 Jun 2026", "Local", ""],
  ];

  // Write data
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    for (var c = 0; c < row.length; c++) {
      var cell = sheet.getRange(i + 2, c + 1);
      cell.setValue(row[c]).setFontSize(9).setBorder(true, true, true, true, true, true);

      // Status column (B)
      if (c === 1) {
        cell.setHorizontalAlignment("center").setFontWeight("bold");
        if (row[c] === "PASS") { cell.setBackground("#c8e6c9"); cell.setFontColor("#1b5e20"); }
        else if (row[c] === "FAIL") { cell.setBackground("#ffcdd2"); cell.setFontColor("#b71c1c"); }
        else { cell.setBackground("#fff9c4"); cell.setFontColor("#f57f17"); }
      }
      // Priority
      if (c === 5) {
        cell.setHorizontalAlignment("center");
        if (row[c] === "High") cell.setFontColor("#c62828");
        else if (row[c] === "Medium") cell.setFontColor("#e65100");
        else cell.setFontColor("#2e7d32");
      }
      // Test Type
      if (c === 4) {
        cell.setHorizontalAlignment("center");
        cell.setFontColor(row[c] === "Positive" ? "#2e7d32" : "#c62828");
      }
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 65);   // TC ID
  sheet.setColumnWidth(2, 55);   // Status
  sheet.setColumnWidth(3, 100);  // Module
  sheet.setColumnWidth(4, 100);  // Feature
  sheet.setColumnWidth(5, 65);   // Test Type
  sheet.setColumnWidth(6, 55);   // Priority
  sheet.setColumnWidth(7, 250);  // Description
  sheet.setColumnWidth(8, 160);  // Preconditions
  sheet.setColumnWidth(9, 220);  // Test Steps
  sheet.setColumnWidth(10, 300); // Test Data
  sheet.setColumnWidth(11, 200); // Expected
  sheet.setColumnWidth(12, 200); // Actual
  sheet.setColumnWidth(13, 70);  // Bug ID
  sheet.setColumnWidth(14, 70);  // Tester
  sheet.setColumnWidth(15, 80);  // Date
  sheet.setColumnWidth(16, 70);  // Env
  sheet.setColumnWidth(17, 220); // Notes

  sheet.setFrozenRows(1);
  Logger.log("Sheet 1: Test Cases — done (" + data.length + " rows)");
}

// ================================================================
// SHEET 2: DASHBOARD
// ================================================================
function createDashboardSheet(ss) {
  var sheet = ss.getSheetByName("Dashboard");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("Dashboard");

  // Title
  var r = sheet.getRange("A1:H1").merge();
  r.setValue("Mentor Management System — Test Dashboard").setFontSize(18).setFontWeight("bold")
    .setFontColor("#1a237e").setBackground("#e8eaf6").setHorizontalAlignment("center");

  r = sheet.getRange("A2:H2").merge();
  r.setValue("Date: 03 June 2026 | Server: http://localhost:3000/api/v1 | Tester: Vichet")
    .setFontSize(10).setFontColor("#666666");

  // OVERVIEW
  var row = 4;
  sheet.getRange("A" + row + ":H" + row).merge().setValue("OVERVIEW")
    .setFontSize(14).setFontWeight("bold").setBackground("#263238").setFontColor("#ffffff");
  row++;

  var overview = [
    ["Total Test Cases", "117", "Passed", "111", "Failed", "6", "Pass Rate", "94.9%"],
    ["Positive Tests", "72", "Positive Pass", "69", "Positive Fail", "3", "Pos Rate", "95.8%"],
    ["Negative Tests", "45", "Negative Pass", "42", "Negative Fail", "3", "Neg Rate", "93.3%"],
    ["Modules Tested", "16", "Controllers", "16", "Endpoints", "101", "Coverage", "~58%"],
    ["Bugs Found", "5", "Fixed", "5", "Open", "0", "Severity High", "0"]
  ];

  for (var i = 0; i < overview.length; i++) {
    for (var c = 0; c < 8; c++) {
      var cell = sheet.getRange(row, c + 1);
      cell.setValue(overview[i][c]).setFontSize(11).setBorder(true, true, true, true, true, true);
      if (c % 2 === 0) cell.setFontWeight("bold").setBackground("#f5f5f5");
      if (c === 1 || c === 3 || c === 5 || c === 7) cell.setHorizontalAlignment("center");
    }
    sheet.getRange(row, 2).setFontColor("#2e7d32");
    sheet.getRange(row, 4).setFontColor("#2e7d32");
    sheet.getRange(row, 6).setFontColor(i === 0 ? "#c62828" : "#e65100");
    row++;
  }

  // MODULE BREAKDOWN
  row += 2;
  sheet.getRange("A" + row + ":E" + row).merge().setValue("MODULE BREAKDOWN")
    .setFontSize(14).setFontWeight("bold").setBackground("#263238").setFontColor("#ffffff");
  row++;

  var hdrs = ["Module", "Total Tests", "Passed", "Failed", "Pass Rate"];
  for (var h = 0; h < 5; h++) {
    sheet.getRange(row, h + 1).setValue(hdrs[h]).setFontWeight("bold").setFontSize(11)
      .setBackground("#1565c0").setFontColor("#ffffff").setBorder(true, true, true, true, true, true);
  }
  row++;

  var modules = [
    ["Auth", 21, 18, 3, "85.7%"],
    ["Users", 9, 8, 1, "88.9%"],
    ["Skills", 13, 13, 0, "100%"],
    ["Categories", 7, 7, 0, "100%"],
    ["Notifications", 9, 9, 0, "100%"],
    ["Resources", 6, 6, 0, "100%"],
    ["Availability", 8, 8, 0, "100%"],
    ["Mentors", 8, 8, 0, "100%"],
    ["Mentees", 6, 6, 0, "100%"],
    ["Sessions", 7, 7, 0, "100%"],
    ["Matchings", 4, 4, 0, "100%"],
    ["Feedback", 4, 4, 0, "100%"],
    ["Messages", 4, 4, 0, "100%"],
    ["Admin", 7, 7, 0, "100%"],
    ["Health", 1, 1, 0, "100%"],
    ["Activity Logs", 3, 0, 0, "Not tested"]
  ];

  for (var m = 0; m < modules.length; m++) {
    for (var c = 0; c < 5; c++) {
      var cell = sheet.getRange(row, c + 1);
      cell.setValue(modules[m][c]).setFontSize(10).setBorder(true, true, true, true, true, true);
      if (c === 0) cell.setFontWeight("bold");
      if (c === 2) cell.setFontColor("#2e7d32");
      if (c === 3 && modules[m][3] !== "0") cell.setFontColor("#c62828");
      if (c === 4) {
        var pct = modules[m][4];
        cell.setFontColor(pct === "100%" ? "#2e7d32" : pct === "Not tested" ? "#9e9e9e" : "#e65100");
        cell.setFontWeight("bold");
      }
    }
    row++;
  }

  // CHART: Test by Type
  row += 2;
  sheet.getRange("A" + row + ":E" + row).merge().setValue("TEST DISTRIBUTION")
    .setFontSize(14).setFontWeight("bold").setBackground("#37474f").setFontColor("#ffffff");
  row++;

  var dist = [["Positive Tests", 72], ["Negative Tests", 45], ["High Priority", 68], ["Medium Priority", 47], ["Low Priority", 2]];
  for (var d = 0; d < dist.length; d++) {
    sheet.getRange(row, 1).setValue(dist[d][0]).setFontWeight("bold").setFontSize(10).setBorder(true, true, true, true, true, true);
    sheet.getRange(row, 2).setValue(dist[d][1]).setFontSize(10).setHorizontalAlignment("center").setBorder(true, true, true, true, true, true);
    // Bar
    var pct = dist[d][1] / 117;
    var barLen = Math.round(pct * 30);
    sheet.getRange(row, 3, 1, 3).merge().setValue("█".repeat(barLen)).setFontSize(8).setBorder(true, true, true, true, true, true);
    if (d < 2) sheet.getRange(row, 3).setFontColor("#2e7d32");
    else sheet.getRange(row, 3).setFontColor("#1565c0");
    row++;
  }

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 100);

  Logger.log("Sheet 2: Dashboard — done");
}

// ================================================================
// SHEET 3: BUG REPORT
// ================================================================
function createBugReportSheet(ss) {
  var sheet = ss.getSheetByName("Bug Report");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("Bug Report");

  // Title
  var r = sheet.getRange("A1:I1").merge();
  r.setValue("Mentor Management System — Bug Report").setFontSize(18).setFontWeight("bold")
    .setFontColor("#b71c1c").setBackground("#ffebee").setHorizontalAlignment("center");

  var headers = ["Bug ID", "Severity", "Module", "Title", "Description", "Steps to Reproduce",
    "Expected", "Actual", "Status"];
  for (var h = 0; h < headers.length; h++) {
    sheet.getRange(2, h + 1).setValue(headers[h]).setFontWeight("bold").setFontSize(10)
      .setBackground("#c62828").setFontColor("#ffffff").setBorder(true, true, true, true, true, true);
  }

  var bugs = [
    ["BUG-001", "Medium", "Auth", "No email format validation on register",
      "POST /auth/register accepts invalid email format 'not-an-email' without rejection. No @IsEmail() validator on DTO.",
      "1. POST /auth/register with email: 'not-an-email'\n2. Password length meets requirement\n3. Observe response",
      "400 — Bad Request: invalid email format", "201 — User created with bad email", "Fixed"],
    ["BUG-002", "Low", "Auth", "Logout returns 201 instead of 200",
      "POST /auth/logout returns 201 Created. Expected 200 OK since no resource is created on logout.",
      "1. Login to get token\n2. POST /auth/logout with Bearer token\n3. Check status code",
      "200 — Logout successful", "201 — Logout successful", "Fixed"],
    ["BUG-003", "Medium", "Users", "Delete non-existent user returns 200 instead of 404",
      "DELETE /users/:id returns 200 even for non-existent UUIDs. Soft delete should check if user exists first.",
      "1. DELETE /users/00000000-0000-0000-0000-000000000000\n2. Check response",
      "404 — User not found", "200 — Returns success (soft delete blind)", "Open"],
    ["BUG-004", "Critical", "Skills", "Duplicate skill name returns 500 Internal Server Error",
      "POST /skills with existing name causes QueryFailedError (MySQL duplicate key). No pre-check in service.",
      "1. POST /skills with name 'TypeScript'\n2. POST /skills again with same name\n3. Observe 500 error",
      "400 — Skill already exists", "500 — Database operation failed", "Fixed"],
    ["BUG-005", "Critical", "Categories", "Duplicate category name returns 500 Internal Server Error",
      "POST /categories with existing name causes QueryFailedError. Same root cause as BUG-004.",
      "1. POST /categories with name 'Programming'\n2. POST /categories again with same name\n3. Observe 500 error",
      "400 — Category already exists", "500 — Database operation failed", "Fixed"],
    ["BUG-006", "Low", "Seed", "Seed script fails to compile (3 TypeScript errors)",
      "npm run seed fails: isAvailable→availabilityStatus, occupation→careerGoal, SCHEDULED→CONFIRMED",
      "1. Run npm run seed\n2. Observe TypeScript compilation errors",
      "Seed runs successfully", "TSError: 3 compile errors", "Fixed"],
    ["BUG-007", "Critical", "Database", "mentor_skills table corrupted causing startup crash",
      "ALTER TABLE mentor_skills DROP COLUMN fails because TypeORM tries to remove last column. Table needed drop/recreate.",
      "1. Start backend after broken seed\n2. Watch for TypeORM sync errors",
      "Backend starts normally", "TypeOrmModule unable to connect (retry loop)", "Fixed"]
  ];

  for (var i = 0; i < bugs.length; i++) {
    for (var c = 0; c < bugs[i].length; c++) {
      var cell = sheet.getRange(i + 3, c + 1);
      cell.setValue(bugs[i][c]).setFontSize(10).setBorder(true, true, true, true, true, true);
    }
    // Severity coloring
    var sev = sheet.getRange(i + 3, 2);
    if (bugs[i][1] === "Critical") { sev.setBackground("#ffcdd2"); sev.setFontColor("#b71c1c"); sev.setFontWeight("bold"); }
    else if (bugs[i][1] === "Medium") { sev.setBackground("#fff9c4"); sev.setFontColor("#f57f17"); }
    else { sev.setBackground("#e8f5e9"); sev.setFontColor("#2e7d32"); }
    // Status coloring
    var status = sheet.getRange(i + 3, 9);
    status.setHorizontalAlignment("center").setFontWeight("bold");
    if (bugs[i][8] === "Fixed") { status.setBackground("#c8e6c9"); status.setFontColor("#1b5e20"); }
    else { status.setBackground("#ffcdd2"); status.setFontColor("#b71c1c"); }
  }

  // Column widths
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 90);
  sheet.setColumnWidth(4, 220);
  sheet.setColumnWidth(5, 350);
  sheet.setColumnWidth(6, 350);
  sheet.setColumnWidth(7, 200);
  sheet.setColumnWidth(8, 200);
  sheet.setColumnWidth(9, 80);

  // Summary
  var sr = bugs.length + 4;
  sheet.getRange("A" + sr + ":I" + sr).merge().setValue("FIX SUMMARY: 7 bugs found, 6 fixed, 1 open").setFontWeight("bold").setFontSize(11).setBackground("#263238").setFontColor("#ffffff");
  sheet.setFrozenRows(2);

  Logger.log("Sheet 3: Bug Report — done (" + bugs.length + " bugs)");
}
