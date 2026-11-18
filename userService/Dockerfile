FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 50051
EXPOSE 50051

CMD ["npm", "start"]