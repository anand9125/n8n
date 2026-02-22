# n8n Clone - Workflow Automation Platform

A powerful workflow automation tool inspired by n8n, enabling you to connect apps and automate tasks with a visual interface.

## Features

- **Visual Workflow Builder** - Drag-and-drop interface for creating automation workflows
- **Extensive Integration Support** - Connect with hundreds of apps and services
- **Custom Node Development** - Build your own nodes to extend functionality
- **Conditional Logic** - Add branching and decision-making to your workflows
- **Error Handling** - Built-in retry mechanisms and error workflows
- **Webhook Support** - Trigger workflows via HTTP requests
- **Scheduled Executions** - Run workflows on a schedule using cron expressions
- **Self-Hosted** - Full control over your data and infrastructure
- **Real-time Execution** - Monitor workflow executions in real-time
- **Execution History** - Track and debug past workflow runs

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL / MongoDB
- **Queue System**: Bull (Redis-based)
- **Authentication**: JWT

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher) or MongoDB
- Redis (for queue management)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/n8n-clone.git
cd n8n-clone
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5678
NODE_ENV=development

# Database Configuration
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=n8n_clone
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your_encryption_key_for_credentials

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5678/api
```

### 4. Database Setup

Run database migrations:

```bash
cd backend
npm run migrate
```

### 5. Start the Application

**Development Mode:**

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start

# Terminal 3 - Start Worker (for executing workflows)
cd backend
npm run worker
```

**Production Mode:**

```bash
# Build frontend
cd frontend
npm run build

# Start backend with worker
cd ../backend
npm run start:prod
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5678

## Usage

### Creating Your First Workflow

1. Navigate to the Workflows page
2. Click "Create New Workflow"
3. Drag nodes from the left panel onto the canvas
4. Connect nodes by dragging from one node's output to another's input
5. Configure each node by clicking on it
6. Click "Execute Workflow" to test
7. Save your workflow

### Available Node Types

- **Trigger Nodes**: Webhook, Schedule, Manual
- **Action Nodes**: HTTP Request, Email, Database Operations
- **Logic Nodes**: IF, Switch, Merge
- **Transform Nodes**: Set, Function, Code

### API Endpoints

```
POST   /api/workflows          - Create a new workflow
GET    /api/workflows          - Get all workflows
GET    /api/workflows/:id      - Get workflow by ID
PUT    /api/workflows/:id      - Update workflow
DELETE /api/workflows/:id      - Delete workflow
POST   /api/workflows/:id/execute - Execute workflow
GET    /api/executions         - Get execution history
```

## Development

### Project Structure

```
n8n-clone/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── nodes/          # Node implementations
│   │   ├── workers/        # Background workers
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Creating Custom Nodes

1. Create a new file in `backend/src/nodes/`
2. Implement the node interface:

```typescript
export class CustomNode implements INode {
  name = 'customNode';
  displayName = 'Custom Node';
  group = ['transform'];
  
  properties = [
    {
      displayName: 'Property Name',
      name: 'propertyName',
      type: 'string',
      default: '',
    }
  ];
  
  async execute(context: IExecuteContext): Promise<INodeExecutionData[]> {
    // Your node logic here
    return context.inputData;
  }
}
```

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: n8n_clone
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: n8n_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  backend:
    build: ./backend
    ports:
      - "5678:5678"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_HOST: postgres
      REDIS_HOST: redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Configuration

### Webhook URL Configuration

By default, webhooks are available at:
```
http://localhost:5678/webhook/{workflowId}
```

For production, configure your domain in the environment variables.

### Scaling Workers

To handle more concurrent executions, run multiple worker instances:

```bash
npm run worker -- --concurrency 10
```

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Redis Connection Failed**
- Verify Redis is running
- Check Redis host and port in `.env`

**Workflows Not Executing**
- Ensure worker process is running
- Check execution logs in the database
- Verify node credentials are configured

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed
- Use meaningful commit messages

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email security@yourdomain.com instead of using the issue tracker.

### Best Practices

- Never commit `.env` files
- Use strong JWT secrets
- Regularly update dependencies
- Enable HTTPS in production
- Implement rate limiting for webhooks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [n8n.io](https://n8n.io)
- Built with amazing open-source libraries
- Thanks to all contributors

## Roadmap

- [ ] Additional node integrations (Slack, Discord, Notion)
- [ ] Advanced error recovery mechanisms
- [ ] Workflow templates marketplace
- [ ] Multi-tenant support
- [ ] Advanced analytics and monitoring
- [ ] Mobile app for monitoring
- [ ] AI-powered workflow suggestions

## Support

- **Documentation**: [docs.yourdomain.com](https://docs.yourdomain.com)
- **Community Forum**: [community.yourdomain.com](https://community.yourdomain.com)
- **Discord**: [Join our Discord](https://discord.gg/yourserver)
- **Email**: support@yourdomain.com

## Changelog

### Version 1.0.0 (2024-01-15)
- Initial release
- Basic workflow builder
- 20+ built-in nodes
- Webhook and schedule triggers
- Execution history

---

**Built with ❤️ by Your Team**