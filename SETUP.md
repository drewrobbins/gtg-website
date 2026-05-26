# Website v3 — Setup & Deployment Guide

## What's Built
Complete website rebuild with **online ordering system** — no more phone-only friction.

### Files
| File | Purpose |
|------|---------|
| `index.html` | Homepage with online order CTAs |
| `menu.html` | Full menu with Add to Cart buttons |
| `order.html` | Cart review + checkout form |
| `cart.js` | Shopping cart engine (localStorage) |
| `style.css` | Complete stylesheet |
| `about.html` | Our Story page |
| `contact.html` | Contact & Hours (updated to show online ordering) |
| `subscribe.html` | Subscription plans |
| `partners.html` | Vacation rental partners |

---

## REQUIRED: Formspree Setup (10 minutes)

The order form submits to **Formspree** — a free form backend that emails orders to you.

### Step 1: Create Formspree Account
1. Go to [formspree.io](https://formspree.io) and sign up (free)
2. Free tier = 50 submissions/month. Paid ($8/mo) = unlimited

### Step 2: Create a New Form
1. Click **New Form**
2. Set the email to `ecc.gtg@gmail.com`
3. Name it: "GTG Online Orders"

### Step 3: Get Your Endpoint
1. Formspree gives you an endpoint like: `https://formspree.io/f/xyzabcde`
2. Copy that URL

### Step 4: Update order.html
Open `order.html` and find this line (~line 195):
```javascript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID_HERE';
```
Replace `YOUR_FORM_ID_HERE` with your actual Formspree form ID.

### What You'll Receive
Every order submission sends an email to `ecc.gtg@gmail.com` with:
- Customer name, email, phone
- Fulfillment method (pickup or delivery)
- Requested date (48hr minimum enforced)
- Delivery address (if applicable)
- Full itemized order with totals
- Special instructions
- Order reference number

---

## ✅ Formspree — CONFIGURED
- Order endpoint: `https://formspree.io/f/xwvzlkdy` ✅
- Feedback endpoint: `https://formspree.io/f/xwvzlkdy` ✅
- Google Place ID: ⚠️ Still needed — replace `REPLACE_WITH_GOOGLE_PLACE_ID` in `feedback.html`

---

## Deployment Options

### Option A: Railway.io (RECOMMENDED — share with Tiffani)
1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project** → **Deploy from GitHub repo**
3. Push the `website-v3/` folder to a GitHub repo first (see below), then connect it
4. Railway auto-detects `railway.json` and `package.json` — no config needed
5. Railway gives you a public URL like `https://gourmet-to-go-production.up.railway.app`
6. Share that URL with Tiffani for review
7. Later: add custom domain `ecgtg.com` in Railway settings

**Push to GitHub first:**
```bash
cd ~/.openclaw/workspace-gtg/website-v3
git init
git add .
git commit -m "feat: initial website-v3 with Railway config"
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/gtg-website.git
git push -u origin main
```

### Option B: Replit (Current Setup)
1. Sync GitHub repo first (already noted in open items)
2. Replace existing Replit files with website-v3 contents
3. Set Formspree endpoint in order.html
4. Test with a sample order

### Option B: Netlify (Recommended — free, faster)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag-and-drop the `website-v3/` folder onto the Netlify dashboard
3. Set custom domain: `ecgtg.com` (point DNS to Netlify)
4. Netlify also has built-in form handling as an alternative to Formspree

### Option C: GitHub Pages
1. Push `website-v3/` to a GitHub repo
2. Enable GitHub Pages in repo settings

---

## Payment Collection
The order form uses **no payment processing online** by design. Orders are confirmed by staff, then payment collected at pickup/delivery (cash, card, Venmo). This is intentional — it keeps the tech stack simple and avoids Stripe setup complexity until volume justifies it.

**When to add Stripe:** Once you're doing >20 orders/month, I'd recommend adding Stripe Checkout for pre-payment. That's a future upgrade.

---

## Testing
Before going live:
1. Open `order.html` locally in a browser
2. Click Add to Cart on `menu.html` — confirm cart badge updates
3. Go to `order.html` — confirm cart shows
4. Fill out the form and submit — you'll see a "dev mode" alert with the order (since Formspree isn't configured yet)
5. After Formspree is set up, submit a real test order and confirm the email arrives

---

## Notes for Tiffani
- All CSS variables are in `:root` at the top of `style.css` — colors, fonts, spacing are all there
- The `images/` folder is symlinked from `website/images` — same images as before
- All pages are static HTML — no build step required
- Mobile responsive: nav hides on small screens (hamburger menu upgrade available if needed)
