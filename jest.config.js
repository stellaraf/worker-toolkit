module.exports = async () => {
  const { Headers, Request, Response } = await import('node-fetch');

  /** @type {import('@jest/types').Config.InitialOptions} */
  const config = {
    globals: { Headers, Request, Response },
    transform: {
      '^.+\\.tsx?$': [
        'esbuild-jest',
        {
          target: 'es2016',
        },
      ],
    },
  };
  return config;
};
