FROM node:slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY index.js ./
COPY deploy-commands.js ./
COPY commands commands

RUN npm ci
CMD npm run refresh && npm start
