FROM node:12.18.2-alpine3.9
RUN apk add --no-cache git
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent
COPY assist/ /usr/src/app/assist/
COPY config/ /usr/src/app/config/
COPY dist/ /usr/src/app/dist/
COPY public/ /usr/src/app/public/
EXPOSE 80
CMD npm run start:prod