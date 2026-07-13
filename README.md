# Bubble Cake 🎂

A Next.js 14 e-commerce cake shop with admin panel, cart, checkout, and order tracking. Built with React, TypeScript, and Tailwind CSS.

**Live Site:** https://bubblecake.netlify.app

---

## Quick Start — Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## Project Structure

```
bubble-cake/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage (hero slider, products)
│   ├── layout.tsx                # Root layout (nav, footer, cart)
│   ├── globals.css               # Global styles
│   ├── cakes/[id]/page.tsx       # Product detail page
│   ├── categories/[category]/page.tsx  # Category listing
│   ├── contact/page.tsx          # Contact page
│   ├── orders/page.tsx           # Orders listing
│   ├── orders/[id]/page.tsx      # Order detail
│   ├── admin/                    # Admin panel
│   │   ├── page.tsx              # Admin login/dashboard
│   │   ├── orders/page.tsx       # Admin orders management
│   │   └── products/             # Product management
│   └── api/orders/               # API routes for orders
├── components/                   # React components
│   ├── Navigation.tsx            # Header, nav links
│   ├── CartSidebar.tsx           # Cart UI
│   ├── CheckoutModal.tsx         # Checkout form
│   ├── ChatSupport.tsx           # WhatsApp support
│   └── CustomizePanel.tsx        # Product customization
├── context/                      # React Context
│   ├── CartContext.tsx            # Cart & order logic
│   └── AdminContext.tsx           # Admin auth logic
├── data/                         # Static data
│   ├── index.ts                  # Products, addons, prices
│   ├── locations.ts              # Delivery zones, fees
│   └── cakes.json                # Product data (JSON)
├── lib/                          # Utility functions
│   ├── supabase.ts               # Supabase config
│   └── whatsapp.ts               # WhatsApp helpers
├── public/                       # Static assets
│   ├── images/                   # Images
│   └── reviews/                  # Review images
├── netlify.toml                  # Netlify deployment config
├── .env.local                    # Environment variables (don't commit)
└── package.json                  # Dependencies and scripts
```

---

## Common Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint to check code |

---

## Where to Update Everything

### Quick Reference Table

| What to Change | File to Edit |
|----------------|--------------|
| Phone number | `components/ChatSupport.tsx` |
| Email address | `app/layout.tsx` (footer) |
| Address | `app/layout.tsx` (footer) |
| Social media links | `app/layout.tsx` (footer) |
| Product prices | `data/index.ts` |
| Product names/descriptions | `data/index.ts` |
| Product images | `data/index.ts` (image URLs) |
| Delivery zones/areas | `data/locations.ts` |
| Delivery fees | `data/locations.ts` |
| WhatsApp number | `lib/whatsapp.ts` + `.env.local` |
| Admin email/password | Supabase dashboard |
| Site name/logo | `components/Navigation.tsx` |
| Footer text | `app/layout.tsx` |
| Hero slider images | `app/page.tsx` |
| Addons (candles, etc.) | `data/index.ts` |
| Payment QR code | `public/images/payment-qr.svg` |
| Marquee text | `components/Navigation.tsx` |

---

### Contact Details (Phone, Email, Address)

**File: `components/ChatSupport.tsx`**
```typescript
const WHATSAPP_NUMBER = '9779841234567'; // Change this
```

**File: `app/layout.tsx`** (search for "📞" or "✉️")
```tsx
<li>📞 +977-984-1234567</li>  // Change phone
<li>✉️ info@bubblecake.com</li>  // Change email
<li>📍 Kathmandu, Nepal</li>  // Change address
```

**File: `app/contact/page.tsx`**
- Update phone, email, address, Google Maps link

---

### Products (Cakes, Prices, Images)

**File: `data/index.ts`**

```typescript
export const cakes = [
  {
    id: 'rainbow-delight',
    name: 'Rainbow Delight',
    category: 'kids',
    price: 2800,  // Change price here
    image: 'https://images.unsplash.com/...',  // Change image URL
    description: 'A colorful cake...',  // Change description
    trending: true,
    popular: false,
  },
  // ... more cakes
];

export const addons = [
  {
    id: 'candle',
    name: 'Candle Set',
    price: 150,  // Change addon price
    emoji: '🕯️',
    description: 'Birthday candles',
  },
  // ... more addons
];
```

---

### Delivery Zones & Fees

**File: `data/locations.ts`**

```typescript
export const deliveryZones = [
  {
    id: 'inside-ringroad',
    name: 'Inside Ring Road',
    icon: '🏙️',
    available: true,
    deliveryFee: 0,  // Change delivery fee
    estimatedTime: '1-2 hours',
    areas: [
      'Baneshwor',
      'New Baneshwor',
      'Kathmandu Mall Area',
      // Add/remove areas
    ],
  },
  // ... more zones
];
```

---

### WhatsApp Number (for Notifications)

**File: `lib/whatsapp.ts`**
```typescript
const OWNER_WHATSAPP = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || '9779848874295';
```

**File: `.env.local`** (for Netlify deployment)
```
NEXT_PUBLIC_OWNER_WHATSAPP=9779848874295
```

**Also update in Netlify dashboard:**
- Site settings → Environment variables → `NEXT_PUBLIC_OWNER_WHATSAPP`

---

### Admin Account (Email/Password)

**Update in Supabase Dashboard:**
1. Go to https://supabase.com → your project
2. Click **Authentication** → **Users**
3. Find your admin user
4. Click **Edit** → change email or reset password

---

### Hero Slider Images

**File: `app/page.tsx`** (search for "images.unsplash")
```tsx
<img src="https://images.unsplash.com/photo-1578985545062..." alt="Delicious Cakes" />
// Change the URL to your own image
```

---

### Payment QR Code

**Replace file:** `public/images/payment-qr.svg`
- Put your eSewa/Khalti QR code image here

---

### Site Name & Logo

**File: `components/Navigation.tsx`**
```tsx
<span className="text-2xl">🎂</span>  // Change emoji
<span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
  Bubble Cake  // Change site name
</span>
```

---

### Footer Content

**File: `app/layout.tsx`** (search for "footer")
```tsx
<footer>
  <h3>🎂 Bubble Cake</h3>  // Change name
  <p>Making your celebrations sweeter...</p>  // Change tagline
  <li>📞 +977-984-1234567</li>  // Change phone
  <li>✉️ info@bubblecake.com</li>  // Change email
  <a href="https://facebook.com">Facebook</a>  // Change social links
  <a href="https://instagram.com">Instagram</a>
</footer>
```

---

### Categories

**File: `components/Navigation.tsx`**
```typescript
const categories = [
  { name: 'Birthday', href: '/categories/birthday' },
  { name: 'Anniversary', href: '/categories/anniversary' },
  { name: 'Kids', href: '/categories/kids' },
  { name: 'Bento', href: '/categories/bento' },
  { name: 'Custom', href: '/categories/custom' },
];
```

**File: `app/page.tsx`** (category cards section)

---

### Marquee Text (Scrolling Banner)

**File: `components/Navigation.tsx`** (search for "marquee")
```tsx
<span className="inline-block marquee-content whitespace-nowrap">
  Order your cake now, Delivery available call us: 9876543210  // Change text
</span>
```

---

### Styling

- **Global styles:** Edit `app/globals.css`
- **Tailwind config:** Edit `tailwind.config.js` (colors, animations)
- **Component styles:** Edit individual files in `components/`

---

### Add New Pages

Create a new file in `app/` folder:

```
app/about/page.tsx    →  yoursite.com/about
app/blog/page.tsx     →  yoursite.com/blog
```

---

## How to Update Your Site

### Step 1: Edit the file
Open the file listed above and make your changes.

### Step 2: Save and push to GitHub

```bash
# Stage your changes
git add .

# Commit with a description
git commit -m "Updated contact details"

# Push to GitHub (Netlify auto-deploys)
git push
```

### Step 3: Done!
Netlify automatically builds and deploys your site in ~45 seconds.

---

### No Terminal? Use VS Code

If you use VS Code with Git:
1. Edit files
2. Click the **Source Control** icon (left sidebar)
3. Click **+** next to changed files (stages them)
4. Type a message → click **Commit**
5. Click **Sync** or **Push** (top right)

---

## Deployment — How It Works

### Architecture

```
Your Computer  →  GitHub  →  Netlify  →  Live Site
   (code)        (storage)   (hosting)    (bubblecake.netlify.app)
```

### Automatic Deployment

Netlify watches your GitHub repo. When you push code, Netlify automatically:
1. Pulls the latest code
2. Runs `npm run build`
3. Deploys the built site
4. Your site updates in ~45 seconds

**You never need to manually deploy.**

---

## GitHub Repository

**URL:** https://github.com/itsmekrrishnaa-maker/bubblecake

### Useful GitHub Actions

| Action | How |
|---|---|
| View code | Go to repo URL |
| Edit file online | Click file → pencil icon |
| View history | Click "History" button |
| Create branch | Branch dropdown → "New branch" |
| Open issue | "Issues" tab → "New issue" |

---

## Netlify Dashboard

**URL:** https://app.netlify.com

### Useful Netlify Actions

| Action | How |
|---|---|
| View live site | Click "Production deploys" → site URL |
| View deploy logs | Click on a deploy entry |
| Change domain | Domain Settings → Add custom domain |
| Environment variables | Site settings → Build & deploy → Environment |
| Trigger deploy | Deploys → Trigger deploy → Deploy site |

---

## Environment Variables

| Variable | Where to Set | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Netlify + `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Netlify + `.env.local` | Supabase public key |
| `NEXT_PUBLIC_OWNER_WHATSAPP` | Netlify + `.env.local` | Owner WhatsApp number |

**Note:** `.env.local` is for local development only. For production, set variables in Netlify dashboard.

---

## Supabase Database

### Orders Table Schema

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  name TEXT NOT NULL,
  recipient_name TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  advance_paid NUMERIC DEFAULT 0,
  payment_screenshot TEXT,
  remarks TEXT,
  reference_image TEXT,
  delivery_date TEXT NOT NULL,
  delivery_zone TEXT NOT NULL,
  delivery_area TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Anyone can create orders (customers)
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Only admin can read/update/delete orders
CREATE POLICY "Only authenticated can read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');
```

---

## Troubleshooting

### Build Fails on Netlify

1. Go to Netlify dashboard → click the failed deploy
2. Read the error message in the build log
3. Common fixes:
   - **"useSearchParams() should be wrapped in Suspense"** → Already fixed
   - **"Module not found"** → Run `npm install` locally, commit `package-lock.json`
   - **"Unescaped quotes"** → Use `&quot;` instead of `"` in JSX
   - **"Build minutes exceeded"** → Upgrade Netlify or wait for reset

### Site Shows 404

- Check that publish directory is `.next` in Netlify settings
- Ensure all page files are in the `app/` folder

### Images Not Loading

- Product images use Unsplash URLs — requires internet connection
- Local images must be in the `public/` folder

### Admin Panel Not Working

- Check Supabase environment variables in Netlify
- Verify admin user exists in Supabase → Authentication → Users
- Check RLS policies are set correctly

### Orders Not Saving

- Verify Supabase table exists (run the SQL in Supabase SQL Editor)
- Check RLS policies allow INSERT for anonymous users
- Check API route logs in Netlify

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework (App Router) |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Database & authentication |
| Netlify | Hosting & deployment |
| GitHub | Code storage |
| WhatsApp | Order notifications |

---

## License

This project is for personal/educational use.
