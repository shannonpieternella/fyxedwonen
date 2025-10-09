# 🚀 Backend Setup - RentBird Transformation

## ✅ Completed Backend Features

### **1. Database Models**
- ✅ **User Model** - Extended with:
  - Subscription (Stripe, RentBird pricing tiers)
  - Preferences (cities, price, rooms, features)
  - Notifications settings
  - Onboarding status

- ✅ **Property Model** - Updated for scraping:
  - Source tracking (kamernet, pararius, funda, huurwoningen)
  - Scraping metadata (sourceId, scrapedAt, lastCheckedAt)
  - Availability tracking
  - Auto-approval for scraped listings

- ✅ **Match Model** - New scoring system:
  - 0-100% match score
  - Match reasons (transparency)
  - User actions (viewed, interested, dismissed)
  - Notification tracking

- ✅ **Analytics Model** - Admin dashboard data:
  - Daily property/match/user stats
  - Scraping performance metrics
  - Revenue tracking

### **2. Services**

- ✅ **Matching Service** (`server/services/matchingService.js`)
  - Finds matches for new properties
  - Calculates 0-100% match scores
  - Generates match reasons
  - Auto-triggers notifications

- ✅ **Notification Service** (`server/services/notificationService.js`)
  - Instant email alerts for new matches
  - Daily/weekly digest emails
  - Beautiful HTML email templates
  - Tracks notification success/failure

### **3. API Endpoints**

#### **Preferences API** (`/api/preferences`)
- `GET /` - Get user preferences
- `POST /` - Save/update preferences
- `PATCH /` - Update specific fields

#### **Matches API** (`/api/matches`)
- `GET /` - Get all matches (with filters, pagination)
- `GET /:id` - Get match details
- `POST /:id/interested` - Mark as interested
- `POST /:id/dismiss` - Dismiss match
- `POST /:id/click` - Track source URL click

#### **Subscription API** (`/api/subscription`)
- `GET /status` - Get subscription status
- `GET /pricing` - Get pricing tiers
- `POST /create-checkout` - Create Stripe checkout
- `POST /verify-payment` - Verify and activate subscription
- `POST /cancel` - Cancel subscription
- `POST /webhook` - Stripe webhooks

#### **Admin API** (`/api/admin`)
- `GET /dashboard` - Dashboard overview
- `GET /analytics` - Analytics for date range
- `GET /users` - All users (paginated)
- `GET /scraping-status` - Scraper health
- `GET /matches/daily` - Daily matches report
- `POST /users/:id/role` - Update user role

### **4. Cron Jobs** (`server/jobs/scheduler.js`)

- ✅ **Daily Analytics** (midnight)
  - Aggregates daily stats
  - Updates Analytics collection

- ✅ **Cleanup Job** (2 AM)
  - Marks old listings as unavailable (48h)
  - Archives listings (7 days)
  - Deactivates expired subscriptions

- ✅ **Daily Digest** (9 AM)
  - Sends to users with daily preference

- ✅ **Weekly Digest** (Monday 10 AM)
  - Sends to users with weekly preference

---

## 🔧 Environment Variables

See `.env.example` for all required variables.

### **Critical Variables:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_1_MONTH=price_...
STRIPE_PRICE_2_MONTHS=price_...
STRIPE_PRICE_3_MONTHS=price_...

# Email
EMAIL_HOST=smtp.zoho.com
EMAIL_USER=noreply@fyxedwonen.nl
EMAIL_PASS=...

# URLs
APP_BASE_URL=https://fyxedwonen.nl
```

---

## 📦 Installation

```bash
cd server
npm install
```

**New dependencies added:**
- `node-cron` - Cron job scheduling

---

## 🚀 Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔄 Matching Flow

1. **Property scraped** → Saved to MongoDB
2. **Matching triggered** → `matchingService.findMatchesForProperty()`
3. **Scores calculated** → 0-100% based on preferences
4. **Matches created** → Saved to Match collection
5. **Notifications sent** → Instant emails to users (if enabled)
6. **Analytics updated** → Daily stats incremented

---

## 📊 RentBird Pricing Tiers

| Tier | Duration | Price | Per Month | Discount |
|------|----------|-------|-----------|----------|
| 1 Month | 1 month | €29 | €29.00 | 0% |
| 2 Months | 2 months | €39 | €19.50 | 32% |
| 3 Months | 3 months | €49 | €16.33 | 44% |

**All tiers include:**
- Unlimited matches
- Instant email alerts
- AI-powered scoring
- Search multiple cities (30 NL cities)
- 14-day money back guarantee

---

## 🌍 Supported Cities (30 total)

Amsterdam, Rotterdam, Utrecht, Den Haag, Eindhoven, Alkmaar, Almere, Amersfoort, Amstelveen, Apeldoorn, Arnhem, Breda, Bussum, Delft, Den Bosch, Deventer, Dordrecht, Enschede, Groningen, Haarlem, Heerlen, Hilversum, Leeuwarden, Leiden, Maastricht, Nijmegen, Roermond, Tilburg, Zaandam, Zwolle

---

## 👤 Admin Access

To make a user admin:

```javascript
// In MongoDB or via API
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or use the admin API:
```bash
POST /api/admin/users/:userId/role
{ "role": "admin" }
```

---

## 📧 Email Templates

Match notification emails include:
- Match score badge
- Property image
- Full property details
- Match reasons (why it matched)
- Urgency badge
- Direct link to source
- Quick actions

---

## 🔮 Next Steps

### **Scraper Implementation (Python)**
1. Build base spider with config system
2. Create Pararius, Kamernet, Funda scrapers
3. MongoDB pipeline with duplicate detection
4. Configurable scheduler (hourly/4hours/daily)

### **Frontend**
1. Onboarding flow (preferences + subscription)
2. Matches page
3. Preferences editor
4. Admin dashboard
5. Update homepage

---

## 🐛 Troubleshooting

### **Cron jobs not running?**
Check server logs for: `🕐 Initializing cron jobs...`

### **Emails not sending?**
- Verify `EMAIL_*` environment variables
- Check Zoho SMTP settings
- Look for email errors in server logs

### **Stripe checkout failing?**
- Verify `STRIPE_SECRET_KEY` is correct
- Check `STRIPE_PRICE_*` IDs exist in Stripe dashboard
- Look for Stripe errors in console

---

## 📝 API Testing

Use these endpoints to test:

```bash
# Create user preferences
POST /api/preferences
{
  "cities": ["Amsterdam", "Utrecht"],
  "minPrice": 800,
  "maxPrice": 1500,
  "minRooms": 2,
  "furnished": "both",
  "features": ["balcony", "parking"]
}

# Get matches
GET /api/matches?status=new&limit=20

# Get admin dashboard
GET /api/admin/dashboard
```

---

## ✨ Match Scoring Algorithm

Properties get scored 0-100% based on:

- **Price range** (30 points) - Within budget?
- **Rooms** (15 points) - Meets minimum?
- **Size** (15 points) - Within range?
- **Furnished** (10 points) - Matches preference?
- **Pets allowed** (10 points) - If needed
- **Features** (20 points) - Balcony, garden, parking, etc.

**Minimum 60% score required** to create a match.

---

*Last updated: 2025-10-05*
