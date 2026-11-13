// Type checking for required environment variables
interface Config {
  isMock: boolean;
}

const getConfig = (): Config => {
  const isMock = import.meta.env.VITE_IS_MOCK === 'true';

  return {
    isMock,
  };
};

export const config = getConfig();
