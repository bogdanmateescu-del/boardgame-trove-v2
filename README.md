# Boardgame Trove

A modern collection manager for Boardgames, Books, and Comics, powered by Supabase and deployed on Vercel.

## 🚀 Key Improvements in v2.0
1. **Decoupled from NAS**:
   - BoardGameGeek (BGG) XML API and Hardcover GraphQL API calls are now handled by **Vercel Serverless Functions** (`/api/bgg` and `/api/book`).
   - You **no longer need** to keep your Synology NAS container running or have home router ports open to the internet. The app works anywhere globally!
2. **Modular Architecture**:
   - Reorganized the monolithic HTML into **3 main topics**:
     - **Boardgames**: Collection Manager, Randomizer, Reports
     - **Books**: Collection Manager, Randomizer, Reports
     - **Comics**: Collection Manager, Randomizer, Reports
   - Code is split cleanly into services, utils, feature modules, and modal dialogs.
3. **Local Development**:
   - Includes a built-in dev API handler in Vite so `npm run dev` works 100% locally without external dependencies.

---

## 📂 Project Structure

```
├── api/
│   ├── bgg.js                   # Vercel Serverless Function for BGG XML API2 (retry & auth handling)
│   └── book.js                  # Vercel Serverless Function for Hardcover GraphQL proxy
├── src/
│   ├── config/
│   │   └── constants.js         # Supabase credentials, tokens, fallback image
│   ├── services/
│   │   ├── supabaseClient.js    # Supabase JS client
│   │   ├── bggService.js        # BGG API fetch & parsing service
│   │   ├── hardcoverService.js  # Hardcover GraphQL & OpenLibrary fallback service
│   │   └── scannerService.js    # Camera barcode scanner service
│   ├── utils/
│   │   └── helpers.js           # Safe image normalization, CSV export, error handlers
│   ├── modules/
│   │   ├── boardgames/
│   │   │   ├── boardgamesView.js       # HTML view layout (tabs, manager, randomizer, reports)
│   │   │   ├── boardgamesCollection.js # Collection logic, search, filter, pagination, dashboard, add game
│   │   │   ├── boardgamesRandomizer.js # Game picker logic (All, Unplayed, TBD)
│   │   │   └── boardgamesReports.js    # Metrics, summary report text, CSV export
│   │   ├── books/
│   │   │   ├── booksView.js            # HTML view layout (tabs, manager, randomizer, reports)
│   │   │   ├── booksCollection.js      # Collection logic, search, filter, pagination, add book, editions
│   │   │   ├── booksRandomizer.js      # Book roll logic for Lore and Bogdan
│   │   │   └── booksReports.js         # Books metrics & statistics
│   │   ├── comics/
│   │   │   ├── comicsView.js           # HTML view layout
│   │   │   ├── comicsCollection.js     # Comics collection handlers
│   │   │   ├── comicsRandomizer.js     # Comics randomizer handlers
│   │   │   └── comicsReports.js        # Comics reports handlers
│   │   └── modals/
│   │       ├── modalsView.js           # HTML markup for dialogs
│   │       ├── gameModal.js            # Game edit & BGG autocomplete modal
│   │       ├── bookModal.js            # Book edit modal
│   │       ├── editionModal.js         # Hardcover edition selector modal
│   │       └── deleteModal.js          # Delete confirmation modal
│   ├── styles/
│   │   └── main.css                    # Custom CSS utility styles
│   └── main.js                         # Application bootstrap & window event routing
├── index.html                          # Clean entry HTML skeleton
├── package.json                        # Dependencies and build scripts
├── vite.config.js                      # Vite config with local dev API middleware
├── vercel.json                         # Vercel deployment configuration
└── index.html.original.bak             # Original backup copy of monolithic index.html
```

---

## 🛠️ Development & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start local dev server (default: http://localhost:3000)
npm run dev
```

### Production Build
```bash
npm run build
```

### Deployment to Vercel
Simply push your repository to GitHub. Vercel automatically detects the Vite build (`dist/`) and mounts the serverless functions in `/api/` seamlessly!
