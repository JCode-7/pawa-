# Weather App

A modern weather application built with Next.js, TypeScript, and Tailwind CSS that connects to a Laravel backend.

## Features

- Current weather display
- 5-day forecast
- Temperature unit toggle (Celsius/Fahrenheit)
- Responsive design
- Dark theme

## Prerequisites

- Node.js 16+ and npm
- Laravel backend (optional, app has fallback to OpenWeatherMap API)

## Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file based on `.env.example`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Configure the environment variables in `.env.local`:
   - For local development with Laravel running on port 8000:
     \`\`\`
     NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
     \`\`\`
   - For production when backend and frontend are on the same domain:
     \`\`\`
     NEXT_PUBLIC_API_BASE_URL=/api
     \`\`\`
   - Leave it empty to use the OpenWeatherMap API directly (fallback mode)

## Development

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The app will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

Build the application:

\`\`\`bash
npm run build
\`\`\`

Start the production server:

\`\`\`bash
npm start
\`\`\`

## Deployment Options

### Standard Web Hosting

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Copy the contents of the `out` directory to your web server.

### Docker Deployment

1. Build the Docker image:
   \`\`\`bash
   docker build -t weather-app .
   \`\`\`

2. Run the container:
   \`\`\`bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=/api weather-app
   \`\`\`

## Laravel Backend Integration

This app is designed to work with a Laravel backend. The backend should provide these API endpoints:

- `/api/geocode?city={city}` - Convert city name to coordinates
- `/api/weather?lat={lat}&lon={lon}` - Get current weather
- `/api/forecast?lat={lat}&lon={lon}` - Get forecast data

If the Laravel backend is not available, the app will fall back to using the OpenWeatherMap API directly.

## License

MIT
\`\`\`

Let's create a simple Dockerfile for containerized deployment:

```dockerfile file="Dockerfile"
# Use Node.js LTS
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct permissions
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
