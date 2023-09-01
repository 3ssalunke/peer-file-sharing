FROM node:20-alpine AS base

WORKDIR /app

COPY ./client/package*.json ./client/

WORKDIR /app/client
RUN npm install -g typescript
RUN npm install -g vite
RUN npm install --force

ARG WS_HOST
ARG SERVER_HOST
ARG WS_SIZE_LIMIT
ARG TORRENT_SIZE_LIMIT

ENV WS_HOST $WS_HOST
ENV SERVER_HOST $SERVER_HOST
ENV WS_SIZE_LIMIT $WS_SIZE_LIMIT
ENV TORRENT_SIZE_LIMIT $TORRENT_SIZE_LIMIT

COPY ./client ./

EXPOSE 5173
CMD ["npm", "run", "dev"]