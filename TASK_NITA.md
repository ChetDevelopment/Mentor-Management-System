# 🧪 Nita — Postman Testing Task

## Setup
1. Open Postman → File → Import → select `postman_collection.json`
2. Set variable `base_url` = `http://localhost:3000/api/v1`
3. Make sure backend is running on localhost:3000
4. **Register 3 accounts** (Auth folder) and save tokens:

| Role | Email | Password | Postman Variable |
|------|-------|----------|-----------------|
| Admin | admin@test.com | Pass123! | `admin_token` |
| Mentor | mentor@test.com | Pass123! | `mentor_token` |
| Mentee | mentee@test.com | Pass123! | `mentee_token` |

---

## Test Sequence

### 1. Health
| Method | Endpoint | Token | What to Check |
|--------|----------|-------|---------------|
| GET | `/health` | None | Returns `{ status: "ok" }` |

### 2. Auth
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Register admin | POST | `/auth/register` | `{ "email":"admin@test.com","password":"Pass123!","firstName":"Admin","lastName":"User","role":"admin" }` | 201 + token |
| ✅ | Register mentor | POST | `/auth/register` | `{ "email":"mentor@test.com","password":"Pass123!","firstName":"Mentor","lastName":"User","role":"mentor" }` | 201 |
| ✅ | Register mentee | POST | `/auth/register` | `{ "email":"mentee@test.com","password":"Pass123!","firstName":"Mentee","lastName":"User","role":"mentee" }` | 201 |
| ✅ | Duplicate email | POST | `/auth/register` | same as admin | 400 |
| ✅ | Missing fields | POST | `/auth/register` | `{ "email":"x@y.com" }` | 400 |
| ✅ | Weak password | POST | `/auth/register` | `{ "email":"w@t.com","password":"12","firstName":"A","lastName":"B","role":"mentee" }` | 400 |
| ✅ | Invalid email | POST | `/auth/register` | `{ "email":"bad","password":"Pass123!","firstName":"A","lastName":"B","role":"mentee" }` | 400 |
| ✅ | Invalid role | POST | `/auth/register` | `{ "email":"x@y.com","password":"Pass123!","firstName":"A","lastName":"B","role":"superadmin" }` | 400 |
| ✅ | Login success | POST | `/auth/login` | `{ "email":"admin@test.com","password":"Pass123!" }` | 200 + token |
| ✅ | Wrong password | POST | `/auth/login` | `{ "email":"admin@test.com","password":"Wrong!" }` | 401 |
| ✅ | Non-existent email | POST | `/auth/login` | `{ "email":"ghost@test.com","password":"Pass123!" }` | 401 |
| ✅ | Missing fields | POST | `/auth/login` | `{ "email":"admin@test.com" }` | 400 |
| ✅ | Forgot password | POST | `/auth/forgot-password` | `{ "email":"admin@test.com" }` | 201 |
| ✅ | Forgot non-existent | POST | `/auth/forgot-password` | `{ "email":"ghost@test.com" }` | 400 |
| ✅ | Reset password | POST | `/auth/reset-password` | `{ "token":"<from_forgot>","password":"NewPass123!" }` | 201 |
| ✅ | Login new password | POST | `/auth/login` | `{ "email":"admin@test.com","password":"NewPass123!" }` | 200 |
| ✅ | Reset invalid token | POST | `/auth/reset-password` | `{ "token":"bad","password":"NewPass123!" }` | 400 |
| ✅ | Reset weak password | POST | `/auth/reset-password` | `{ "token":"any","password":"12" }` | 400 |
| ✅ | Logout | POST | `/auth/logout` | — with Bearer token | 201 |
| ✅ | Refresh token | POST | `/auth/refresh-token` | — with Bearer token | 201 |

### 3. Auth Guard (Security)
| TC | Test | Method | Endpoint | Token | Expected |
|----|------|--------|---------|-------|----------|
| ✅ | No token | GET | `/users/profile` | None | 401 |
| ✅ | Malformed token | GET | `/users/profile` | `Bearer invalid` | 401 |
| ✅ | Empty bearer | GET | `/users/profile` | `Bearer ` | 401 |
| ✅ | Public route OK | GET | `/skills` | None | 200 |
| ✅ | Admin route as mentee | GET | `/admin/dashboard` | `mentee_token` | 403 |
| ✅ | Admin route as mentor | GET | `/users` | `mentor_token` | 403 |
| ✅ | Mentor route as mentee | POST | `/mentors/:id/approve` | `mentee_token` | 403 |

### 4. Users
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Get own profile | GET | `/users/profile` | `{ "userId":"<id>" }` | 200 |
| ✅ | Update profile | PUT | `/users/profile` | `{ "userId":"<id>","firstName":"Updated" }` | 200 |
| ✅ | Update empty body | PUT | `/users/profile` | `{ "userId":"<id>" }` | 400 |
| ✅ | Admin list users | GET | `/users` | — with `admin_token` | 200 |
| ✅ | Admin get user | GET | `/users/:id` | — with `admin_token` | 200 |
| ✅ | Get non-existent | GET | `/users/0000-0000...` | — with `admin_token` | 404 |
| ✅ | Update no token | PUT | `/users/profile` | None | 401 |

### 5. Mentors
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Create mentor | POST | `/mentors` | `{ "userId":"<id>","title":"Senior Dev","nid":"0123456789","phone":"01234567890" }` | 201 |
| ✅ | Duplicate NID | POST | `/mentors` | same NID as above | 400 |
| ✅ | List mentors | GET | `/mentors` | — | 200 |
| ✅ | Update mentor | PUT | `/mentors/:id` | `{ "title":"Lead Dev" }` | 200 |
| ✅ | Update invalid phone | PUT | `/mentors/:id` | `{ "phone":"abc" }` | 400 |
| ✅ | Approve mentor | POST | `/mentors/:id/approve` | — with `admin_token` | 201 |
| ✅ | Approve non-admin | POST | `/mentors/:id/approve` | — with `mentee_token` | 403 |
| ✅ | Reject mentor | POST | `/mentors/:id/reject` | `{ "reason":"Incomplete profile" }` | 201 |
| ✅ | Suspend mentor | POST | `/mentors/:id/suspend` | — with `admin_token` | 201 |
| ✅ | Delete mentor | DELETE | `/mentors/:id` | — with `admin_token` | 200 |
| ✅ | Approve non-existent | POST | `/mentors/0000-0000/approve` | — with `admin_token` | 404 |

### 6. Admin
| TC | Test | Method | Endpoint | Expected |
|----|------|--------|---------|----------|
| ✅ | Dashboard stats | GET | `/admin/dashboard` | 200 |
| ✅ | List users | GET | `/admin/users` | 200 |
| ✅ | List mentors | GET | `/admin/mentors` | 200 |
| ✅ | List mentees | GET | `/admin/mentees` | 200 |
| ✅ | Deactivate user | POST | `/admin/users/:id/deactivate` | 201 |
| ✅ | Deactivate non-existent | POST | `/admin/users/0000-0000/deactivate` | 404 |
| ✅ | Reset user password | POST | `/admin/users/:id/reset-password` | 201 |
| ✅ | Moderate feedback | DELETE | `/admin/feedback/:id` | 200 |
| ✅ | Delete user | DELETE | `/admin/users/:id` | 200 |
| ✅ | Delete non-existent | DELETE | `/admin/users/0000-0000` | 404 |

### 7. Activity Logs
| TC | Test | Method | Endpoint | Token | Expected |
|----|------|--------|---------|-------|----------|
| ✅ | List logs | GET | `/activity-logs` | `admin_token` | 200 |
| ✅ | Get log by ID | GET | `/activity-logs/:id` | `admin_token` | 200 |
| ✅ | Create log | POST | `/activity-logs` | `admin_token` | 201 |
| ✅ | List as non-admin | GET | `/activity-logs` | `mentee_token` | 403 |

---

## Bug Report
If any test fails, note it here:

| TC# | Endpoint | What happened | Expected | Severity |
|-----|----------|---------------|----------|----------|
| | | | | |
