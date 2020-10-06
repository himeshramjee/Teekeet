FROM node:alpine

WORKDIR /app
COPY package.json .
RUN apk --no-cache add curl
RUN npm install --only=prod
COPY . .

CMD [ "npm", "run", "dev" ]  