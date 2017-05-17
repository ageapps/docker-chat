FROM mongo:3.5

MAINTAINER Adrián García Espinosa "age.apps.dev@gmail.com"

ENV MONGO_INITDB_ROOT_USERNAME admin
ENV MONGO_INITDB_ROOT_PASSWORD password
# Create app directory
COPY setUpUsers.sh /docker-entrypoint-initdb.d/

