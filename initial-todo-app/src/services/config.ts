// Type checking for required environment variables
interface Config {
  isMock: boolean;
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
  serverUrl: string;
}

const getConfig = (): Config => {
  const isMock = import.meta.env.VITE_IS_MOCK === 'true';
  const userPoolId = import.meta.env.VITE_USER_POOL_ID;
  const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID;
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  return {
    isMock,
    userPoolId,
    userPoolClientId,
    identityPoolId,
    serverUrl
  };
};

export const config = getConfig();
