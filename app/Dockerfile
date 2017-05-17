FROM node:6.10-slim

MAINTAINER Adrián García Espinosa "age.apps.dev@gmail.com"

# Create app directory
WORKDIR /server

# Bundle app source
COPY . /server

# Install npm and bower dependencies
RUN npm install

CMD npm start
