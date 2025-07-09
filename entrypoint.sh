#!/bin/sh

echo "⏳ Executando migrações do banco..."
npx sequelize-cli db:migrate

echo "🚀 Iniciando aplicação com PM2..."
pm2-runtime ecosystem.config.js

echo "✅ Aplicação iniciada com sucesso!"