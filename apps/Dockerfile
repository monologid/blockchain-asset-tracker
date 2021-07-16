FROM node:14

WORKDIR /usr/src/apps

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]