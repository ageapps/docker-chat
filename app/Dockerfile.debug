FROM node:6.10-slim

MAINTAINER Adrián García Espinosa "age.apps.dev@gmail.com"

# Create app directory
WORKDIR /app

# Bundle app source
COPY . /app

# Install npm and bower dependencies
RUN npm install

RUN npm install nodemon -g

CMD nodemon -L /app/bin/www
