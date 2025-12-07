# frontend/Dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json ./

COPY . .
CMD ["npx", "vite", "dev", "--host", "0.0.0.0"]


