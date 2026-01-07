# Usa a imagem base do Node.js
# FROM node:18
FROM node:18-slim

# 1. Mudamos para node:18-slim (muito mais leve que a 'node:18' padrão)
# 2. Adicionamos o 'rsync' na lista de instalação

# Instala bibliotecas necessárias pro Chrome headless (Puppeteer)
RUN apt-get update && apt-get install -y \
    rsync \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libxshmfence1 \
    ca-certificates \
    fonts-liberation \
    wget \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package*.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
# RUN npm install
# Instala dependências e limpa cache imediatamente para liberar RAM
RUN npm install && npm cache clean --force

# Instala o PM2 globalmente apenas no container
RUN npm install -g pm2

# Copia o restante dos arquivos do projeto
COPY . .

# Compila TypeScript (se aplicável)
# RUN npm run build
# Substitua o antigo RUN npm run build por:
RUN NODE_OPTIONS="--max-old-space-size=1524" npm run build

# Copia o arquivo de configuração do PM2 (se existir)
COPY ecosystem.config.js ./

# Copia o entrypoint customizado
COPY entrypoint.sh /app/entrypoint.sh

# Dá permissão de execução para o script
RUN chmod +x /app/entrypoint.sh

# Expõe as portas em que a aplicação irá rodar
EXPOSE 8070
EXPOSE 8071
EXPOSE 8090

# Define o entrypoint para executar migrações e subir a app
ENTRYPOINT ["/app/entrypoint.sh"]