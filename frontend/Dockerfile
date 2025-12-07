# frontend/Dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json ./

RUN npm install

COPY . .
CMD ["npx", "vite", "dev", "--host", "0.0.0.0"]


