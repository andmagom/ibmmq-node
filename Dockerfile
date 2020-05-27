FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
RUN apk add wget
RUN apk add curl
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production  && mv node_modules ../
COPY . .
EXPOSE 3000
CMD node index.js