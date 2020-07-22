FROM node:12.18.2-alpine3.9
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent
COPY assist/ assist/
COPY config/ config/
COPY dist/ dist/
COPY public/ public/
EXPOSE 10010
CMD npm run start