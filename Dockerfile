FROM node:12.7-alpine
WORKDIR /var/www/app
COPY package.json ./
RUN yarn
COPY . .
EXPOSE 3000
CMD npm start
