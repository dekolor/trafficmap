# 🗺️ TrafficMap

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900)](https://aws.amazon.com/s3/)

Daily traffic-condition snapshots for Bucharest, served through a lightweight **Next.js** front-end and powered by an AWS Lambda + S3 grabber pipeline.

> Built to give commuters a quick, historical view of morning rush-hour congestion without having to open Google Maps live every single day.

![TrafficMap Preview](docs/screenshot.png "Bucharest Traffic – Morning Rush Hour")

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📸 **Daily Snapshots** | Automated 8 AM (Bucharest) traffic capture via AWS Lambda |
| 🗂️ **Timeline View** | Browse historical traffic data by date |
| 🔍 **Smart Search** | Search maps by date or keywords |
| 🎨 **Dual View Modes** | Grid view for quick browsing, list view for details |
| 🔲 **Comparison Mode** | Compare up to 6 traffic maps side-by-side |
| 🖼️ **Image Gallery** | Full-screen lightbox for detailed viewing |
| 📱 **Mobile Responsive** | Optimized for phones, tablets, and desktop |
| ⚡ **Fast Loading** | ISR (Incremental Static Regeneration) for instant updates |

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Radix UI, shadcn/ui |
| **Maps** | Google Maps Static API |
| **Storage** | AWS S3 |
| **Compute** | AWS Lambda (screenshot capture) |
| **Deployment** | Vercel |
| **Analytics** | Vercel Analytics & Speed Insights |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- AWS account with S3 bucket configured

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dekolor/trafficmap.git
cd trafficmap

# 2. Install dependencies
pnpm install        # or npm install / yarn install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_AWS_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_AWS_REGION=eu-central-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Development

```bash
pnpm dev            # Start development server at http://localhost:3000
```

### Build for Production

```bash
pnpm build          # Create optimized production build
pnpm start          # Start production server
```

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐
│  AWS Lambda     │────▶│  AWS S3     │◀────│  Next.js    │
│  (8 AM daily)   │     │  (storage)  │     │  (frontend) │
└─────────────────┘     └─────────────┘     └─────────────┘
        │                                            │
        │                                            │
        ▼                                            ▼
┌─────────────────┐                         ┌─────────────┐
│ Google Maps     │                         │  Vercel     │
│ Static API      │                         │  (hosting)  │
└─────────────────┘                         └─────────────┘
```

### Data Flow

1. **AWS Lambda** runs daily at 8 AM Bucharest time
2. Fetches traffic overlay screenshot from **Google Maps Static API**
3. Saves screenshot to **S3** bucket with timestamp
4. **Next.js** frontend fetches images via `/api/images` endpoint
5. **ISR** ensures new screenshots appear within minutes

---

## 📁 Project Structure

```
trafficmap/
├── src/
│   ├── app/
│   │   ├── api/images/route.ts    # API endpoint for S3 images
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main app component
│   │   └── loading.tsx            # Loading state
│   ├── components/
│   │   ├── comparison-view.tsx    # Side-by-side comparison
│   │   ├── image-gallery.tsx      # Lightbox gallery
│   │   ├── image-grid.tsx         # Grid view layout
│   │   ├── image-list.tsx         # List view layout
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/
│   │   └── use-mobile.ts          # Mobile detection hook
│   └── lib/
│       └── utils.ts               # Utility functions
├── docs/
│   └── screenshot.png             # Preview image
├── components.json                # shadcn/ui config
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS config
└── package.json                   # Dependencies
```

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint for code quality |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup on Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy to apply changes

---

## 🔮 Future Enhancements

- [ ] Multiple city support (beyond Bucharest)
- [ ] Traffic pattern analysis and predictions
- [ ] Export maps as PDF reports
- [ ] User accounts with saved comparisons
- [ ] Dark/light theme toggle
- [ ] PWA support for mobile installation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Maps Static API](https://developers.google.com/maps/documentation/static-maps) for traffic data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Vercel](https://vercel.com/) for hosting and analytics

---

Built with ❤️ in Bucharest by [Stefan](https://github.com/dekolor)
