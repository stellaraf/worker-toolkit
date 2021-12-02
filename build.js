const esbuild = require('esbuild');
const glob = require('tiny-glob');

/**
 * Transpile and build from source.
 */
async function build() {
  const entryPoints = await glob('./src/**/!(*.test|*types).ts');

  /** @type import("esbuild").BuildOptions */
  const options = {
    outdir: './dist',
    bundle: true,
    format: 'esm',
    minify: false,
    sourcemap: false,
    logLevel: 'error',
    target: ['esnext', 'node12'],
    treeShaking: true,
    platform: 'node',
    entryPoints,
  };
  try {
    await esbuild.build(options);
    console.log(`✅  Build complete => 'dist/index.js'`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
