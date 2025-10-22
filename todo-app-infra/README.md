# Todo App Infrastructure

This CDK project deploys the infrastructure for a serverless Todo application with custom domain support.

## Architecture Overview

The application is deployed across **4 separate CDK stacks** for better organization and deployment flexibility:

### 1. CertificateStack (us-east-1)
- **Purpose**: SSL certificate for Amplify/CloudFront
- **Region**: `us-east-1` (required by AWS for global services)
- **Certificate**: Wildcard certificate (`*.yourdomain.com`)
- **Validation**: DNS validation via Route53

### 2. CognitoStack (your-region)
- **Purpose**: User authentication and authorization
- **Resources**: Cognito User Pool, User Pool Client, Identity Pool
- **Region**: Same as your main deployment region

### 3. BackendStack (your-region)
- **Purpose**: API and data storage
- **Resources**: 
  - API Gateway with custom domain
  - Lambda function for business logic
  - DynamoDB table with GSI
  - SSL certificate for API Gateway (regional)
- **Region**: Same as your main deployment region

### 4. AmplifyHostingStack (your-region)
- **Purpose**: Frontend hosting and deployment
- **Resources**: Amplify App with custom domain
- **Region**: Same as your main deployment region
- **Uses**: Certificate from CertificateStack

## Certificate Strategy

**Why two separate certificates?**

This architecture uses **two SSL certificates** due to AWS technical requirements:

1. **Regional Certificate** (BackendStack)
   - **Location**: Same region as your deployment (e.g., `eu-west-1`)
   - **Purpose**: API Gateway regional endpoint
   - **Domain**: Specific subdomain (e.g., `api.yourdomain.com`)

2. **Global Certificate** (CertificateStack)
   - **Location**: `us-east-1` (AWS requirement)
   - **Purpose**: Amplify/CloudFront (global services)
   - **Domain**: Wildcard (`*.yourdomain.com`)

**This is standard AWS practice** - you cannot reuse certificates across regions, and global services like CloudFront/Amplify always require certificates in `us-east-1`.

## Domain Configuration

With the example configuration:
- **API**: `https://test.yourdomain.com`
- **Web App**: `https://todo.yourdomain.com`
- **Root Domain**: `yourdomain.com`

Both subdomains are covered by the wildcard certificate in the CertificateStack.

## Environment Configuration

### Required Environment Variables

This project requires environment variables to be configured. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```bash
# AWS Configuration
AWS_ACCOUNT=your-aws-account-id
AWS_REGION=your-aws-region

# GitHub Repository (for Amplify)
GITHUB_OWNER=your-github-username
GITHUB_REPOSITORY=your-repository-name

# Domain Configuration
API_DOMAIN_NAME=your-api-domain.com
HOSTED_ZONE_DOMAIN=your-domain.com
```

### Environment Variables Description

- `AWS_ACCOUNT`: Your AWS account ID (12-digit number)
- `AWS_REGION`: AWS region to deploy resources (e.g., us-east-1, eu-west-1)
- `GITHUB_OWNER`: GitHub username or organization that owns the frontend repository
- `GITHUB_REPOSITORY`: Name of the GitHub repository containing the frontend code
- `API_DOMAIN_NAME`: Custom domain for your API (subdomain of HOSTED_ZONE_DOMAIN)
- `HOSTED_ZONE_DOMAIN`: Your root domain name (must have a Route53 hosted zone)

**Note**: The web app will automatically use `todo.{HOSTED_ZONE_DOMAIN}` as its custom domain.

### GitHub Actions / CI/CD

For deployment via GitHub Actions, set these as repository secrets:
- `AWS_ACCOUNT`
- `AWS_REGION` 
- `GITHUB_OWNER`
- `GITHUB_REPOSITORY`
- `API_DOMAIN_NAME`
- `HOSTED_ZONE_DOMAIN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. Node.js 18+ installed
3. Route53 hosted zone for your domain
4. GitHub personal access token stored in AWS Secrets Manager as `github-token`

## Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (see above)

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy all stacks:
   ```bash
   npx cdk deploy --all
   ```

### Deployment Order

The stacks have dependencies and will deploy in this order:
1. `TodoAppCertificateStack` (us-east-1) - Independent
2. `TodoAppCognitoStack` - Independent  
3. `TodoAppBackendStack` - Depends on Cognito
4. `TodoAppAmplifyHostingStack` - Depends on Backend and Certificate

### Individual Stack Deployment

You can also deploy stacks individually:
```bash
npx cdk deploy TodoAppCertificateStack
npx cdk deploy TodoAppCognitoStack
npx cdk deploy TodoAppBackendStack
npx cdk deploy TodoAppAmplifyHostingStack
```

## Architecture Decisions

### Why Separate Certificate Stack?
- **Regional Requirements**: API Gateway needs certificates in the same region
- **Global Requirements**: Amplify/CloudFront requires certificates in us-east-1
- **Separation of Concerns**: Each stack manages its own resources
- **Deployment Flexibility**: Can update certificates independently

### Why Multiple Stacks?
- **Modularity**: Each stack has a single responsibility
- **Deployment Control**: Deploy/update components independently
- **Resource Organization**: Easier to manage and troubleshoot
- **Cross-Region Support**: Certificate stack can be in different region

### Custom Domain Strategy
- **Wildcard Certificate**: Covers all subdomains (`*.yourdomain.com`)
- **Automatic Subdomain**: Web app uses `todo.yourdomain.com`
- **DNS Management**: All DNS records managed via Route53
- **SSL Everywhere**: Both API and web app use HTTPS

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy --all`  deploy all stacks to your AWS account
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
* `npx cdk destroy --all` destroy all deployed stacks
