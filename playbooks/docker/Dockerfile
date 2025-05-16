FROM nginx:stable-alpine

LABEL org.opencontainers.image.source=https://github.com/ruchira088/tic-tac-toe-front-end

COPY ./playbooks/docker/default.conf /etc/nginx/conf.d/default.conf

COPY ./build/client /opt/tic-tac-toe-front-end

EXPOSE 80
