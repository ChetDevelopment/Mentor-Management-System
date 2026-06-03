# Task Per Member — Postman Testing

---

## 👤 Nita

### What to test (in order):
1. **Health** → `GET /health`
2. **Auth** → Register (admin, mentor, mentee), Login, Forgot/Reset Password, Logout, Refresh Token, Verify Email
3. **Auth Guard** → Access without token, bad token, wrong role
4. **Users** → Get/Update Profile, Admin: List/Get/Update/Delete Users
5. **Mentors** → List, Get, Create, Update, Approve, Reject, Suspend, Delete
6. **Admin** → Dashboard, List Users/Mentors/Mentees, Deactivate, Reset Password, Delete User
7. **Activity Logs** → List, Get, Create

### How to test:
- Open Postman → `postman_collection.json`
- Click **Auth** folder → Register one **admin**, one **mentor**, one **mentee**
- Login each → copy tokens to `admin_token`, `mentor_token`, `mentee_token`
- Run folders in the order above
- For each endpoint: test **positive case** (valid data → success) and **negative case** (invalid data → error)

### Deliverable:
In `MISSING_A_NITA.md`, add this table and fill it:

| TC# | Endpoint | Result (✅/❌) | Bug? |
|-----|----------|---------------|------|
| TC-001 | POST /auth/register (admin) | | |
| TC-002 | POST /auth/register (mentor) | | |
| TC-003 | POST /auth/register (mentee) | | |
| TC-004-008 | Auth negative tests | | |
| TC-009-012 | Login tests | | |
| TC-013-018 | Forgot/Reset password | | |
| TC-019-020 | Logout, Refresh | | |
| TC-021-027 | Auth guard tests | | |
| TC-028-034 | Users CRUD | | |
| TC-048-058 | Mentors CRUD + approve/reject/suspend | | |
| TC-104-113 | Admin endpoints | | |
| TC-114-117 | Activity logs | | |

---

## 👤 Trea

### What to test (in order):
1. **Mentees** → List, Get, Create, Update, Delete
2. **Sessions** → Create, List, Get, Update, Accept (mentor), Decline (mentor), Complete, Cancel, No-Show, Delete
3. **Matchings** → Recommended Mentors, List, Get, Create (admin), Update, Delete (admin)
4. **Feedback** → Create, List, Get, GetByMentor, Update, Respond (mentor), Delete
5. **Messages** → Send, Conversations, Thread, Mark Read

### How to test:
- Use the tokens Nita created (or create your own)
- Run folders in order
- For **Sessions**: create a session with mentee token → switch to mentor token to accept/decline → complete/cancel/no-show
- For **Feedback**: submit feedback as mentee → respond as mentor
- For **Messages**: send message between two users → check conversation thread → mark as read

### Deliverable:
In `MISSING_B_TREA.md`, add this table and fill it:

| TC# | Endpoint | Result (✅/❌) | Bug? |
|-----|----------|---------------|------|
| TC-059-064 | Mentees CRUD | | |
| TC-065-069 | Create session (positive + negative) | | |
| TC-070-072 | List, Get, Update session | | |
| TC-073-075 | Accept/Decline (mentor-only check) | | |
| TC-076-080 | Complete, Cancel, No-Show, Delete | | |
| TC-081-086 | Matchings CRUD | | |
| TC-087-090 | Create feedback (positive + negative) | | |
| TC-091-095 | List, Get, Update, Respond, Delete | | |
| Messages | Send, Conversations, Thread, Mark Read | | |

---

## 👤 Vichet

### What to test (in order):
1. **Health** → `GET /health`
2. **Skills** → List (public), Get, GetByCategory, Create (admin), Update (admin), Delete (admin)
3. **Categories** → List (public), Get, Create (admin), Update (admin), Delete (admin)
4. **Notifications** → Get, Unread, Detail, Create (admin), Mark Read, Mark All Read, Delete
5. **Resources** → Get By Mentor (public), Upload (mentor only), Delete (mentor only)
6. **Availability** → Get (public), Slots (public), Set (mentor), Update (mentor), Delete (mentor), Block Date (mentor), Unblock Date (mentor)

### How to test:
- Public endpoints: test **without any token**
- Admin endpoints: use `admin_token`
- Mentor endpoints: use `mentor_token`
- For **Availability**: set schedule → get slots by date → update → block a date → unblock → delete

### Deliverable:
In `MISSING_C_VICHET.md`, add this table and fill it:

| TC# | Endpoint | Result (✅/❌) | Bug? |
|-----|----------|---------------|------|
| TC-035-038 | Skills create (positive + duplicate) | | |
| TC-039 | Create skill by non-admin (❌ expected) | | |
| TC-040-041 | Get skill by ID + non-existent | | |
| TC-042-047 | Update, Delete, GetByCategory | | |
| Categories | CRUD (same pattern as Skills) | | |
| TC-096-097 | Create notification (admin + non-admin) | | |
| TC-098-103 | List, Get, Unread, Mark Read, Delete | | |
| TC-118-120 | Create resource (mentor + non-mentor + missing fields) | | |
| TC-121-123 | Get resources public, Delete, Delete non-existent | | |
| TC-124-125 | Get availability, Get slots (public) | | |
| TC-126-127 | Set availability (mentor + non-mentor) | | |
| TC-128-130 | Update, Delete, Block date | | |

---

## Bug Report Format

If something fails, write it at the bottom of your `MISSING_*.md`:

```
## Bug Found
- **TC:** TC-XXX
- **Endpoint:** POST /api/v1/...
- **What I did:** [request body]
- **Expected:** [status code, response]
- **Actual:** [status code, response]
- **Severity:** Critical / Major / Minor
```
