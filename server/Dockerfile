FROM node:20-alpine AS base

WORKDIR /app

COPY ./server/package*.json ./server/

WORKDIR /app/server
RUN npm install -g typescript
RUN npm install

COPY ./server ./

ENV NODE_ENV "development"
ENV ORIGIN=
ENV PORT=
ENV WS_SIZE_LIMIT=
ENV DISABLE_SSE_EVENTS=
ENV TRUST_PROXY=

EXPOSE 3030
CMD ["npm", "start"]