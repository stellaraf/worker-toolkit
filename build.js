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

/** @type import("esbuild").BuildOptions */
const common = {
  outdir: './dist',
  bundle: true,
  minify: false,
  sourcemap: false,
  logLevel: 'error',
  target: 'node12',
  treeShaking: true,
  platform: 'node',
};

/**
 * Transpile and build from source.
 */
async function buildESM() {
  const entryPoints = await glob('./src/**/!(*.test|*types).ts');
  const external = getExternals();
  await esbuild.build({
    format: 'esm',
    external,
    entryPoints,
    outExtension: { '.js': '.mjs' },
    ...common,
  });
  console.log(`✅  ESM Build complete`);
}

/**
 * Transpile and build from source.
 */
async function buildCJS() {
  const entryPoints = await glob('./src/**/!(*.test|*types).ts');
  const external = getExternals();
  await esbuild.build({ format: 'cjs', entryPoints, external, ...common });
  console.log(`✅  CJS Build complete`);
}

async function build() {
  try {
    await buildESM();
    await buildCJS();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
