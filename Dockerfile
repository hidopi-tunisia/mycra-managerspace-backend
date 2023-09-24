FROM node:18.18.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . ./

EXPOSE 3001

CMD ["npm","start"] 