import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'node:path';
import { existsSync } from 'node:fs';

// The Codex CLI is a native binary that cannot be executed from inside
// app.asar, so it is copied into the app's Resources directory instead.
// At runtime the main process points codex-protocol at the copied target
// directory via LIGHTCODE_CODEX_PATH (see src/server-env.ts).
const CODEX_VENDOR_DIRS: Record<string, string> = {
  'darwin-arm64': 'aarch64-apple-darwin',
  'darwin-x64': 'x86_64-apple-darwin',
  'linux-x64': 'x86_64-unknown-linux-musl',
  'linux-arm64': 'aarch64-unknown-linux-musl',
  'win32-x64': 'x86_64-pc-windows-msvc',
  'win32-arm64': 'aarch64-pc-windows-msvc',
};

function resolveCodexVendorDir(): string | undefined {
  const vendorSubdir = CODEX_VENDOR_DIRS[`${process.platform}-${process.arch}`];
  if (!vendorSubdir) return undefined;

  const candidates = [
    path.resolve(__dirname, `node_modules/@openai/codex-${process.platform}-${process.arch}/vendor/${vendorSubdir}`),
    path.resolve(__dirname, `../../node_modules/@openai/codex-${process.platform}-${process.arch}/vendor/${vendorSubdir}`),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

const codexVendorDir = resolveCodexVendorDir();
if (!codexVendorDir) {
  throw new Error(
    `Codex CLI binary not found for ${process.platform}-${process.arch}. Run 'npm install' first.`,
  );
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource: [codexVendorDir],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
