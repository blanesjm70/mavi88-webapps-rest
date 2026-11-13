import { config } from './config';


const awsconfig = {
		Auth: {
		  Cognito: {
			userPoolClientId: config.userPoolClientId,
			userPoolId: config.userPoolId,
			identityPoolId: config.identityPoolId,
		  },
		}  
};

export default awsconfig;