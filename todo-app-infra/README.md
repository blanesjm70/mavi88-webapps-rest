# Todo App Infrastructure

This CDK project deploys the infrastructure for a serverless Todo application including:
- Cognito User Pool for authentication
- API Gateway with Lambda backend
- DynamoDB table for data storage
- Amplify hosting for the frontend
- Custom domain configuration

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

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy --all`  deploy all stacks to your AWS account
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
* `npx cdk destroy --all` destroy all deployed stacks
