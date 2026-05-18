#!/usr/bin/env node

/**
 * Installation & Verification Script
 * Checks if all prerequisites are installed and configured correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m'
};

const check = {
  PASS: `${Colors.GREEN}✓${Colors.RESET}`,
  FAIL: `${Colors.RED}✗${Colors.RESET}`,
  WARN: `${Colors.YELLOW}⚠${Colors.RESET}`
};

function log(message, status = '') {
  console.log(`${status} ${message}`);
}

function section(title) {
  console.log(`\n${Colors.CYAN}${Colors.BOLD}${'='.repeat(50)}${Colors.RESET}`);
  console.log(`${Colors.CYAN}${title}${Colors.RESET}`);
  console.log(`${Colors.CYAN}${'='.repeat(50)}${Colors.RESET}\n`);
}

function checkCommand(command, displayName = command) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    const version = execSync(`${command} --version`, { encoding: 'utf-8' }).split('\n')[0];
    log(`${displayName}: ${version}`, check.PASS);
    return true;
  } catch (error) {
    log(`${displayName} not found or not in PATH`, check.FAIL);
    return false;
  }
}

function checkFile(filePath, displayName) {
  if (fs.existsSync(filePath)) {
    log(`${displayName} exists`, check.PASS);
    return true;
  } else {
    log(`${displayName} not found`, check.FAIL);
    return false;
  }
}

function checkDirectory(dirPath, displayName, canCreate = false) {
  if (fs.existsSync(dirPath)) {
    log(`${displayName} directory exists`, check.PASS);
    return true;
  } else if (canCreate) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`${displayName} directory created`, check.PASS);
      return true;
    } catch (error) {
      log(`${displayName} directory could not be created: ${error.message}`, check.FAIL);
      return false;
    }
  } else {
    log(`${displayName} directory not found`, check.FAIL);
    return false;
  }
}

function checkNpmPackage(packageName, displayName = packageName) {
  try {
    require.resolve(packageName);
    log(`${displayName} installed`, check.PASS);
    return true;
  } catch (error) {
    log(`${displayName} not installed`, check.FAIL);
    return false;
  }
}

function main() {
  console.clear();
  console.log(`${Colors.CYAN}
╔═══════════════════════════════════════════╗
║  TikTok Ranking Video Generator          ║
║  Installation & Verification Script      ║
╚═══════════════════════════════════════════╝
${Colors.RESET}`);

  let allChecks = true;

  // System Requirements
  section('1. System Requirements');
  
  const hasNode = checkCommand('node', 'Node.js');
  const hasNpm = checkCommand('npm', 'npm');
  const hasFfmpeg = checkCommand('ffmpeg', 'FFmpeg');
  const hasPython = checkCommand('python3', 'Python 3') || checkCommand('python', 'Python');
  const hasYtDlp = checkCommand('yt-dlp', 'yt-dlp');

  if (!hasNode) {
    log('Install Node.js from https://nodejs.org/', check.WARN);
    allChecks = false;
  }
  if (!hasFfmpeg) {
    log('Install FFmpeg from https://ffmpeg.org/download.html', check.WARN);
    allChecks = false;
  }
  if (!hasPython) {
    log('Install Python 3 from https://www.python.org/', check.WARN);
    allChecks = false;
  }
  if (!hasYtDlp && hasPython) {
    log('Install yt-dlp with: pip install yt-dlp', check.WARN);
    allChecks = false;
  }

  // Project Structure
  section('2. Project Structure');

  const projectRoot = __dirname;
  checkDirectory(path.join(projectRoot, 'server'), 'server', false);
  checkDirectory(path.join(projectRoot, 'client'), 'client', false);
  checkDirectory(path.join(projectRoot, 'uploads'), 'uploads', true);
  checkDirectory(path.join(projectRoot, 'output'), 'output', true);
  checkDirectory(path.join(projectRoot, 'temp'), 'temp', true);

  // Project Files
  section('3. Project Files');

  const requiredFiles = {
    'server/server.js': 'Backend Server',
    'server/package.json': 'Server Package Config',
    'client/index.html': 'Frontend HTML',
    'client/app.js': 'Frontend JavaScript',
    'client/styles.css': 'Frontend Styles',
    'client/package.json': 'Client Package Config',
    'package.json': 'Root Package Config',
    'README.md': 'Documentation',
  };

  for (const [file, name] of Object.entries(requiredFiles)) {
    checkFile(path.join(projectRoot, file), name);
  }

  // Dependencies
  section('4. NPM Dependencies');

  const serverPackageJson = path.join(projectRoot, 'server', 'package.json');
  if (fs.existsSync(serverPackageJson)) {
    const serverPackage = JSON.parse(fs.readFileSync(serverPackageJson, 'utf-8'));
    const serverDeps = Object.keys(serverPackage.dependencies || {});
    
    log(`Server dependencies: ${serverDeps.length} packages`, 
        serverDeps.length > 0 ? check.PASS : check.FAIL);

    if (fs.existsSync(path.join(projectRoot, 'server', 'node_modules'))) {
      log('Server node_modules installed', check.PASS);
    } else {
      log('Server node_modules not installed (run: cd server && npm install)', check.WARN);
      allChecks = false;
    }
  }

  const clientPackageJson = path.join(projectRoot, 'client', 'package.json');
  if (fs.existsSync(clientPackageJson)) {
    const clientPackage = JSON.parse(fs.readFileSync(clientPackageJson, 'utf-8'));
    const clientDeps = Object.keys(clientPackage.dependencies || {});
    
    log(`Client dependencies: ${clientDeps.length} packages`, 
        clientDeps.length >= 0 ? check.PASS : check.FAIL);
  }

  // Configuration
  section('5. Configuration');

  const envFile = path.join(projectRoot, 'server', '.env');
  const envExampleFile = path.join(projectRoot, '.env.example');

  if (fs.existsSync(envFile)) {
    log('Server .env file exists', check.PASS);
  } else if (fs.existsSync(envExampleFile)) {
    log('Server .env.example exists (copy to .env)', check.WARN);
  } else {
    log('No environment configuration found', check.FAIL);
    allChecks = false;
  }

  // Port Check
  section('6. Port Availability');

  try {
    execSync('netstat -an', { stdio: 'pipe' });
    log('Port check available', check.PASS);
  } catch {
    log('Port check not available on this system', check.WARN);
  }

  // Final Status
  section('Summary');

  if (allChecks && hasNode && hasNpm && (hasFfmpeg || hasYtDlp)) {
    console.log(`${Colors.GREEN}✓ All checks passed! You're ready to go!${Colors.RESET}\n`);
    console.log(`${Colors.CYAN}Next steps:${Colors.RESET}`);
    console.log(`  1. cd server && npm install`);
    console.log(`  2. cd ../client && npm install`);
    console.log(`  3. Open two terminals`);
    console.log(`  4. Terminal 1: cd server && npm run dev`);
    console.log(`  5. Terminal 2: cd client && npm start`);
    console.log(`  6. Open http://localhost:3000\n`);
    return 0;
  } else {
    console.log(`${Colors.YELLOW}⚠ Some checks failed or prerequisites missing${Colors.RESET}\n`);
    console.log(`${Colors.CYAN}Required:${Colors.RESET}`);
    console.log(`  • Node.js (v16+)`);
    console.log(`  • npm (v7+)`);
    console.log(`  • FFmpeg`);
    console.log(`  • Python 3`);
    console.log(`  • yt-dlp\n`);
    return 1;
  }
}

process.exit(main());
