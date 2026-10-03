import { execSync } from 'node:child_process';
import path from 'node:path';

const npmCli = 'C:\\Users\\M.PRANAV ESHAN\\AppData\\Local\\Author Software\\nvm\\installs\\v26.8.2\\node_modules\\npm\\bin\\npm-cli.js';

const env = {
  ...process.env,
  CI: 'true',
  npm_config_progress: 'false',
  npm_config_loglevel: 'error',
  npm_config_fund: 'false',
  npm_config_audit: 'false'
};

console.log('[1/2] Installing backend dependencies in CI mode...');
execSync(`"${process.execPath}" "${npmCli}" install --no-audit --no-fund --silent`, {
  cwd: path.resolve(process.cwd(), 'backend'),
  env,
  stdio: 'inherit'
});
console.log('Backend dependencies installed!');

console.log('[2/2] Installing frontend dependencies in CI mode...');
execSync(`"${process.execPath}" "${npmCli}" install --no-audit --no-fund --silent`, {
  cwd: path.resolve(process.cwd(), 'frontend'),
  env,
  stdio: 'inherit'
});
console.log('Frontend dependencies installed!');
console.log('ALL DEPENDENCIES READY!');
