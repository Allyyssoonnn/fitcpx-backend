module.exports = {
   apps: [
      {
         name: "servereducapp",
         script: "dist/index.js",
         instances: 1, // ou "max" para escalar com CPUs
         autorestart: true,
         watch: true,
         max_memory_restart: "300M",
         env: {
            NODE_ENV: "production",
         },
      },
   ],
};
