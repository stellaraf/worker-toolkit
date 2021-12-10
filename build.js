const esbuild = require('esbuild');
const glob = require('tiny-glob');
const fs = require('fs');

function getExternals() {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  return Array.from(
    new Set(
      Object.keys(
        Object.assign(
          {},
          pkg.dependencies || {},
          pkg.devDependencies || {},
          pkg.peerDependencies || {},
        ),
      ),
    ),
  );
}

/**
 * Transpile and build from source.
 */
async function build() {
  const entryPoints = await glob('./src/**/!(*.test|*types).ts');
  const external = getExternals();

  /** @type import("esbuild").BuildOptions */
  const options = {
    outdir: './dist',
    format: 'esm',
    bundle: true,
    minify: false,
    sourcemap: false,
    logLevel: 'error',
    target: 'node12',
    treeShaking: true,
    platform: 'node',
    entryPoints,
    external,
  };
  try {
    await esbuild.build(options);
    console.log(`✅  Build complete`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
