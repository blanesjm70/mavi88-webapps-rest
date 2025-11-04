import { CfnOutput, SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
	App,
	GitHubSourceCodeProvider,
	RedirectStatus,
} from '@aws-cdk/aws-amplify-alpha';

interface AmplifyStackProps extends StackProps {
	readonly userPoolId: string;
	readonly userPoolClientId: string;
	readonly identityPoolId: string;
	readonly serverURL: string;
	readonly githubOwner: string;
	readonly githubRepository: string;
	readonly customDomain?: string;
	readonly certificateArn?: string;
}

export class AmplifyHostingStack extends Stack {
	public readonly amplifyAppId: CfnOutput;

	constructor(scope: Construct, id: string, props: AmplifyStackProps) {
		super(scope, id, props);

        // Create the Amplify application
		const amplifyApp = new App(this, `TodoWebApp`, {
			sourceCodeProvider: new GitHubSourceCodeProvider({
				owner: props.githubOwner,
				repository: props.githubRepository,
				oauthToken: SecretValue.secretsManager('github-token'),
			}),
			environmentVariables: {
				REGION: this.region,
				IS_MOCK: 'false',
				USER_POOL_ID: props.userPoolId,
				USER_POOL_CLIENT_ID: props.userPoolClientId,
				IDENTITY_POOL_ID: props.identityPoolId,
				SERVER_URL: props.serverURL,
            },
		});

        // Add a branch
        const main = amplifyApp.addBranch('main', {
            autoBuild: true,
            stage: 'PRODUCTION'
        });

        amplifyApp.addCustomRule({
			source:
				'</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>',
			target: '/index.html',
			status: RedirectStatus.REWRITE,
		});

        // Add custom domain if provided
        if (props.customDomain && props.certificateArn) {
            const domain = amplifyApp.addDomain(props.customDomain, {
                subDomains: [
                    {
                        branch: main,
                        prefix: 'todo'
                    }
                ]
            });
        }

        new CfnOutput(this, 'AmplifyAppName', {
			value: amplifyApp.appName,
		});

		new CfnOutput(this, 'AmplifyURL', {
			value: `https://main.${amplifyApp.defaultDomain}`,
		});

		this.amplifyAppId = new CfnOutput(this, 'AmplifyAppId', {
			value: amplifyApp.appId,
		});
    }
}