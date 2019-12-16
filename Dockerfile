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

#RUN chmod 777 /var/cache/nginx /var/run /var/log/nginx

# Nginx config
#RUN rm -rf /etc/nginx/conf.d
#COPY conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/
RUN mkdir -p /app/build /usr/share/nginx/html/config

# Default port exposure
#EXPOSE 8080

# Copy .env file and shell script to container
#WORKDIR /usr/share/nginx/html
#COPY ./env.sh .
#COPY .env .

# Add bash
#RUN apk add --no-cache bash

# Make our shell script executable
#RUN chmod +x env.sh
#RUN adduser -S -D -H -h /app appuser
#RUN touch /var/run/nginx.pid && \
#  chown -R appuser /var/run/nginx.pid && \
#  chown -R appuser /var/cache/nginx

#USER appuser
# Start Nginx server
#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
#CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
