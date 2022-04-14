FROM node:16-alpine3.14 AS build

COPY --chown=node:node . /home/node/app
COPY --chown=node:node docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR /home/node/app
USER node
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]