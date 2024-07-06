# Create MySQL Image

FROM mysql
LABEL maintainer="zjs32@pitt.edu"

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=BookTracker

COPY booktracker.sql /docker-entrypoint-initdb.d/

EXPOSE 3306