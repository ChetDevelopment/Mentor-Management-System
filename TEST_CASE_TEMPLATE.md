# 🧪 Test Case Template — Mentor Management System

## 📋 How to Use This Template

1. Copy the table below for each test case
2. Fill in the fields as you test
3. Mark status as ✅ Pass / ❌ Fail / ⏳ Pending
4. If Fail, add bug description + screenshot reference

---

## Test Case Template

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST CASE                                │
├─────────────────────────────────────────────────────────────┤
│ Test Case ID:   TC-XXX                                      │
│ Module:         [Auth / Users / Mentors / Sessions / ...]   │
│ Feature:        [Feature name]                              │
│ Test Type:      [Positive / Negative / Edge Case]           │
│ Priority:       [High / Medium / Low]                       │
│ Tester:         [Name]                                      │
│ Date:           [YYYY-MM-DD]                                │
├─────────────────────────────────────────────────────────────┤
│ Description:                                                 │
│ [What are you testing?]                                      │
│                                                             │
│ Preconditions:                                               │
│ 1. [What must be true before testing?]                       │
│ 2. [e.g., User must be logged in as admin]                   │
│                                                             │
│ Test Steps:                                                  │
│ 1. [Step 1]                                                  │
│ 2. [Step 2]                                                  │
│ 3. [Step 3]                                                  │
│                                                             │
│ Test Data:                                                   │
│ {                                                            │
│   "field": "value"                                           │
│ }                                                            │
│                                                             │
│ Expected Result:                                             │
│ [What should happen?]                                        │
│ { "statusCode": 201, "message": "Created successfully" }     │
│                                                             │
│ Actual Result:                                               │
│ [What actually happened?]                                    │
│                                                             │
│ Status:        ✅ Pass / ❌ Fail / ⏳ Pending               │
│ Bug ID:        [BUG-XXX if failed]                           │
│ Notes:         [Any additional info]                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Pre-filled Test Cases — Complete Test Suite

### Module: AUTH

**TC-001 | Register New Admin — Positive**
| Field | Value |
|-------|-------|
| Description | Verify admin user can register successfully |
| Preconditions | User does not exist in database |
| Steps | POST `/api/auth/register` with valid admin data |
| Test Data | `{ "email": "admin@test.com", "password": "Pass123!", "firstName": "Admin", "lastName": "User", "role": "admin" }` |
| Expected | 201 Created, returns `{ user: { email, role }, accessToken, refreshToken }` |
| Status | ☐ |

**TC-002 | Register Mentor — Positive**
| Field | Value |
|-------|-------|
| Description | Verify mentor user can register successfully |
| Steps | POST `/api/auth/register` with role "mentor" |
| Test Data | `{ "email": "mentor@test.com", "password": "Pass123!", "firstName": "Mentor", "lastName": "User", "role": "mentor" }` |
| Expected | 201 Created, role = "mentor" |
| Status | ☐ |

**TC-003 | Register Mentee — Positive**
| Field | Value |
|-------|-------|
| Steps | POST `/api/auth/register` with role "mentee" |
| Test Data | `{ "email": "mentee@test.com", "password": "Pass123!", "firstName": "Mentee", "lastName": "User", "role": "mentee" }` |
| Expected | 201 Created, role = "mentee" |
| Status | ☐ |

**TC-004 | Register Duplicate Email — Negative**
| Steps | POST `/api/auth/register` with same email as TC-001 |
| Expected | 400 Bad Request: "Email already registered" |
| Status | ☐ |

**TC-005 | Register Missing Fields — Negative**
| Test Data | `{ "email": "test@test.com" }` (no password, firstName, lastName) |
| Expected | 400 Bad Request with validation error message |
| Status | ☐ |

**TC-006 | Register Weak Password — Negative**
| Test Data | `{ "email": "weak@test.com", "password": "123", "firstName": "Test", "lastName": "User", "role": "mentee" }` |
| Expected | 400 Bad Request: password too short |
| Status | ☐ |

**TC-007 | Register Invalid Email — Negative**
| Test Data | `{ "email": "not-email", "password": "Pass123!", "firstName": "Test", "lastName": "User", "role": "mentee" }` |
| Expected | 400 Bad Request: invalid email format |
| Status | ☐ |

**TC-008 | Register Invalid Role — Negative**
| Test Data | `{ "email": "bad@test.com", "password": "Pass123!", "firstName": "Test", "lastName": "User", "role": "superadmin" }` |
| Expected | 400 Bad Request: invalid enum value |
| Status | ☐ |

**TC-009 | Login Success — Positive**
| Steps | POST `/api/auth/login` with valid credentials |
| Test Data | `{ "email": "admin@test.com", "password": "Pass123!" }` |
| Expected | 201 Created, returns `{ user, accessToken, refreshToken }` |
| Status | ☐ |

**TC-010 | Login Wrong Password — Negative**
| Test Data | `{ "email": "admin@test.com", "password": "WrongPassword!" }` |
| Expected | 401 Unauthorized |
| Status | ☐ |

**TC-011 | Login Non-existent Email — Negative**
| Test Data | `{ "email": "ghost@test.com", "password": "Pass123!" }` |
| Expected | 401 Unauthorized |
| Status | ☐ |

**TC-012 | Login Missing Fields — Negative**
| Test Data | `{ "email": "admin@test.com" }` (no password) |
| Expected | 400 Bad Request |
| Status | ☐ |

**TC-013 | Forgot Password — Positive**
| Steps | POST `/api/auth/forgot-password` with registered email |
| Test Data | `{ "email": "admin@test.com" }` |
| Expected | 201 Created, returns `{ resetToken: "..." }` |
| Status | ☐ |

**TC-014 | Forgot Password Non-existent Email — Negative**
| Test Data | `{ "email": "ghost@test.com" }` |
| Expected | 400 Bad Request: "Email not found" |
| Status | ☐ |

**TC-015 | Reset Password — Positive**
| Steps | POST `/api/auth/reset-password` with token from TC-013 |
| Test Data | `{ "token": "<resetToken>", "password": "NewPass123!" }` |
| Expected | 201 Created: "Password reset successful" |
| Status | ☐ |

**TC-016 | Login with New Password — Positive**
| Steps | POST `/api/auth/login` with new password from TC-015 |
| Expected | 201 Created, login successful |
| Status | ☐ |

**TC-017 | Reset Password Invalid Token — Negative**
| Test Data | `{ "token": "invalid-token", "password": "NewPass123!" }` |
| Expected | 400 Bad Request: "Invalid or expired reset token" |
| Status | ☐ |

**TC-018 | Reset Password Weak Password — Negative**
| Test Data | `{ "token": "<any>", "password": "123" }` |
| Expected | 400 Bad Request: password too short |
| Status | ☐ |

**TC-019 | Logout — Positive**
| Steps | POST `/api/auth/logout` with Bearer token |
| Expected | 201 Created: "Logout successful" |
| Status | ☐ |

**TC-020 | Refresh Token — Positive**
| Steps | POST `/api/auth/refresh-token` with Bearer token |
| Expected | 201 Created, returns new accessToken/refreshToken |
| Status | ☐ |

---

### Module: AUTH GUARD (Security)

**TC-021 | Access Without Token — Negative**
| Steps | GET `/api/users/profile` without Authorization header |
| Expected | 401 Unauthorized: "No token provided" |
| Status | ☐ |

**TC-022 | Access With Malformed Token — Negative**
| Steps | GET `/api/users/profile` with `Authorization: Bearer invalid` |
| Expected | 401 Unauthorized: "Invalid token" |
| Status | ☐ |

**TC-023 | Access With Empty Bearer — Negative**
| Steps | GET `/api/users/profile` with `Authorization: Bearer ` |
| Expected | 401 Unauthorized |
| Status | ☐ |

**TC-024 | Public Route Without Token — Positive**
| Steps | GET `/api/skills` without any auth |
| Expected | 200 OK, returns skill list |
| Status | ☐ |

**TC-025 | Admin Route Accessed by Mentee — Negative**
| Steps | GET `/api/admin/dashboard` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-026 | Admin Route Accessed by Mentor — Negative**
| Steps | GET `/api/users` with mentor token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-027 | Mentor Route Accessed by Mentee — Negative**
| Steps | POST `/api/mentors/:id/approve` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

---

### Module: USERS

**TC-028 | Get Own Profile — Positive**
| Steps | GET `/api/users/profile` with valid token, send `{ userId }` in body |
| Expected | 200 OK, returns user profile with email, firstName, lastName, role |
| Status | ☐ |

**TC-029 | Update Own Profile — Positive**
| Steps | PUT `/api/users/profile` with valid fields |
| Test Data | `{ "userId": "<id>", "firstName": "UpdatedName" }` |
| Expected | 200 OK, profile updated |
| Status | ☐ |

**TC-030 | Update Own Profile Empty Body — Negative**
| Steps | PUT `/api/users/profile` with only userId |
| Test Data | `{ "userId": "<id>" }` |
| Expected | 400 Bad Request: no fields to update |
| Status | ☐ |

**TC-031 | Admin List All Users — Positive**
| Steps | GET `/api/users` with admin token |
| Expected | 200 OK, returns array of users |
| Status | ☐ |

**TC-032 | Admin Get User By ID — Positive**
| Steps | GET `/api/users/:id` with admin token |
| Expected | 200 OK, returns user object |
| Status | ☐ |

**TC-033 | Admin Get Non-Existent User — Negative**
| Steps | GET `/api/users/00000000-0000-0000-0000-000000000000` |
| Expected | 404 Not Found |
| Status | ☐ |

**TC-034 | Update Profile Without Token — Negative**
| Steps | PUT `/api/users/profile` without Authorization |
| Expected | 401 Unauthorized |
| Status | ☐ |

---

### Module: SKILLS

**TC-035 | List Skills Public — Positive**
| Steps | GET `/api/skills` without token |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-036 | Create Skill Admin — Positive**
| Steps | POST `/api/skills` with admin token |
| Test Data | `{ "name": "TypeScript" }` |
| Expected | 201 Created, returns skill with id |
| Status | ☐ |

**TC-037 | Create Skill Missing Name — Negative**
| Test Data | `{ "description": "No name" }` |
| Expected | 400 Bad Request |
| Status | ☐ |

**TC-038 | Create Skill Duplicate Name — Negative**
| Steps | Create skill with same name twice |
| Expected | 201 first, 400 second |
| Status | ☐ |

**TC-039 | Create Skill By Non-Admin — Negative**
| Steps | POST `/api/skills` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-040 | Get Skill By ID — Positive**
| Steps | GET `/api/skills/:id` without token |
| Expected | 200 OK, returns skill |
| Status | ☐ |

**TC-041 | Get Non-Existent Skill — Negative**
| Steps | GET `/api/skills/00000000-...` |
| Expected | 404 Not Found |
| Status | ☐ |

**TC-042 | Update Skill Admin — Positive**
| Steps | PUT `/api/skills/:id` with admin token |
| Expected | 200 OK |
| Status | ☐ |

**TC-043 | Update Skill By Non-Admin — Negative**
| Steps | PUT `/api/skills/:id` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-044 | Delete Skill Admin — Positive**
| Steps | DELETE `/api/skills/:id` with admin token |
| Expected | 200 OK |
| Status | ☐ |

**TC-045 | Get Deleted Skill — Negative**
| Steps | GET `/api/skills/:id` after deletion |
| Expected | 404 Not Found |
| Status | ☐ |

**TC-046 | Get Skills By Category — Positive**
| Steps | GET `/api/skills/category/:categoryId` |
| Expected | 200 OK, returns array (may be empty) |
| Status | ☐ |

**TC-047 | Create Skill With Unknown Fields — Negative**
| Test Data | `{ "name": "Valid", "hackedField": "should fail" }` |
| Expected | 400 Bad Request: unknown field rejected |
| Status | ☐ |

---

### Module: MENTORS

**TC-048 | Create Mentor — Positive**
| Steps | POST `/api/mentors` with admin token |
| Test Data | `{ "userId": "<id>", "title": "Senior Dev", "nid": "0123456789", "phone": "01234567890" }` |
| Expected | 201 Created, returns mentor with id |
| Status | ☐ |

**TC-049 | Create Mentor Duplicate NID — Negative**
| Steps | Create mentor with same NID as TC-048 |
| Expected | 400 Bad Request |
| Status | ☐ |

**TC-050 | List Mentors — Positive**
| Steps | GET `/api/mentors` with auth token |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-051 | Update Mentor — Positive**
| Steps | PUT `/api/mentors/:id` with valid fields |
| Expected | 200 OK |
| Status | ☐ |

**TC-052 | Update Mentor Invalid Phone — Negative**
| Test Data | `{ "phone": "abc" }` |
| Expected | 400 Bad Request: invalid phone format |
| Status | ☐ |

**TC-053 | Approve Mentor Admin — Positive**
| Steps | POST `/api/mentors/:id/approve` with admin token |
| Expected | 201 Created |
| Status | ☐ |

**TC-054 | Approve Mentor Non-Admin — Negative**
| Steps | POST `/api/mentors/:id/approve` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-055 | Reject Mentor Admin — Positive**
| Steps | POST `/api/mentors/:id/reject` with reason body |
| Expected | 201 Created |
| Status | ☐ |

**TC-056 | Suspend Mentor Admin — Positive**
| Steps | POST `/api/mentors/:id/suspend` with admin token |
| Expected | 201 Created |
| Status | ☐ |

**TC-057 | Delete Mentor Admin — Positive**
| Steps | DELETE `/api/mentors/:id` with admin token |
| Expected | 200 OK |
| Status | ☐ |

**TC-058 | Approve Non-Existent Mentor — Negative**
| Steps | POST `/api/mentors/0000.../approve` |
| Expected | 404 Not Found |
| Status | ☐ |

---

### Module: MENTEES

**TC-059 | Create Mentee — Positive**
| Steps | POST `/api/mentees` with auth token |
| Test Data | `{ "userId": "<id>", "occupation": "Student", "goals": "Learn coding" }` |
| Expected | 201 Created |
| Status | ☐ |

**TC-060 | List Mentees — Positive**
| Steps | GET `/api/mentees` with auth token |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-061 | Get Mentee By ID — Positive**
| Steps | GET `/api/mentees/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-062 | Update Mentee — Positive**
| Steps | PUT `/api/mentees/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-063 | Delete Mentee Non-Admin — Negative**
| Steps | DELETE `/api/mentees/:id` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-064 | Delete Mentee Admin — Positive**
| Steps | DELETE `/api/mentees/:id` with admin token |
| Expected | 200 OK |
| Status | ☐ |

---

### Module: SESSIONS

**TC-065 | Create Session — Positive**
| Steps | POST `/api/sessions` with mentee token |
| Test Data | `{ "mentorId": "<id>", "menteeId": "<id>", "title": "Career Advice", "scheduledAt": "2026-06-15T14:00:00Z", "duration": 60 }` |
| Expected | 201 Created, returns session with id |
| Status | ☐ |

**TC-066 | Create Session Past Date — Negative**
| Test Data | `{ ... "scheduledAt": "2020-01-01T00:00:00Z" }` |
| Expected | 400 Bad Request: cannot book past date |
| Status | ☐ |

**TC-067 | Create Session Missing Fields — Negative**
| Test Data | `{ "title": "Incomplete" }` |
| Expected | 400 Bad Request |
| Status | ☐ |

**TC-068 | Create Session Duration Too Long — Negative**
| Test Data | `{ ... "duration": 200 }` |
| Expected | 400 Bad Request: max 180 minutes |
| Status | ☐ |

**TC-069 | Create Session Duration Too Short — Negative**
| Test Data | `{ ... "duration": 5 }` |
| Expected | 400 Bad Request: min 15 minutes |
| Status | ☐ |

**TC-070 | List Sessions — Positive**
| Steps | GET `/api/sessions` with auth token |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-071 | Get Session By ID — Positive**
| Steps | GET `/api/sessions/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-072 | Update Session — Positive**
| Steps | PUT `/api/sessions/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-073 | Accept Session By Non-Mentor — Negative**
| Steps | POST `/api/sessions/:id/accept` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-074 | Accept Session Mentor — Positive**
| Steps | POST `/api/sessions/:id/accept` with mentor token |
| Expected | 201 Created |
| Status | ☐ |

**TC-075 | Decline Session By Non-Mentor — Negative**
| Steps | POST `/api/sessions/:id/decline` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-076 | Complete Session — Positive**
| Steps | POST `/api/sessions/:id/complete` |
| Expected | 201 Created |
| Status | ☐ |

**TC-077 | Cancel Session — Positive**
| Steps | POST `/api/sessions/:id/cancel` |
| Expected | 201 Created |
| Status | ☐ |

**TC-078 | No-Show Session — Positive**
| Steps | POST `/api/sessions/:id/no-show` |
| Expected | 201 Created |
| Status | ☐ |

**TC-079 | Cancel Non-Existent Session — Negative**
| Steps | POST `/api/sessions/0000.../cancel` |
| Expected | 404 Not Found |
| Status | ☐ |

**TC-080 | Delete Session — Positive**
| Steps | DELETE `/api/sessions/:id` |
| Expected | 200 OK |
| Status | ☐ |

---

### Module: MATCHINGS

**TC-081 | Create Matching Admin — Positive**
| Steps | POST `/api/matchings` with admin token |
| Expected | 201 Created |
| Status | ☐ |

**TC-082 | Create Matching By Non-Admin — Negative**
| Steps | POST `/api/matchings` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-083 | List Matchings — Positive**
| Steps | GET `/api/matchings` |
| Expected | 200 OK |
| Status | ☐ |

**TC-084 | Get Matching By ID — Positive**
| Steps | GET `/api/matchings/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-085 | Update Matching — Positive**
| Steps | PUT `/api/matchings/:id` with status |
| Expected | 200 OK |
| Status | ☐ |

**TC-086 | Delete Matching Admin — Positive**
| Steps | DELETE `/api/matchings/:id` with admin token |
| Expected | 200 OK |
| Status | ☐ |

---

### Module: FEEDBACK

**TC-087 | Submit Feedback — Positive**
| Steps | POST `/api/feedback` with mentee token |
| Test Data | `{ "mentorId": "<id>", "menteeId": "<id>", "rating": 5, "comment": "Great!", "isAnonymous": false }` |
| Expected | 201 Created |
| Status | ☐ |

**TC-088 | Submit Feedback Rating > 5 — Negative**
| Test Data | `{ ..., "rating": 10 }` |
| Expected | 400 Bad Request: max 5 |
| Status | ☐ |

**TC-089 | Submit Feedback Rating < 1 — Negative**
| Test Data | `{ ..., "rating": 0 }` |
| Expected | 400 Bad Request: min 1 |
| Status | ☐ |

**TC-090 | Submit Feedback Missing Rating — Negative**
| Test Data | `{ "mentorId": "<id>", "menteeId": "<id>" }` |
| Expected | 400 Bad Request |
| Status | ☐ |

**TC-091 | List Feedback — Positive**
| Steps | GET `/api/feedback` |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-092 | Get Feedback By ID — Positive**
| Steps | GET `/api/feedback/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-093 | Get Feedback By Mentor — Positive**
| Steps | GET `/api/feedback/mentor/:mentorId` |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-094 | Update Feedback — Positive**
| Steps | PUT `/api/feedback/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-095 | Delete Feedback — Positive**
| Steps | DELETE `/api/feedback/:id` |
| Expected | 200 OK |
| Status | ☐ |

---

### Module: NOTIFICATIONS

**TC-096 | Create Notification Admin — Positive**
| Steps | POST `/api/notifications` with admin token |
| Expected | 201 Created |
| Status | ☐ |

**TC-097 | Create Notification By Non-Admin — Negative**
| Steps | POST `/api/notifications` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-098 | List Notifications — Positive**
| Steps | GET `/api/notifications` |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-099 | Get Notification By ID — Positive**
| Steps | GET `/api/notifications/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-100 | Get Unread Count — Positive**
| Steps | GET `/api/notifications/unread` |
| Expected | 200 OK, returns count |
| Status | ☐ |

**TC-101 | Mark Notification As Read — Positive**
| Steps | PUT `/api/notifications/:id/read` |
| Expected | 200 OK |
| Status | ☐ |

**TC-102 | Delete Notification — Positive**
| Steps | DELETE `/api/notifications/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-103 | Delete Non-Existent Notification — Negative**
| Steps | DELETE `/api/notifications/0000...` |
| Expected | 404 Not Found |
| Status | ☐ |

---

### Module: ADMIN

**TC-104 | Get Dashboard Stats — Positive**
| Steps | GET `/api/admin/dashboard` with admin token |
| Expected | 200 OK, returns stats object |
| Status | ☐ |

**TC-105 | Admin List Users — Positive**
| Steps | GET `/api/admin/users` |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-106 | Admin List Mentors — Positive**
| Steps | GET `/api/admin/mentors` |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-107 | Admin List Mentees — Positive**
| Steps | GET `/api/admin/mentees` |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-108 | Deactivate User — Positive**
| Steps | POST `/api/admin/users/:id/deactivate` |
| Expected | 201 Created |
| Status | ☐ |

**TC-109 | Deactivate Non-Existent User — Negative**
| Steps | POST `/api/admin/users/0000.../deactivate` |
| Expected | 404 Not Found |
| Status | ☐ |

**TC-110 | Reset User Password Admin — Positive**
| Steps | POST `/api/admin/users/:id/reset-password` with `{ "password": "newPass" }` |
| Expected | 201 Created |
| Status | ☐ |

**TC-111 | Delete Feedback Moderation — Positive**
| Steps | DELETE `/api/admin/feedback/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-112 | Delete User Admin — Positive**
| Steps | DELETE `/api/admin/users/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-113 | Delete Non-Existent User — Negative**
| Steps | DELETE `/api/admin/users/0000...` |
| Expected | 404 Not Found |
| Status | ☐ |

---

### Module: ACTIVITY LOGS

**TC-114 | List Activity Logs — Positive**
| Steps | GET `/api/activity-logs` with admin token |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-115 | Get Activity Log By ID — Positive**
| Steps | GET `/api/activity-logs/:id` |
| Expected | 200 OK |
| Status | ☐ |

**TC-116 | Create Activity Log — Positive**
| Steps | POST `/api/activity-logs` with admin token |
| Expected | 201 Created |
| Status | ☐ |

**TC-117 | List Activity Logs Non-Admin — Negative**
| Steps | GET `/api/activity-logs` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

---

### Module: RESOURCES

**TC-118 | Create Resource Mentor — Positive**
| Steps | POST `/api/resources` with mentor token |
| Test Data | `{ "mentorId": "<id>", "title": "Guide", "type": "document", "fileUrl": "https://..." }` |
| Expected | 201 Created |
| Status | ☐ |

**TC-119 | Create Resource By Non-Mentor — Negative**
| Steps | POST `/api/resources` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-120 | Create Resource Missing Title — Negative**
| Test Data | `{ "mentorId": "<id>" }` |
| Expected | 400 Bad Request |
| Status | ☐ |

**TC-121 | Get Resources Public — Positive**
| Steps | GET `/api/resources/:mentorId` without token |
| Expected | 200 OK, returns array |
| Status | ☐ |

**TC-122 | Delete Resource Mentor — Positive**
| Steps | DELETE `/api/resources/:id` with mentor token |
| Expected | 200 OK |
| Status | ☐ |

**TC-123 | Delete Non-Existent Resource — Negative**
| Steps | DELETE `/api/resources/0000...` |
| Expected | 404 Not Found |
| Status | ☐ |

---

### Module: AVAILABILITY

**TC-124 | Get Mentor Availability Public — Positive**
| Steps | GET `/api/availabilities/:mentorId` without token |
| Expected | 200 OK |
| Status | ☐ |

**TC-125 | Get Slots By Date Public — Positive**
| Steps | GET `/api/availabilities/:mentorId/slots?date=2026-06-15` |
| Expected | 200 OK |
| Status | ☐ |

**TC-126 | Set Availability Mentor — Positive**
| Steps | POST `/api/availabilities` with mentor token |
| Test Data | `{ "mentorId": "<id>", "date": "2026-06-15", "startTime": "09:00", "endTime": "17:00" }` |
| Expected | 201 Created |
| Status | ☐ |

**TC-127 | Set Availability Non-Mentor — Negative**
| Steps | POST `/api/availabilities` with mentee token |
| Expected | 403 Forbidden |
| Status | ☐ |

**TC-128 | Update Availability Mentor — Positive**
| Steps | PUT `/api/availabilities/:id` with mentor token |
| Expected | 200 OK |
| Status | ☐ |

**TC-129 | Delete Availability Mentor — Positive**
| Steps | DELETE `/api/availabilities/:id` with mentor token |
| Expected | 200 OK |
| Status | ☐ |

**TC-130 | Block Date Mentor — Positive**
| Steps | POST `/api/availabilities/block` with mentor token |
| Expected | 201 Created |
| Status | ☐ |

---

## 📊 Test Summary Report

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST SUMMARY REPORT                       │
├─────────────────────────────────────────────────────────────┤
│ Project:        Mentor Management System (MMS)              │
│ Test Date:      [YYYY-MM-DD]                                │
│ Tester:         [Name]                                      │
│ Environment:    [Development / Staging / Production]        │
├─────────────────────────────────────────────────────────────┤
│ Total Test Cases:    130                                    │
│ ✅ Passed:           [Count]                                │
│ ❌ Failed:           [Count]                                │
│ ⏳ Pending:          [Count]                                │
│ ├───────────────────────────────────────────────────────────┤
│ Pass Rate:          [%]                                     │
│ Fail Rate:          [%]                                     │
├─────────────────────────────────────────────────────────────┤
│ Module-wise Results:                                        │
│   Auth:                ✅ 20/20                             │
│   Auth Guard:          ✅ 7/7                               │
│   Users:               ✅ 7/7                               │
│   Skills:              ✅ 13/13                             │
│   Mentors:             ✅ 11/11                             │
│   Mentees:             ✅ 6/6                               │
│   Sessions:            ✅ 16/16                             │
│   Matchings:           ✅ 6/6                               │
│   Feedback:            ✅ 9/9                               │
│   Notifications:       ✅ 8/8                               │
│   Admin:               ✅ 10/10                             │
│   Activity Logs:       ✅ 4/4                               │
│   Resources:           ✅ 6/6                               │
│   Availability:        ✅ 7/7                               │
├─────────────────────────────────────────────────────────────┤
│ Failed Test Cases:                                          │
│   TC-XXX: [Bug description] — BUG-001                       │
│   TC-YYY: [Bug description] — BUG-002                       │
├─────────────────────────────────────────────────────────────┤
│ Notes:                                                      │
│ [Any observations, environment issues, blockers]            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐛 Bug Report Template

```
┌─────────────────────────────────────────────────────────────┐
│                    BUG REPORT                                │
├─────────────────────────────────────────────────────────────┤
│ Bug ID:        BUG-XXX                                      │
│ Found By:      [Name]                                       │
│ Found Date:    [YYYY-MM-DD]                                 │
│ Module:        [Module name]                                │
│ Severity:      [Critical / Major / Minor / Trivial]         │
│ Status:        [Open / In Progress / Fixed / Closed]        │
├─────────────────────────────────────────────────────────────┤
│ Title:                                                      │
│ [Short description of the bug]                               │
│                                                             │
│ Description:                                                 │
│ [Detailed description]                                       │
│                                                             │
│ Steps to Reproduce:                                          │
│ 1. [Step 1]                                                  │
│ 2. [Step 2]                                                  │
│ 3. [Step 3]                                                  │
│                                                             │
│ Expected Result:                                             │
│ [What should happen]                                         │
│                                                             │
│ Actual Result:                                               │
│ [What actually happened]                                     │
│                                                             │
│ Screenshot / Logs:                                           │
│ [Attach screenshot or error log]                             │
│                                                             │
│ Environment:                                                 │
│ - OS: [Windows/Mac/Linux]                                   │
│ - Browser: [Chrome/Firefox/API Client]                      │
│ - API URL: [http://localhost:3000]                          │
│                                                             │
│ Assigned To:    [Developer name]                             │
│ Fixed Date:     [YYYY-MM-DD]                                │
│ Fix Commit:     [Commit hash]                               │
└─────────────────────────────────────────────────────────────┘
```
