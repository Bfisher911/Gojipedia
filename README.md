# Gojipedia

The ultimate encyclopedia for Godzilla and the kaiju universe. A production-ready Next.js application featuring monster profiles, movie databases, timelines, fan content, and an Amazon affiliate storefront.

## Features

### Core Content
- **Monster Directory**: Browse and filter 6+ monsters across eras (Showa, Heisei, Millennium, Reiwa, MonsterVerse)
- **Monster Profiles**: Detailed pages with vitals, abilities, fight records, relationships, and affiliate products
- **Fan Power Index**: Transparent, fan-made ranking system with full methodology explanation
- **Movies & Media**: Comprehensive database of films, series, and games with filters
- **Timeline**: Visual chronology by release date and era
- **Lore & History**: Long-form articles, guides, and explainers
- **Short Stories**: Original fan fiction with perspective filters

### Monetization
- **Amazon Affiliate Integration**: PA-API powered product data with proper disclosure
- **Product Collections**: Curated sets by monster, movie, or category
- **Ad Slots**: Placeholder components for Google AdSense integration

### Technical Features
- Server-side rendering with Next.js App Router
- Type-safe database schema (Prisma)
- Automated product refresh jobs
- Content draft generation system
- SEO optimization with sitemap and JSON-LD
- Mobile-first, accessible design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (SQLite dev / PostgreSQL prod)
- **Content**: MDX for articles
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) PostgreSQL for production

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/gojipedia.git
cd gojipedia

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Initialize the database
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create a `.env` file with these variables:

```env
# Database
DATABASE_URL="file:./dev.db"
# For PostgreSQL: DATABASE_URL="postgresql://user:pass@host:5432/gojipedia"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Admin Setup
ADMIN_EMAIL="admin@gojipedia.com"
ADMIN_PASSWORD="your-secure-password"

# Amazon Product Advertising API (Required for live product data)
AMAZON_ASSOCIATE_TAG="your-tag-20"
AMAZON_PAAPI_ACCESS_KEY="your-access-key"
AMAZON_PAAPI_SECRET_KEY="your-secret-key"
AMAZON_PAAPI_PARTNER_TYPE="Associates"
AMAZON_PAAPI_MARKETPLACE="www.amazon.com"
AMAZON_PAAPI_HOST="webservices.amazon.com"
AMAZON_PAAPI_REGION="us-east-1"

# Optional: Content Generation
OPENAI_API_KEY="sk-..."

# Optional: Analytics
GOOGLE_ANALYTICS_ID=""
ADSENSE_CLIENT_ID=""
```

### Setting Up Amazon Associate Tag

1. Join the [Amazon Associates Program](https://affiliate-program.amazon.com/)
2. Apply for [Product Advertising API access](https://webservices.amazon.com/paapi5/documentation/)
3. Generate access keys in the Associates portal
4. Add credentials to your `.env` file

**Important**: Never scrape Amazon pages. Use only the PA-API for product data.

## Database

### Schema Overview

The Prisma schema includes:

- `Monster`: Kaiju profiles with stats, abilities, and Fan Power Index
- `Work`: Movies, series, comics, and games
- `Appearance`: Monster-to-Work relationships
- `Battle`: Fight events with participants and outcomes
- `Relationship`: Monster alliances and rivalries
- `Product`: Cached Amazon product data
- `ProductCollection`: Curated product groups
- `Post`: Blog articles and stories (MDX)
- `User`: Admin authentication
- `JobRun`: Scheduled job tracking

### Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create migration
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
```

## Scheduled Jobs

### Product Refresh (Daily)

Updates product prices, availability, and images from Amazon PA-API.

```bash
# Run manually
npm run job:product-refresh

# In production (cron): 0 6 * * * npm run job:product-refresh
```

### Content Draft Generator (Weekly)

Creates draft articles and story outlines for admin review.

```bash
# Run manually
npm run job:content-draft

# In production (cron): 0 10 * * 0 npm run job:content-draft
```

### Production Scheduling

For Vercel, use [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/product-refresh",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/content-draft",
      "schedule": "0 10 * * 0"
    }
  ]
}
```

## Admin Area

Access the admin dashboard at `/admin`. Features include:

- Monster and work management (CRUD)
- Product collection curation
- Draft review and publishing
- Job monitoring and manual triggers
- Import tools (CSV for monsters/works, JSON for relationships)

Default admin credentials are set via environment variables.

## Project Structure

```
gojipedia/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── monsters/       # Monster directory and profiles
│   │   ├── movies/         # Movies and media
│   │   ├── timeline/       # Visual timeline
│   │   ├── lore/           # Articles and guides
│   │   ├── stories/        # Fan fiction
│   │   ├── shop/           # Affiliate storefront
│   │   ├── admin/          # Admin dashboard
│   │   └── about/          # Info pages
│   ├── components/
│   │   ├── layout/         # Header, Footer
│   │   ├── monsters/       # Monster cards
│   │   ├── movies/         # Work cards
│   │   ├── products/       # Product cards
│   │   └── ui/             # Shared UI components
│   ├── lib/
│   │   ├── db.ts           # Database queries
│   │   ├── amazon-paapi.ts # Amazon API integration
│   │   ├── seed-data.ts    # Sample data
│   │   └── utils.ts        # Utilities
│   ├── jobs/               # Scheduled job scripts
│   └── types/              # TypeScript definitions
├── content/
│   ├── articles/           # MDX blog posts
│   ├── stories/            # MDX fan fiction
│   └── drafts/             # Generated drafts
└── public/
    └── images/             # Static assets
```

## Content Guidelines

### Writing Style

- Clear, conversational, human voice
- No em dashes (use commas, periods, semicolons)
- Avoid "not only X, but also Y" constructions
- Short paragraphs, concrete details
- Light humor allowed, then move on

### Original Content Only

- All writing must be original
- Do not copy from Wikipedia or fan wikis
- Research is allowed; plagiarism is not
- Fan fiction must include disclaimer

### Images

- User-supplied or licensed images only
- AI-generated images are acceptable
- Never hotlink copyrighted studio images
- Always include alt text

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

The app is compatible with any Node.js hosting:

1. Build: `npm run build`
2. Start: `npm start`
3. Set `DATABASE_URL` to PostgreSQL
4. Configure cron jobs for scheduled tasks

## SEO

The site includes:

- Dynamic sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- OpenGraph and Twitter meta tags
- JSON-LD structured data (Article, Product where allowed)
- Semantic HTML and proper heading hierarchy

## Accessibility

- Keyboard navigation throughout
- ARIA labels on interactive elements
- Color contrast meets WCAG AA
- Focus indicators on all focusable elements
- Skip links for screen readers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is for educational and fan purposes. Godzilla and all related characters are trademarks of Toho Co., Ltd. This is not an official Toho product.

## Support

For issues and feature requests, please use [GitHub Issues](https://github.com/your-org/gojipedia/issues).
