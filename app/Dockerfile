FROM node:9.1-slim

MAINTAINER Adrián García Espinosa "age.apps.dev@gmail.com"

# Create app directory
WORKDIR /server

# nodemon for development
RUN npm install -gq nodemon

COPY package.json ./
# Install npm and bower dependencies
RUN npm install -q

# Bundle app source
COPY . /server

# EXPOSE '${PORT}'

CMD [ "npm", "start" ]
