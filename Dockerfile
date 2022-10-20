FROM node:16.14.0 as build

WORKDIR /app
EXPOSE 443/tcp
COPY package.json .
COPY .env .
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:1.19
#COPY ./certificate/crt.pem /etc/ssl/keys/crt.pem
#COPY ./certificate/key.pem /etc/ssl/keys/key.pem
#COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html