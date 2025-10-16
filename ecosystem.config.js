module.exports = {
   apps: [
      {
         name: "servereducapp",
         script: "dist/index.js",
         // instances: 1, // ou "max" para escalar com CPUs
         instances: "max",
         autorestart: true,
         watch: false,
         max_memory_restart: "300M",
         env: {
            NODE_ENV: "production",
         },
      },
   ],
};
