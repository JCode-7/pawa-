<<<<<<< HEAD
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development/)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
=======
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
>>>>>>> c7cdcc0074bb7f7409878b762a47b70d26b5659b
