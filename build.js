const esbuild = require('esbuild');

/**
 * Transpile and build worker from source.
 */
async function buildWorker() {
  /**
   * @type import("esbuild").BuildOptions
   */
  const options = {
    outdir: './dist',
    bundle: true,
    minify: true,
    sourcemap: false,
    logLevel: 'error',
    target: 'es2016',
    platform: 'node',
    entryPoints: {
      worker: 'src/index.ts',
    },
  };
  try {
    await esbuild.build(options);
    console.log(`✅  Build complete => 'dist/index.js'`);
  } catch (err) {
    console.error(err);
  }
}

buildWorker();
