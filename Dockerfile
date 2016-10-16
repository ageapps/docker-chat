FROM node

# Create app directory
RUN mkdir /server
WORKDIR /server

# Bundle app source
COPY app /server/

# Install npm and bower dependencies
RUN npm install
RUN ./node_modules/bower/bin/bower install --allow-root

EXPOSE 4000
CMD npm start
