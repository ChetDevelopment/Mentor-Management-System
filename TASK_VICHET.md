# 🧪 Vichet — Postman Testing Task

## Setup
1. Open Postman → File → Import → select `postman_collection.json`
2. Set variable `base_url` = `http://localhost:3000/api/v1`
3. Make sure backend is running on localhost:3000
4. Get tokens from Nita (or register your own in Auth folder):
   - `admin_token` → admin@test.com / Pass123!
   - `mentor_token` → mentor@test.com / Pass123!
   - `mentee_token` → mentee@test.com / Pass123!

---

## Test Sequence

### 1. Health
| TC | Test | Method | Endpoint | Token | Expected |
|----|------|--------|---------|-------|----------|
| ✅ | Health check | GET | `/health` | None | `{ "status":"ok" }` |

### 2. Skills
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | List public | GET | `/skills` | — | 200 |
| ✅ | Create skill | POST | `/skills` | `{ "name":"TypeScript" }` with `admin_token` | 201 |
| ✅ | Duplicate name | POST | `/skills` | `{ "name":"TypeScript" }` with `admin_token` | 400 |
| ✅ | Missing name | POST | `/skills` | `{}` with `admin_token` | 400 |
| ✅ | Create by non-admin | POST | `/skills` | `{ "name":"Rust" }` with `mentee_token` | 403 |
| ✅ | Get by ID | GET | `/skills/:id` | — | 200 |
| ✅ | Get non-existent | GET | `/skills/0000-0000` | — | 404 |
| ✅ | Update skill | PUT | `/skills/:id` | `{ "name":"TypeScript Pro" }` with `admin_token` | 200 |
| ✅ | Update by non-admin | PUT | `/skills/:id` | with `mentee_token` | 403 |
| ✅ | Delete skill | DELETE | `/skills/:id` | with `admin_token` | 200 |
| ✅ | Get deleted skill | GET | `/skills/:id` | after delete | 404 |
| ✅ | Get by category | GET | `/skills/category/:categoryId` | — | 200 |
| ✅ | Unknown field | POST | `/skills` | `{ "name":"Valid","hackedField":"x" }` with `admin_token` | 400 |

### 3. Categories
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | List public | GET | `/categories` | — | 200 |
| ✅ | Get by ID | GET | `/categories/:id` | — | 200 |
| ✅ | Create category | POST | `/categories` | `{ "name":"Programming" }` with `admin_token` | 201 |
| ✅ | Update category | PUT | `/categories/:id` | `{ "name":"Coding" }` with `admin_token` | 200 |
| ✅ | Delete category | DELETE | `/categories/:id` | with `admin_token` | 200 |
| ✅ | Create by non-admin | POST | `/categories` | with `mentee_token` | 403 |

### 4. Notifications
| TC | Test | Method | Endpoint | Body / Token | Expected |
|----|------|--------|---------|-------------|----------|
| ✅ | Create by admin | POST | `/notifications` | `{ "userId":"<id>","title":"Test","message":"Hello" }` with `admin_token` | 201 |
| ✅ | Create by non-admin | POST | `/notifications` | same with `mentee_token` | 403 |
| ✅ | List notifications | GET | `/notifications/:userId` | with any token | 200 |
| ✅ | Get detail | GET | `/notifications/detail/:id` | with any token | 200 |
| ✅ | Get unread | GET | `/notifications/unread/:userId` | with any token | 200 |
| ✅ | Mark as read | PUT | `/notifications/:id/read` | with any token | 200 |
| ✅ | Mark all read | PUT | `/notifications/read-all/:userId` | with any token | 200 |
| ✅ | Delete notification | DELETE | `/notifications/:id` | with any token | 200 |
| ✅ | Delete non-existent | DELETE | `/notifications/0000-0000` | with any token | 404 |

### 5. Resources
| TC | Test | Method | Endpoint | Body / Token | Expected |
|----|------|--------|---------|-------------|----------|
| ✅ | Upload by mentor | POST | `/resources` | `{ "mentorId":"<id>","title":"Guide","type":"document","fileUrl":"https://example.com/doc.pdf" }` with `mentor_token` | 201 |
| ✅ | Upload by non-mentor | POST | `/resources` | same with `mentee_token` | 403 |
| ✅ | Missing title | POST | `/resources` | `{ "mentorId":"<id>" }` with `mentor_token` | 400 |
| ✅ | Get public | GET | `/resources/:mentorId` | None | 200 |
| ✅ | Delete by mentor | DELETE | `/resources/:id` | with `mentor_token` | 200 |
| ✅ | Delete non-existent | DELETE | `/resources/0000-0000` | with `mentor_token` | 404 |

### 6. Availability
| TC | Test | Method | Endpoint | Body / Token | Expected |
|----|------|--------|---------|-------------|----------|
| ✅ | Get public | GET | `/availabilities/:mentorId` | None | 200 |
| ✅ | Get slots by date | GET | `/availabilities/:mentorId/slots?date=2026-07-15` | None | 200 |
| ✅ | Set availability | POST | `/availabilities` | `{ "mentorId":"<id>","date":"2026-07-15","startTime":"09:00","endTime":"17:00" }` with `mentor_token` | 201 |
| ✅ | Set by non-mentor | POST | `/availabilities` | same with `mentee_token` | 403 |
| ✅ | Update availability | PUT | `/availabilities/:id` | `{ "startTime":"10:00" }` with `mentor_token` | 200 |
| ✅ | Delete availability | DELETE | `/availabilities/:id` | with `mentor_token` | 200 |
| ✅ | Block date | POST | `/availabilities/block` | `{ "mentorId":"<id>","date":"2026-07-16" }` with `mentor_token` | 201 |
| ✅ | Unblock date | DELETE | `/availabilities/block/:id` | with `mentor_token` | 200 |

---

## 💡 Important Notes

- **Public endpoints** (Health, Skills list, Categories list, Resources get, Availability get/slots) → test **without any token**
- **Admin endpoints** (Skills/Categories create/update/delete) → use `admin_token`
- **Mentor endpoints** (Resources upload/delete, Availability set/update/delete/block) → use `mentor_token`

---

## Bug Report
If any test fails, note it here:

| TC# | Endpoint | What happened | Expected | Severity |
|-----|----------|---------------|----------|----------|
| | | | | |
