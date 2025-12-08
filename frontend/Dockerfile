# frontend/Dockerfile
FROM node:22-slim

WORKDIR /app/frontend
COPY package*.json ./


RUN npm install

RUN npm install && npm install @mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled

COPY . .
CMD ["npm", "run", "dev"]
#CMD ["npx", "vite", "dev", "--host", "0.0.0.0"]


