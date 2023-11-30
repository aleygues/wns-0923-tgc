FROM node:18.18.2-alpine3.18

WORKDIR /app

COPY package.json package.json
# COPY package-lock.json package-lock.json
RUN npm i

COPY tsconfig.json tsconfig.json
COPY .eslintrc.json .eslintrc.json
COPY next-env.d.ts next-env.d.ts
COPY next.config.js next.config.js
COPY public public
COPY src src
RUN npm run build

CMD npm start
