FROM node:16.14.0 as build

WORKDIR /app
EXPOSE 443/tcp
COPY package.json .
COPY .env .
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:1.19
#COPY ./certificate/creditdirect.pem /etc/ssl/creditdirect.pem
#COPY ./certificate/creditdirectkey.pem /etc/ssl/creditdirectkey.pem
#COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html