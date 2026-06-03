# 🧪 Postman Testing Task Assignment — Mentor Management System

Each member tests their assigned modules, logs results in the TC table below, and reports bugs found.

---

## Setup (Everyone)

1. Import `postman_collection.json` into Postman
2. Set `base_url` variable to `http://localhost:3000/api/v1`
3. Start the backend on localhost:3000
4. Register accounts: **1 admin**, **1 mentor**, **1 mentee** via Auth folder in Postman
5. Copy each token into `admin_token`, `mentor_token`, `mentee_token` variables

---

## Assignment

### Nita — Auth + Users + Mentors + Admin + Activity Logs

**Run these Postman folders in order:**

| # | Folder | Key Endpoints | Test Cases |
|---|--------|---------------|------------|
| 1 | **Auth** | Register (3 roles), Login, Forgot/Reset Password, Logout, Refresh Token, Verify Email, Resend Verification | TC-001 to TC-020 |
| 2 | **Auth Guard** | Access without token, bad token, wrong role accessing admin routes | TC-021 to TC-027 |
| 3 | **Users** | Get/Update Profile, List/Get/Update/Delete Users (admin) | TC-028 to TC-034 |
| 4 | **Mentors** | Create, List, Get, Update, Approve, Reject, Suspend, Delete | TC-048 to TC-058 |
| 5 | **Admin** | Dashboard, List Users/Mentors/Mentees, Deactivate, Reset Password, Delete | TC-104 to TC-113 |
| 6 | **Activity Logs** | List, Get, Create | TC-114 to TC-117 |

**Report:** Copy rows below into your report file `MISSING_A_NITA.md`

```
| TC# | Module | Test Description | Status (✅/❌) | Bug ID |
|-----|--------|------------------|-----------------|--------|
```

---

### Trea — Mentees + Sessions + Matchings + Feedback + Messages

**Run these Postman folders in order:**

| # | Folder | Key Endpoints | Test Cases |
|---|--------|---------------|------------|
| 1 | **Mentees** | Create, List, Get, Update, Delete | TC-059 to TC-064 |
| 2 | **Sessions** | Create, List, Get, Update, Accept, Decline, Complete, Cancel, No-Show, Delete | TC-065 to TC-080 |
| 3 | **Matchings** | Recommended Mentors, List, Get, Create, Update, Delete | TC-081 to TC-086 |
| 4 | **Feedback** | Create, List, Get, GetByMentor, Update, Respond, Delete | TC-087 to TC-095 |
| 5 | **Messages** | Send, Conversations List, Thread, Mark Read | (manual — test with different user tokens) |

**Report:** Copy rows below into your report file `MISSING_B_TREA.md`

```
| TC# | Module | Test Description | Status (✅/❌) | Bug ID |
|-----|--------|------------------|-----------------|--------|
```

---

### Vichet — Skills + Categories + Notifications + Resources + Availability + Health

**Run these Postman folders in order:**

| # | Folder | Key Endpoints | Test Cases |
|---|--------|---------------|------------|
| 1 | **Health** | `GET /health` — check server is running | — |
| 2 | **Skills** | List (public), Get, GetByCategory, Create, Update, Delete (admin) | TC-035 to TC-047 |
| 3 | **Categories** | List (public), Get, Create, Update, Delete (admin) | (use skill TC pattern) |
| 4 | **Notifications** | Get, Unread, Detail, Create (admin), Mark Read, Mark All Read, Delete | TC-096 to TC-103 |
| 5 | **Resources** | Get By Mentor (public), Upload (mentor), Delete (mentor) | TC-118 to TC-123 |
| 6 | **Availability** | Get, Slots (public), Set (mentor), Update, Delete, Block, Unblock | TC-124 to TC-130 |

**Report:** Copy rows below into your report file `MISSING_C_VICHET.md`

```
| TC# | Module | Test Description | Status (✅/❌) | Bug ID |
|-----|--------|------------------|-----------------|--------|
```

---

## Bug Reporting Template

When you find a bug, log it in your report file:

```
| TC-XXX | [Module] | [What failed] | ❌ | BUG-001 |
```

Then create a full bug description at the bottom of your file:

```
## BUG-001: [Short Title]
- **Module:** [Module name]
- **Steps:** 1. ..., 2. ..., 3. ...
- **Expected:** [what should happen]
- **Actual:** [what happened instead]
- **Severity:** Critical / Major / Minor
```

---

## Summary Table (fill after testing)

| Module | Total TCs | Passed | Failed | Tester |
|--------|-----------|--------|--------|--------|
| Auth | 20 | | | Nita |
| Auth Guard | 7 | | | Nita |
| Users | 7 | | | Nita |
| Mentors | 11 | | | Nita |
| Admin | 10 | | | Nita |
| Activity Logs | 4 | | | Nita |
| Mentees | 6 | | | Trea |
| Sessions | 16 | | | Trea |
| Matchings | 6 | | | Trea |
| Feedback | 9 | | | Trea |
| Messages | 4 | | | Trea |
| Skills | 13 | | | Vichet |
| Categories | 5 | | | Vichet |
| Notifications | 8 | | | Vichet |
| Resources | 6 | | | Vichet |
| Availability | 7 | | | Vichet |
| Health | 1 | | | Vichet |
| **TOTAL** | **130** | | | |
