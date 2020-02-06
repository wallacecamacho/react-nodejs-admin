FROM node:8

RUN useradd --user-group --create-home --shell /bin/false desenv &&\
  npm install --global npm@3.7.5

ENV HOME=/opt/apt

COPY package*.json ./ $HOME/library/
RUN chown -R desenv:desenv $HOME/*
RUN chmod 755 desenv:desenv $HOME/*

USER desenv
WORKDIR $HOME/library
RUN npm cache clean && npm install --silent --progress=false

USER root
COPY . $HOME/library
RUN chown -R desenv:desenv $HOME/*
USER desenv

CMD ["npm", "start"]

FROM redis
COPY bin/conf/redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]