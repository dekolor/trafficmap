# TrafficMap

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/dekolor/trafficmap/actions/workflows/ci.yml/badge.svg)](https://github.com/dekolor/trafficmap/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

Daily traffic-condition snapshots for Bucharest, served through a lightweight **Next.js** front-end and powered by an AWS Lambda + S3 grabber pipeline.

> Built to give commuters a quick, historical view of morning rush-hour congestion without having to open Google Maps live every single day.

---

## ✨ Features

| Layer | What it does |
|-------|--------------|
| **AWS Lambda** | Runs at 8 am (Bucharest time), grabs a traffic-overlay screenshot from Google Maps Static API, and saves it to S3. |
| **S3** | Stores screenshots in a S3 bucket (cheap and versioned). |
| **Next.js / React** | Public site that lists days on a timeline and displays the screenshot in a responsive `<Image />` component. |
| **Vercel** | Zero-config deployment with ISR (incremental static regeneration) so new screenshots appear minutes after Lambda finishes. |

---

## 🚀 Quick start

```bash
# 1. Front-end
git clone https://github.com/dekolor/trafficmap.git
cd trafficmap
pnpm install        # or npm / yarn
pnpm dev            # http://localhost:3000

# 2. Set environment variables
# NEXT_PUBLIC_AWS_BUCKET_NAME
# NEXT_PUBLIC_AWS_REGION
# NEXT_PUBLIC_AWS_ACCESS_KEY_ID
# NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
````

## 🖼️ Sample UI

![TrafficMap screenshot](docs/screenshot.png "Bucharest – 8 May 2025")
