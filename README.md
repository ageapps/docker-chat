# docker-chat

Dockerized chat, based on my previous project [SocketIOChatDemo], which is an example of a web application using *socket.io* library.

This repository is a perfect example for a dockerized application having multiple services like a Database and a Backend. I personally use this project in demos for different technologies like [Kubernetes] or [Docker].

This project tries to follow a [Microservices architecture] where either in the [basic](#basic) setup nor the [advanced](#advanced)  consist on multiple services that run in separate containers



## Demo

This a basic demo of the chat working
![demo](https://github.com/ageapps/docker-chat/blob/master/art/chat_demo.gif?raw=true)

<a name='basic'></a>

## Basic Setup
The basic setup ads to the [SocketIOChatDemo] a database where all mesages will be stored. The resulting system has the following modules and is described in the docker-compose.yaml'':
![basic](https://github.com/ageapps/docker-chat/blob/master/art/arch_1.png?raw=true)

+ __Web service (app):__ [node.js] server. Using the official [node image].
+ __Database service (db):__ [MongoDB] database. Using the official [mongo image].


### Usage with git

```groovy
$ git clone https://github.com/ageapps/docker-chat
$ cd docker-chat
$ docker-compose up
// connect in your browser to <host IP>:8080
```
### Usage with Docker Hub

```groovy
// run mongo service
$ docker run -v "$(pwd)"/database:/data --name mongo_chat_db -d mongo mongod --smallfiles
// run docker-chat image
$ docker run -d --name node_chat_server -v "$(pwd)"/database:/data --link mongo_chat_db:db -p 8080:4000 ageapps/docker-chat
// connect in your browser to <host IP>:8080
```


<a name='advanced'></a>

## Advanced Setup



## Resources
+ [Docker]: Software containerization platform
+ [SocketIOChatDemo]: Chat web application.
+ [node.js]: Server enviroment.
+ [MongoDB]: NoSQL database system.
+ [mongoose]: MongoDB object modeling for *node.js*.
+ [docker-build]: Automated build of *Docker* images.
+ [docker-compose]: Automated configuration and run of multi-container *Docker* applications.
+ [Kubernetes]: Open-source system for automating deployment, scaling, and management of containerized applications.


[here]: http://swarm1397.cloudhero.io:8080/
[Microservices architecture]: http://microservices.io/patterns/microservices.html
[SocketIOChatDemo]: https://github.com/ageapps/SocketIOChatDemo.git
[node image]: https://hub.docker.com/_/node/
[mongo image]: https://hub.docker.com/_/mongo/
[MongoDB]: https://www.mongodb.com
[mongoose]: http://mongoosejs.com/index.html
[node.js]: http://nodejs.org
[Docker]: https://docs.docker.com/
[docker-compose]:https://docs.docker.com/compose/compose-file/
[docker-build]:https://docs.docker.com/engine/reference/builder/
[Kubernetes]:https://kubernetes.io/
