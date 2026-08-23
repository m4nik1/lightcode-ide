import { app } from 'electron';
import path from 'node:path';

const CODEX_VENDOR_DIRS: Record<string, string> = {
  'darwin-arm64': 'aarch64-apple-darwin',
  'darwin-x64': 'x86_64-apple-darwin',
  'linux-x64': 'x86_64-unknown-linux-musl',
  'linux-arm64': 'aarch64-unknown-linux-musl',
  'win32-x64': 'x86_64-pc-windows-msvc',
  'win32-arm64': 'aarch64-pc-windows-msvc',
};

// The native Codex distribution is copied outside app.asar by Forge.
if (app.isPackaged) {
  const vendorDir = CODEX_VENDOR_DIRS[`${process.platform}-${process.arch}`];
  if (!vendorDir) {
    throw new Error(
      `Unsupported Codex target: ${process.platform}-${process.arch}`,
    );
  }

  const binary = process.platform === 'win32' ? 'codex.exe' : 'codex';
  process.env.LIGHTCODE_CODEX_PATH = path.join(
    process.resourcesPath,
    vendorDir,
    'bin',
    binary,
  );
}
