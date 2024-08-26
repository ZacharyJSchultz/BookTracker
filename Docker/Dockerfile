# Create MySQL Image

FROM mysql
LABEL maintainer="zjs32@pitt.edu"

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=BookTracker

COPY booktracker.sql /docker-entrypoint-initdb.d/
COPY my.cnf /etc/

EXPOSE 3306