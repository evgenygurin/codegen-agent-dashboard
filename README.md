# 🤖 Codegen Agent Dashboard

**Autonomous Codegen Agent Dashboard** - A Next.js application with comprehensive Codegen API integration, real-time statistics visualization, queue management, and fully autonomous development workflows.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/codegen-agent-dashboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

## ✨ Features

### 🎯 Core Capabilities
- **Real-time Dashboard** - Comprehensive statistics and performance monitoring
- **Queue Management** - Advanced task scheduling and priority management
- **Autonomous Orchestration** - Self-healing and self-optimizing system
- **Multi-Repository Support** - Manage multiple Codegen repositories
- **Security Monitoring** - Real-time security scanning and vulnerability management

### 🚀 Advanced Features
- **Ultrathink Mode** - Fully autonomous decision-making and workflow execution
- **Predictive Analytics** - AI-powered insights and recommendations
- **Auto-scaling** - Dynamic resource allocation based on workload
- **Real-time Notifications** - Instant alerts for critical events
- **Advanced Filtering** - Smart search and filtering capabilities

### 🛠️ Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: TanStack Query (React Query)
- **API Integration**: Axios, Custom Codegen Client
- **Charts & Visualization**: Recharts
- **Deployment**: Vercel, Docker support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Codegen API key and access
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/evgenygurin/codegen-agent-dashboard.git
cd codegen-agent-dashboard
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your Codegen API credentials
```

4. **Start development server**
```bash
pnpm dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required - Codegen API Configuration
CODEGEN_API_KEY=your_codegen_api_key_here
CODEGEN_BASE_URL=https://api.codegen.com
CODEGEN_REPOSITORY_ID=your_repository_id
CODEGEN_ORGANIZATION_ID=your_organization_id

# Optional - Advanced Features
ENABLE_AUTONOMOUS_MODE=true
ENABLE_AUTO_DEPLOYMENT=false
MAX_CONCURRENT_TASKS=10
```

See `.env.example` for a complete list of configuration options.

### Codegen API Setup

1. **Get API Key**: Obtain your Codegen API key from your account settings
2. **Repository Access**: Ensure your API key has access to the repositories you want to manage
3. **Permissions**: Verify that your API key has sufficient permissions for:
   - Repository management
   - Pull request operations
   - Check runs and status updates
   - Webhook management

## 📊 Dashboard Overview

### Overview Tab
- **Quick Actions**: One-click operations for common tasks
- **Statistics Cards**: Key metrics and performance indicators
- **Recent Activity**: Live feed of recent events and actions

### Queue Management
- **Task Queue**: View and manage queued, running, and completed tasks
- **Priority Management**: Adjust task priorities and dependencies
- **Resource Monitoring**: Track resource usage and capacity
- **Auto-scaling Controls**: Configure automatic scaling behavior

### Repository Management
- **Multi-repo Support**: Connect and manage multiple repositories
- **Health Monitoring**: Track repository health and activity
- **Configuration**: Per-repository settings and automation rules

### Autonomous Agents
- **Orchestrator**: Configure the autonomous decision-making system
- **Performance Tuning**: Adjust AI behavior and confidence thresholds
- **Learning Analytics**: View learning progress and decision accuracy

### Monitoring
- **System Health**: Real-time system status and performance metrics
- **Error Tracking**: Monitor and analyze errors and failures
- **Performance Analytics**: Detailed performance insights and trends

### Security
- **Vulnerability Scanning**: Automated security scanning
- **Access Control**: Manage permissions and access levels
- **Audit Logs**: Complete audit trail of all actions and decisions

## 🤖 Autonomous Mode

The dashboard includes a sophisticated autonomous orchestration system that can:

- **Self-Monitor**: Continuously monitor system health and performance
- **Auto-Repair**: Automatically detect and fix common issues
- **Predictive Scaling**: Scale resources based on predicted demand
- **Intelligent Decision Making**: Make autonomous decisions with configurable confidence levels
- **Learning System**: Learn from outcomes to improve future decisions

### Enabling Autonomous Mode

1. Set `ENABLE_AUTONOMOUS_MODE=true` in your environment
2. Configure thresholds and parameters in the Agents tab
3. Monitor autonomous decisions in the dashboard
4. Adjust settings based on performance and requirements

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **One-click Deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/codegen-agent-dashboard)

2. **Manual Deployment**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

3. **Configure Environment Variables**
   Add your environment variables in the Vercel dashboard under Settings > Environment Variables.

### Deploy with Docker

```bash
# Build Docker image
docker build -t codegen-dashboard .

# Run container
docker run -p 3000:3000 --env-file .env.local codegen-dashboard
```

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js applications:
- Netlify
- Railway
- Heroku
- AWS Amplify
- Google Cloud Run

## 🔧 Development

### Project Structure

```text
src/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   ├── providers/        # Context providers
│   └── ui/              # Reusable UI components
├── lib/                  # Utility libraries
│   ├── api/             # API clients and endpoints
│   ├── autonomous/      # Autonomous orchestration logic
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── utils.ts         # Utility functions
```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Deployment
vercel                # Deploy to Vercel
```

### Adding New Features

1. **Create Components**: Add new components in `src/components/`
2. **Add API Endpoints**: Extend the Codegen client in `src/lib/api/`
3. **Update Types**: Add TypeScript types in `src/lib/types/`
4. **Create Hooks**: Add React hooks in `src/lib/hooks/`
5. **Test**: Add tests for new functionality

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `pnpm test`
6. Commit your changes: `git commit -m 'feat: add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Connection Issues**
- Verify your Codegen API key is valid and has proper permissions
- Check that the base URL is correct
- Ensure your network allows connections to the Codegen API

**Performance Issues**
- Adjust the `MAX_CONCURRENT_TASKS` environment variable
- Monitor system resources and scale if necessary
- Check for network latency issues

**Build Issues**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `pnpm type-check`

### Getting Help

- 📖 [Documentation](https://docs.codegen.com)
- 💬 [Discord Community](https://discord.gg/codegen)
- 🐛 [Issue Tracker](https://github.com/evgenygurin/codegen-agent-dashboard/issues)
- 📧 [Email Support](mailto:support@codegen.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Codegen](https://codegen.com) - For the amazing AI-powered development platform
- [Vercel](https://vercel.com) - For the excellent hosting and deployment platform
- [Next.js](https://nextjs.org) - For the powerful React framework
- [Radix UI](https://radix-ui.com) - For the accessible UI components
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework

---

**Built with ❤️ by the Codegen community**

[![Star on GitHub](https://img.shields.io/github/stars/evgenygurin/codegen-agent-dashboard?style=social)](https://github.com/evgenygurin/codegen-agent-dashboard)
