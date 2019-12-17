# => Build container
FROM node:alpine as builder
WORKDIR /app
COPY package.json .
#COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

# => Run container
FROM nginx:stable
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/
RUN mkdir -p /app/build /usr/share/nginx/html/config
