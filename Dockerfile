FROM mhart/alpine-node:14.15.4
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "node", "entrypoint.js" ]