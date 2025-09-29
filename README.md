# Codegen Agent Dashboard

A comprehensive Next.js dashboard for autonomous development workflows powered by Codegen API integration. This application provides real-time monitoring, task orchestration, and AI-powered autonomous development capabilities.

## 🚀 Features

### Core Functionality
- **Autonomous Development Orchestrator**: AI-powered workflows that automatically review, fix, test, and optimize code
- **Real-time Monitoring**: Live dashboard with performance metrics, system health, and activity tracking
- **Repository Management**: Connect and manage multiple GitHub repositories with automated agent configuration
- **Task Queue Management**: Advanced queue system with priority handling, dependencies, and progress tracking
- **Agent Configuration**: Granular control over AI agent behavior, triggers, and automation settings

### Dashboard Components
- **Overview**: Key metrics, recent activity, and system status at a glance
- **Queue Management**: Real-time task monitoring with pause/resume/clear controls
- **Repository Management**: Connect repositories, configure agents, and monitor activity
- **Agent Configuration**: Set up automation rules, triggers, filters, and thresholds
- **Monitoring & Analytics**: Performance charts, system health, and detailed analytics
- **Security**: Vulnerability scanning and security monitoring

### Autonomous Workflows
- **Full Development Cycle**: Complete autonomous development from review to deployment
- **Quick Review & Fix**: Fast review and automatic fixes for urgent issues
- **Test Generation**: Comprehensive test coverage generation
- **Performance Optimization**: Code optimization and performance improvements
- **Documentation**: Automatic documentation generation and updates

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript (strict mode)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with CSS variables

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codegen-agent-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Codegen API configuration:
   ```env
   CODEGEN_API_KEY=your_api_key_here
   CODEGEN_BASE_URL=https://api.codegen.com
   CODEGEN_ORGANIZATION_ID=your_org_id
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Codegen API Setup

1. **Get your API key** from the Codegen dashboard
2. **Configure your organization** and repository settings
3. **Set up webhooks** for real-time updates (optional)

### Agent Configuration

The dashboard allows you to configure:
- **Automation Settings**: Enable/disable specific automated actions
- **Trigger Settings**: Configure when agents should be activated
- **Filter Settings**: Define which files and paths to process
- **Threshold Settings**: Set limits and performance thresholds

## 📊 Usage

### Getting Started

1. **Configure API Connection**: Enter your Codegen API credentials in the settings
2. **Connect Repositories**: Add your GitHub repositories to the dashboard
3. **Configure Agents**: Set up autonomous development workflows
4. **Monitor Activity**: Watch real-time activity and performance metrics

### Autonomous Workflows

1. **Start Autonomous Workflow**: Click "Start Autonomous Workflow" in the Agents tab
2. **Monitor Progress**: Track task execution in the Queue Management tab
3. **View Results**: Check completed tasks and generated artifacts
4. **Analyze Performance**: Review analytics and optimization suggestions

### Queue Management

- **Add Tasks**: Manually add tasks to the queue or let autonomous workflows handle it
- **Control Execution**: Pause, resume, or clear the entire queue
- **Monitor Progress**: Real-time progress tracking with detailed logs
- **Handle Dependencies**: Tasks can depend on other tasks for proper execution order

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── dashboard/         # Dashboard components
│   │   ├── stats-overview.tsx
│   │   ├── queue-management.tsx
│   │   ├── repository-management.tsx
│   │   ├── agent-configuration.tsx
│   │   ├── autonomous-orchestrator.tsx
│   │   └── monitoring-analytics.tsx
│   ├── providers/         # React context providers
│   │   ├── codegen-provider.tsx
│   │   └── query-provider.tsx
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api/               # API client
│   │   └── codegen-client.ts
│   ├── hooks/             # Custom React hooks
│   │   └── use-codegen.ts
│   ├── types/             # TypeScript type definitions
│   │   └── codegen.ts
│   └── utils.ts           # Utility functions
```

## 🔌 API Integration

The dashboard integrates with Codegen's comprehensive API:

### Core Endpoints
- **Repositories**: Manage connected repositories
- **Pull Requests**: Monitor and manage pull requests
- **Checks**: Track CI/CD checks and results
- **Actions**: Execute automated development actions
- **Queue**: Manage task queues and workflows
- **Webhooks**: Real-time event notifications

### Authentication
- **API Key**: Bearer token authentication
- **Organization**: Multi-tenant organization support
- **Repository**: Per-repository configuration and permissions

## 📈 Monitoring & Analytics

### Real-time Metrics
- **Success Rates**: Track automation success rates
- **Response Times**: Monitor API and task response times
- **Queue Performance**: Track queue processing efficiency
- **System Health**: Monitor system resources and status

### Performance Analytics
- **Trend Analysis**: Historical performance trends
- **Workflow Analytics**: Detailed workflow performance metrics
- **Resource Usage**: CPU, memory, and storage monitoring
- **Alert System**: Automated alerts for issues and anomalies

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   vercel login
   vercel link
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t codegen-agent-dashboard .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e CODEGEN_API_KEY=your_key \
     -e CODEGEN_BASE_URL=your_url \
     codegen-agent-dashboard
   ```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Codegen Docs](https://docs.codegen.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [Codegen Community](https://discord.gg/codegen)

## 🙏 Acknowledgments

- **Codegen Team** for the amazing API and platform
- **Vercel** for the excellent Next.js framework and deployment platform
- **Radix UI** for the accessible component primitives
- **TanStack** for the powerful React Query library

---

**Built with ❤️ for autonomous development**