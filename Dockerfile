FROM node:20-alpine3.17

USER node

# Create app directory
WORKDIR /home/node


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./

RUN yarn

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

EXPOSE 8080

# overrite by the docker-compose command
CMD [ "yarn", "dev" ]


# staging

# FROM node:16.0-alpine3.13 AS build
# RUN yarn global add http-server
# WORKDIR /node/app
# COPY package*.json ./
# RUN yarn
# COPY . .
# RUN yarn build
# EXPOSE 8080
# CMD [ "http-server", "dist" ]


# production

# FROM nginx:stable-alpine as production
# COPY --from=build /node/app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]