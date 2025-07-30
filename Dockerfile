# Usa a imagem base do Node.js
FROM node:18

# Instala bibliotecas necessárias pro Chrome headless (Puppeteer)
RUN apt-get update && apt-get install -y \
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
RUN npm install

# Instala o PM2 globalmente apenas no container
RUN npm install -g pm2

# Copia o restante dos arquivos do projeto
COPY . .

# Copia o arquivo de configuração do PM2 (se existir)
COPY ecosystem.config.js ./

# Copia o entrypoint customizado
COPY entrypoint.sh /app/entrypoint.sh

# Dá permissão de execução para o script
RUN chmod +x /app/entrypoint.sh

# Expõe as portas em que a aplicação irá rodar
EXPOSE 8070
EXPOSE 8090

# Define o entrypoint para executar migrações e subir a app
ENTRYPOINT ["/app/entrypoint.sh"]