# 🧪 Trea — Postman Testing Task

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

### 1. Mentees
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Create mentee | POST | `/mentees` | `{ "userId":"<id>","occupation":"Student","goals":"Learn coding" }` | 201 |
| ✅ | List mentees | GET | `/mentees` | — | 200 |
| ✅ | Get mentee by ID | GET | `/mentees/:id` | — | 200 |
| ✅ | Update mentee | PUT | `/mentees/:id` | `{ "goals":"Become a developer" }` | 200 |
| ✅ | Delete by non-admin | DELETE | `/mentees/:id` | — with `mentee_token` | 403 |
| ✅ | Delete by admin | DELETE | `/mentees/:id` | — with `admin_token` | 200 |

### 2. Sessions
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Create session | POST | `/sessions` | `{ "mentorId":"<id>","menteeId":"<id>","title":"Career Advice","scheduledAt":"2026-07-15T14:00:00Z","duration":60 }` | 201 |
| ✅ | Past date | POST | `/sessions` | same but `scheduledAt":"2020-01-01T00:00:00Z"` | 400 |
| ✅ | Missing fields | POST | `/sessions` | `{ "title":"Incomplete" }` | 400 |
| ✅ | Duration too long | POST | `/sessions` | add `"duration":200` | 400 |
| ✅ | Duration too short | POST | `/sessions` | add `"duration":5` | 400 |
| ✅ | List sessions | GET | `/sessions` | — | 200 |
| ✅ | Get session by ID | GET | `/sessions/:id` | — | 200 |
| ✅ | Update session | PUT | `/sessions/:id` | `{ "title":"Updated Title" }` | 200 |
| ✅ | Accept by non-mentor | POST | `/sessions/:id/accept` | with `mentee_token` | 403 |
| ✅ | Accept by mentor | POST | `/sessions/:id/accept` | with `mentor_token` | 201 |
| ✅ | Decline by non-mentor | POST | `/sessions/:id/decline` | with `mentee_token` | 403 |
| ✅ | Complete session | POST | `/sessions/:id/complete` | — | 201 |
| ✅ | Cancel session | POST | `/sessions/:id/cancel` | — | 201 |
| ✅ | No-show session | POST | `/sessions/:id/no-show` | — | 201 |
| ✅ | Cancel non-existent | POST | `/sessions/0000-0000/cancel` | — | 404 |
| ✅ | Delete session | DELETE | `/sessions/:id` | — | 200 |

### 3. Matchings
| TC | Test | Method | Endpoint | Token | Expected |
|----|------|--------|---------|-------|----------|
| ✅ | Create matching | POST | `/matchings` | `admin_token` | 201 |
| ✅ | Create by non-admin | POST | `/matchings` | `mentee_token` | 403 |
| ✅ | List matchings | GET | `/matchings` | any | 200 |
| ✅ | Get by ID | GET | `/matchings/:id` | any | 200 |
| ✅ | Update matching | PUT | `/matchings/:id` | any | 200 |
| ✅ | Delete by admin | DELETE | `/matchings/:id` | `admin_token` | 200 |

### 4. Feedback
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Submit feedback | POST | `/feedback` | `{ "mentorId":"<id>","menteeId":"<id>","rating":5,"comment":"Great!","isAnonymous":false }` | 201 |
| ✅ | Rating > 5 | POST | `/feedback` | same with `"rating":10` | 400 |
| ✅ | Rating < 1 | POST | `/feedback` | same with `"rating":0` | 400 |
| ✅ | Missing rating | POST | `/feedback` | `{ "mentorId":"<id>","menteeId":"<id>","comment":"ok" }` | 400 |
| ✅ | List feedback | GET | `/feedback` | — | 200 |
| ✅ | Get by ID | GET | `/feedback/:id` | — | 200 |
| ✅ | Get by mentor | GET | `/feedback/mentor/:mentorId` | — | 200 |
| ✅ | Update feedback | PUT | `/feedback/:id` | `{ "comment":"Updated" }` | 200 |
| ✅ | Delete feedback | DELETE | `/feedback/:id` | — | 200 |

### 5. Messages
| TC | Test | Method | Endpoint | Body | Expected |
|----|------|--------|---------|------|----------|
| ✅ | Send message | POST | `/messages` | `{ "senderId":"<id>","receiverId":"<id>","content":"Hello!" }` | 201 |
| ✅ | Get conversations | GET | `/messages/conversations/:userId` | — | 200 |
| ✅ | Get thread | GET | `/messages/:senderId/:receiverId` | — | 200 |
| ✅ | Mark as read | PUT | `/messages/:id/read` | — | 200 |

---

## 💡 Important Testing Flow

For **Sessions**, follow this order with different tokens:

1. **Mentee token** → `POST /sessions` (create)
2. **Mentor token** → `POST /sessions/:id/accept`
3. **Any token** → `POST /sessions/:id/complete`

For **Feedback**, follow this order:

1. **Mentee token** → `POST /feedback` (submit)
2. **Mentor token** → `POST /feedback/:id/respond`
3. **Any token** → `DELETE /feedback/:id`

---

## Bug Report
If any test fails, note it here:

| TC# | Endpoint | What happened | Expected | Severity |
|-----|----------|---------------|----------|----------|
| | | | | |
