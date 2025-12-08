# frontend/Dockerfile
FROM node:22-slim
WORKDIR /app/frontend
COPY package*.json ./


RUN npm install


COPY . .
CMD ["npm", "run", "dev"]
#CMD ["npx", "vite", "dev", "--host", "0.0.0.0"]


