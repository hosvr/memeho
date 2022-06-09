FROM node:16-alpine

WORKDIR /app

COPY * /app/

CMD ['npm', 'start']
