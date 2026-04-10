# 📋 Family Library App - Product Backlog

## 🎯 Vision
A production-ready, multi-user family library management application that helps families track their books and reading progress together.

---

## 🔥 Critical Issues (Must Fix Now)

### #1 - Email Verification UX
**Priority:** P0 - Critical  
**Status:** ⚠️ In Progress  
**Description:** Users receive Supabase default confirmation email instead of branded experience

**Current State:**
- User signs up
- Gets generic Supabase email
- Confirms email
- Redirected to dashboard

**Expected State:**
- User signs up
- Gets branded email (custom template)
- Confirms email with nice landing page
- Redirected to welcome flow

**Tasks:**
- [ ] Create custom email template in Supabase
- [ ] Add email verification landing page
- [ ] Add "Verify your email" screen after signup
- [ ] Add resend verification email feature

**Resources:**
- Supabase Email Templates: Settings → Auth → Email Templates
- Custom SMTP for branded emails

---

### #2 - Username Validation & Error Handling
**Priority:** P0 - Critical  
**Status:** ✅ Fixed  
**Description:** Username taken error shows as "Database error"

**Current State:**
- User tries taken username
- Gets "Database error saving new user"

**Expected State:**
- Real-time username validation
- Clear error: "Username is already taken"
- Suggest alternatives

**Tasks:**
- [x] Add username availability check before signup
- [ ] Add real-time validation (debounced)
- [ ] Suggest similar usernames
- [ ] Add username requirements (min length, allowed chars)

---

### #3 - Token Management
**Priority:** P0 - Critical  
**Status:** ⚠️ Needs Fix  
**Description:** Dashboard uses `user.getIdToken()` which may not work with new Supabase keys

**Tasks:**
- [ ] Fix token retrieval in dashboard
- [ ] Add proper session refresh
- [ ] Handle expired tokens gracefully
- [ ] Add token refresh logic

---

## 🚀 Sprint 1 - Core Features (Week 1)

### #4 - Complete Book CRUD
**Priority:** P1 - High  
**Status:** 🔄 In Progress  
**Description:** Full book management with Supabase

**Tasks:**
- [ ] Update books API to use Supabase client
- [ ] Add book cover upload (Supabase Storage)
- [ ] Add book edit functionality
- [ ] Add book delete with confirmation
- [ ] Add book search

**API Endpoints Needed:**
- `GET /api/books` - List all books
- `POST /api/books` - Add new book
- `GET /api/books/:id` - Get single book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

---

### #5 - ISBN Lookup Enhancement
**Priority:** P1 - High  
**Status:** ✅ Done  
**Description:** Google Books + Open Library integration

**Tasks:**
- [x] Create book lookup service
- [x] Add Google Books API support
- [x] Add Open Library fallback
- [ ] Add book search by title/author
- [ ] Add barcode scanner (mobile)

---

### #6 - Reading Status Tracking
**Priority:** P1 - High  
**Status:** ⏳ Pending  
**Description:** Multi-user reading status

**Tasks:**
- [ ] Update user_books API for Supabase
- [ ] Add status change modal
- [ ] Add reading progress (0-100%)
- [ ] Add reading dates (started/finished)
- [ ] Add reading notes

---

## 📚 Sprint 2 - Organization (Week 2)

### #7 - Shelves Management
**Priority:** P1 - High  
**Status:** ⏳ Pending  
**Description:** Custom book collections

**Tasks:**
- [ ] Update shelves API for Supabase
- [ ] Add create/edit/delete shelves
- [ ] Add drag & drop to reorder books
- [ ] Add shelf sharing between family members
- [ ] Add shelf cover (auto-generated from books)

---

### #8 - Tags System
**Priority:** P2 - Medium  
**Status:** ⏳ Pending  
**Description:** Book tagging

**Tasks:**
- [ ] Update tags API for Supabase
- [ ] Add tag management UI
- [ ] Add tag suggestions
- [ ] Add tag colors
- [ ] Add filter by tags

---

### #9 - Advanced Search & Filters
**Priority:** P2 - Medium  
**Status:** ⏳ Pending  
**Description:** Find books quickly

**Tasks:**
- [ ] Full-text search
- [ ] Filter by status, shelf, tags
- [ ] Sort by title, author, date added
- [ ] Advanced search modal
- [ ] Search history

---

## 🎨 Sprint 3 - UX Improvements (Week 3)

### #10 - Onboarding Flow
**Priority:** P1 - High  
**Status:** ⏳ Pending  
**Description:** First-time user experience

**Tasks:**
- [ ] Welcome screen after email verification
- [ ] Add first book import flow
- [ ] Import from Goodreads (CSV)
- [ ] Tutorial/tooltips
- [ ] Family invitation flow

---

### #11 - Email Templates
**Priority:** P1 - High  
**Status:** ⏳ Pending  
**Description:** Branded emails

**Tasks:**
- [ ] Custom signup email template
- [ ] Password reset template
- [ ] Family invitation template
- [ ] Add app logo to emails
- [ ] Custom SMTP (optional)

---

### #12 - Notifications
**Priority:** P2 - Medium  
**Status:** ⏳ Pending  
**Description:** In-app notifications

**Tasks:**
- [ ] Toast notifications
- [ ] Email notifications settings
- [ ] Push notifications (PWA)
- [ ] Activity digest email

---

## 📊 Sprint 4 - Analytics & Insights (Week 4)

### #13 - Reading Statistics
**Priority:** P2 - Medium  
**Status:** ⏳ Pending  
**Description:** Reading analytics

**Tasks:**
- [ ] Books read per month chart
- [ ] Reading streak calendar
- [ ] Favorite genres
- [ ] Pages read tracker
- [ ] Year in books summary

---

### #14 - Family Dashboard
**Priority:** P2 - Medium  
**Status:** ⏳ Pending  
**Description:** Family-wide stats

**Tasks:**
- [ ] Family reading goal
- [ ] Most popular books
- [ ] Reading leaderboard (fun)
- [ ] Recently added books
- [ ] Family book club feature

---

## 📱 Mobile App (Future)

### #15 - Flutter Mobile App
**Priority:** P3 - Low  
**Status:** ⏳ Backlog  
**Description:** Native mobile app

**Features:**
- [ ] ISBN barcode scanner
- [ ] Camera book cover capture
- [ ] Offline reading
- [ ] Push notifications
- [ ] Share book with family

---

## 🐛 Known Bugs

### #16 - Token Refresh Issue
**Priority:** P1 - High  
**Status:** ⚠️ Open  
**Description:** Dashboard token retrieval fails

**Workaround:** Use session from AuthContext instead of getIdToken()

---

### #17 - Profile Creation Race Condition
**Priority:** P2 - Medium  
**Status:** ⚠️ Open  
**Description:** Sometimes profile not created before redirect

**Fix:** Add profile creation check in dashboard

---

## 💡 Feature Requests

### #18 - Book Recommendations
**Priority:** P3 - Low  
**Description:** Suggest books based on reading history

### #19 - Reading Challenges
**Priority:** P3 - Low  
**Description:** Set yearly reading goals

### #20 - Export Library
**Priority:** P3 - Low  
**Description:** Export to CSV/JSON

### #21 - Dark Mode
**Priority:** P3 - Low  
**Description:** Theme toggle

### #22 - Book Lending Tracker
**Priority:** P3 - Low  
**Description:** Track who borrowed which book

### #23 - Wishlist
**Priority:** P3 - Low  
**Description:** Books to buy

---

## 📈 Metrics to Track

- [ ] Daily Active Users (DAU)
- [ ] Books added per day
- [ ] Reading completion rate
- [ ] User retention (7-day, 30-day)
- [ ] Family invitations sent
- [ ] Average books per family

---

## 🛠️ Technical Debt

- [ ] Remove legacy JSON database code
- [ ] Add comprehensive error logging
- [ ] Add Sentry for error tracking
- [ ] Add performance monitoring
- [ ] Write integration tests
- [ ] Add E2E tests (Playwright)
- [ ] API documentation
- [ ] Rate limiting

---

## 📝 Notes

### Email Verification Flow
User feedback suggests we need better email UX:
1. After signup, show "Check your email" screen
2. Add resend verification button
3. Add "Didn't receive email?" FAQ
4. Consider magic link instead of code

### Username System
- Consider using email as primary identifier
- Or auto-generate usernames (e.g., ram#1234)
- Add username change feature

### Database Optimization
- Add database indexes for common queries
- Consider caching for stats
- Add pagination for large book lists

---

**Last Updated:** 2025-01-10  
**Next Sprint Planning:** TBD
