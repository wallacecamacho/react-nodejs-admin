FROM nginx:latest

RUN useradd -U www

RUN mkdir /etc/nginx/logs/
RUN touch /etc/nginx/logs/error.log

# swap the default server file.
COPY conf/fastcgi.conf /etc/nginx/
COPY conf/mime.types /etc/nginx/
COPY conf/proxy.conf /etc/nginx/
COPY conf/nginx.conf /etc/nginx/