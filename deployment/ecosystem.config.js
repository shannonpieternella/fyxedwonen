module.exports = {
  apps: [{
    name: 'fyxedwonen-backend',
    script: './server/server.js',
    cwd: '/var/www/fyxedwonen',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: '/var/log/pm2/fyxedwonen-error.log',
    out_file: '/var/log/pm2/fyxedwonen-out.log',
    log_file: '/var/log/pm2/fyxedwonen-combined.log',
    time: true
  }]
};