FROM node:18.9-alpine AS BUILD

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80 3005

CMD ["npm", "run prod"]

FROM nginx:1.21.1-alpine
COPY --from=BUILD /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
