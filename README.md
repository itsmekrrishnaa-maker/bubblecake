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
│   └── admin/                    # Admin panel
│       ├── page.tsx              # Admin login/dashboard
│       └── products/             # Product management
├── components/                   # React components
├── context/                      # React Context (Cart, Admin)
├── data/                         # Static data (products, locations)
├── public/                       # Static assets (images, SVGs)
├── netlify.toml                  # Netlify deployment config
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

## How to Modify Things

### Change Products / Menu Items

Edit `data/index.ts` — this file contains all product data (cakes, addons, prices).

```typescript
// Add a new cake to the products array
{
  id: 'new-cake',
  name: 'New Cake Name',
  price: 1500,
  description: 'Cake description',
  category: 'birthday',
  image: '/images/cake.jpg',
  // ... other fields
}
```

### Change Delivery Locations / Prices

Edit `data/locations.ts` — contains delivery zones and pricing.

### Change Images

- **Product images:** Update URLs in `data/index.ts` (uses Unsplash URLs)
- **Local images:** Replace files in `public/` folder
- **Payment QR:** Replace `public/images/payment-qr.svg`

### Modify Styling

- **Global styles:** Edit `app/globals.css`
- **Tailwind config:** Edit `tailwind.config.js` (colors, animations)
- **Component styles:** Edit individual files in `components/`

### Add New Pages

Create a new file in `app/` folder:

```
app/about/page.tsx    →  yoursite.com/about
app/blog/page.tsx     →  yoursite.com/blog
```

### Modify Navigation / Footer

Edit `app/layout.tsx` — contains the Navigation component and Footer.

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

### How to Update Your Site

```bash
# 1. Make changes to your code (edit files)

# 2. Save changes to Git
git add .

# 3. Commit with a description
git commit -m "Added new cake flavor"

# 4. Push to GitHub (Netlify auto-deploys)
git push
```

That's it. Your site updates automatically.

### No Terminal? Use VS Code

If you use VS Code with Git:
1. Edit files
2. Click the **Source Control** icon (left sidebar)
3. Click **+** next to changed files (stages them)
4. Type a message → click **Commit**
5. Click **Sync** or **Push** (top right)

Netlify auto-deploys.

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
| Form handling | Forms tab (auto-detects Netlify Forms) |
| Redirects | Add rules in `netlify.toml` |

---

## Troubleshooting

### Build Fails on Netlify

1. Go to Netlify dashboard → click the failed deploy
2. Read the error message in the build log
3. Common fixes:
   - **"useSearchParams() should be wrapped in Suspense"** → Already fixed in this project
   - **"Module not found"** → Run `npm install` locally, commit `package-lock.json`
   - **"Out of memory"** → Large build, contact Netlify support

### Site Shows 404

- Check that publish directory is `.next` in Netlify settings
- Ensure all page files are in the `app/` folder

### Images Not Loading

- Product images use Unsplash URLs — requires internet connection
- Local images must be in the `public/` folder

### Cart Not Saving

- Cart uses browser localStorage
- Clearing browser data resets the cart
- This is expected behavior (no backend database)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework (App Router) |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| localStorage | Cart & order persistence |
| Netlify | Hosting & deployment |
| GitHub | Code storage |

---

## License

This project is for personal/educational use.
