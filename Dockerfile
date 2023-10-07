FROM node:20-alpine3.17

RUN yarn global add nodemon

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

ARG APP_PORT
EXPOSE ${APP_PORT}

# overrite by the docker-compose command
CMD [ "yarn", "dev" ]