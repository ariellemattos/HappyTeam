FROM node:10.9.0
WORKDIR /var/www/app
COPY package.json ./
RUN yarn
COPY . .
EXPOSE 3000
CMD npm start