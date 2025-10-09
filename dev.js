#!/usr/bin/env node
const { spawn } = require('child_process');

function run(cmd, args, cwd) {
  const p = spawn(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  p.on('close', (code) => {
    if (code !== 0) process.exit(code);
  });
  return p;
}

console.log('Starting server and client...');
run('npm', ['start'], 'server');
setTimeout(() => run('npm', ['start'], 'client'), 1500);

