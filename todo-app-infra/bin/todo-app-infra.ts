#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { AmplifyHostingStack } from '../lib/amplify-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { BackendStack } from '../lib/backend-stack';

const app = new cdk.App();

const account = process.env.AWS_ACCOUNT || app.node.tryGetContext('account') || process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.AWS_REGION || app.node.tryGetContext('region') || process.env.CDK_DEFAULT_REGION;
const githubOwner = process.env.GITHUB_OWNER;
const githubRepository = process.env.GITHUB_REPOSITORY;
const apiDomainName = process.env.API_DOMAIN_NAME;
const hostedZoneDomain = process.env.HOSTED_ZONE_DOMAIN;

if (!githubOwner || !githubRepository || !apiDomainName || !hostedZoneDomain) {
    throw new Error('Missing required environment variables: GITHUB_OWNER, GITHUB_REPOSITORY, API_DOMAIN_NAME, HOSTED_ZONE_DOMAIN');
}

const env = { account, region };

const cognitoStack = new CognitoStack(app, 'TodoAppCognitoStack', {
    env,
});

const backendStack = new BackendStack(app, 'TodoAppBackendStack', {
    env,
    userPoolArn: cognitoStack.userPoolArn.value,
    apiDomainName,
    hostedZoneDomain
});

const amplifyStack = new AmplifyHostingStack(app, 'TodoAppAmplifyHostingStack', {
    env,
    userPoolId: cognitoStack.userPoolId.value,
    userPoolClientId: cognitoStack.userPoolClientId.value,
    identityPoolId: cognitoStack.identityPoolId.value,
    serverURL: backendStack.apiUrl.value,
    githubOwner,
    githubRepository
});
