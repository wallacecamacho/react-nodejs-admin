FROM node:8.12.0-jessie

WORKDIR /opt/app

COPY package.json .
RUN npm install nodemon -g
RUN npm install --quiet --silent --progress=false


COPY . .
