# Deployment Guide

## Quick Start

### 1. Prerequisites

- Node.js 18+ 
- pnpm 8+
- Codegen API account and credentials
- Vercel account (for deployment)

### 2. Local Development

```bash
# Clone and setup
git clone <repository-url>
cd codegen-agent-dashboard
pnpm install

# Configure environment
cp CONFIGURATION.md .env.local
# Edit .env.local with your Codegen API credentials

# Start development server
pnpm dev
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link
vercel login
vercel link

# Deploy
vercel --prod
```

## Detailed Deployment Steps

### Environment Setup

1. **Create Environment File**
   ```bash
   cp CONFIGURATION.md .env.local
   ```

2. **Configure Codegen API**
   ```env
   CODEGEN_API_KEY=your_api_key_here
   CODEGEN_BASE_URL=https://api.codegen.com
   CODEGEN_ORGANIZATION_ID=your_org_id_here
   ```

3. **Set Application Settings**
   ```env
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

### Vercel Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables from CONFIGURATION.md
   - Set different values for Production, Preview, and Development

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   # Install dependencies based on the preferred package manager
   COPY package.json pnpm-lock.yaml* ./
   RUN corepack enable pnpm && pnpm i --frozen-lockfile
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   # Build the application
   RUN corepack enable pnpm && pnpm build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   
   # Set the correct permission for prerender cache
   RUN mkdir .next
   RUN chown nextjs:nodejs .next
   
   # Automatically leverage output traces to reduce image size
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t codegen-agent-dashboard .
   docker run -p 3000:3000 \
     -e CODEGEN_API_KEY=your_key \
     -e CODEGEN_BASE_URL=your_url \
     -e CODEGEN_ORGANIZATION_ID=your_org_id \
     codegen-agent-dashboard
   ```

### Self-Hosted Deployment

1. **Server Requirements**
   - Node.js 18+
   - 2GB RAM minimum
   - 10GB storage
   - SSL certificate

2. **Setup Process**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd codegen-agent-dashboard
   
   # Install dependencies
   pnpm install
   
   # Build application
   pnpm build
   
   # Start production server
   pnpm start
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CODEGEN_API_KEY` | Yes | Your Codegen API key |
| `CODEGEN_BASE_URL` | Yes | Codegen API base URL |
| `CODEGEN_ORGANIZATION_ID` | Yes | Your organization ID |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth.js |
| `NEXTAUTH_URL` | Yes | Application URL |
| `ENABLE_ANALYTICS` | No | Enable analytics tracking |
| `ENABLE_AUTONOMOUS_WORKFLOWS` | No | Enable autonomous features |

### Feature Flags

Control which features are enabled:

```env
ENABLE_AUTONOMOUS_WORKFLOWS=true
ENABLE_ADVANCED_ANALYTICS=true
ENABLE_REAL_TIME_MONITORING=true
ENABLE_SECURITY_SCANNING=true
```

## Monitoring and Maintenance

### Health Checks

The application includes built-in health checks:

- `/api/health` - Basic health check
- `/api/health/detailed` - Detailed system status

### Logging

Configure logging levels:

```env
LOG_LEVEL=info
DEBUG=false
ENABLE_DEBUG_PANEL=false
```

### Performance Monitoring

Monitor application performance:

```env
ENABLE_PERFORMANCE_TRACKING=true
METRICS_COLLECTION_INTERVAL=60000
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all environment variables

2. **Runtime Errors**
   - Check API key validity
   - Verify organization access
   - Review error logs

3. **Performance Issues**
   - Monitor memory usage
   - Check API rate limits
   - Optimize database queries

### Debug Mode

Enable debug mode for troubleshooting:

```env
DEBUG=true
LOG_LEVEL=debug
ENABLE_DEBUG_PANEL=true
```

### Support

- **Documentation**: [CONFIGURATION.md](./CONFIGURATION.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Community**: [Discord](https://discord.gg/codegen)

## Security

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure proper CORS settings
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Monitor API usage
- [ ] Set up rate limiting
- [ ] Enable audit logging

### Security Headers

The application includes security headers:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

## Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Build and deploy
pnpm build
vercel --prod
```

### Backup Strategy

- Regular database backups
- Configuration file backups
- API key rotation schedule
- Monitoring alert setup

---

**Ready to deploy your Codegen Agent Dashboard!** 🚀
