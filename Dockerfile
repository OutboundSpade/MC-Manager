FROM node:17-alpine
WORKDIR /opt
COPY . .

RUN npm install

CMD node .