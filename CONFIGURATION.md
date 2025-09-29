# Configuration Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Codegen API Configuration
CODEGEN_API_KEY=your_codegen_api_key_here
CODEGEN_BASE_URL=https://api.codegen.com
CODEGEN_ORGANIZATION_ID=your_organization_id_here

# Optional: Repository Configuration
CODEGEN_DEFAULT_REPOSITORY_ID=your_default_repository_id_here

# Application Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Analytics and Monitoring
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true

# Optional: Feature Flags
ENABLE_AUTONOMOUS_WORKFLOWS=true
ENABLE_ADVANCED_ANALYTICS=true
ENABLE_REAL_TIME_MONITORING=true

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Codegen Agent Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Codegen API Setup

### 1. Get Your API Key

1. Log in to your Codegen dashboard
2. Navigate to Settings > API Keys
3. Generate a new API key with appropriate permissions
4. Copy the API key to your environment variables

### 2. Configure Organization

1. Get your Organization ID from the Codegen dashboard
2. Add it to your environment variables
3. Ensure your organization has the necessary permissions

### 3. Repository Access

1. Connect your GitHub repositories in the Codegen dashboard
2. Configure repository-specific settings
3. Set up webhooks for real-time updates (optional)

## Deployment Configuration

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   vercel login
   vercel link
   ```

2. **Set Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add all the required environment variables
   - Make sure to set different values for Production, Preview, and Development environments

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t codegen-agent-dashboard .
   ```

2. **Run with environment variables**
   ```bash
   docker run -p 3000:3000 \
     -e CODEGEN_API_KEY=your_key \
     -e CODEGEN_BASE_URL=your_url \
     -e CODEGEN_ORGANIZATION_ID=your_org_id \
     codegen-agent-dashboard
   ```

## Feature Configuration

### Autonomous Workflows

Enable or disable specific autonomous features:

```env
ENABLE_AUTONOMOUS_WORKFLOWS=true
ENABLE_AUTO_REVIEW=true
ENABLE_AUTO_FIX=true
ENABLE_AUTO_TEST=true
ENABLE_AUTO_OPTIMIZE=true
```

### Analytics and Monitoring

Configure analytics and monitoring features:

```env
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
ENABLE_REAL_TIME_MONITORING=true
ENABLE_PERFORMANCE_TRACKING=true
```

### Security Settings

Configure security-related features:

```env
ENABLE_SECURITY_SCANNING=true
ENABLE_VULNERABILITY_DETECTION=true
ENABLE_COMPLIANCE_CHECKING=true
```

## Custom Configuration

### Custom API Endpoints

If you're using a custom Codegen API instance:

```env
CODEGEN_BASE_URL=https://your-custom-api.com
CODEGEN_API_VERSION=v1
```

### Custom Timeouts

Configure API timeouts:

```env
CODEGEN_API_TIMEOUT=30000
CODEGEN_RETRY_ATTEMPTS=3
CODEGEN_RETRY_DELAY=1000
```

### Custom Polling Intervals

Configure how often the dashboard refreshes data:

```env
DASHBOARD_REFRESH_INTERVAL=5000
QUEUE_POLLING_INTERVAL=2000
HEALTH_CHECK_INTERVAL=30000
```

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify your API key is correct
   - Check that the key has the necessary permissions
   - Ensure the key hasn't expired

2. **Organization Access Denied**
   - Verify your Organization ID is correct
   - Check that your account has access to the organization
   - Ensure the organization is active

3. **Repository Not Found**
   - Verify the repository exists in Codegen
   - Check that your API key has access to the repository
   - Ensure the repository ID is correct

4. **Webhook Issues**
   - Check that webhook URLs are accessible
   - Verify webhook secret keys are correct
   - Ensure webhook events are properly configured

### Debug Mode

Enable debug mode for additional logging:

```env
DEBUG=true
LOG_LEVEL=debug
ENABLE_DEBUG_PANEL=true
```

### Performance Tuning

For high-traffic environments:

```env
CACHE_TTL=300000
MAX_CONCURRENT_REQUESTS=10
REQUEST_QUEUE_SIZE=100
```

## Security Considerations

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive configuration
3. **Enable HTTPS** in production
4. **Regularly rotate API keys**
5. **Monitor API usage** and set up alerts for unusual activity
6. **Use least privilege principle** for API key permissions

## Support

If you encounter issues with configuration:

1. Check the [Codegen Documentation](https://docs.codegen.com)
2. Review the [GitHub Issues](https://github.com/your-repo/issues)
3. Join the [Discord Community](https://discord.gg/codegen)
4. Contact [Codegen Support](mailto:support@codegen.com)
