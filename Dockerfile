FROM node:10.13-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent
COPY assist/ assist/
COPY config/ config/
COPY dist/ dist/
COPY public/ public/
EXPOSE 10010
CMD npm run start