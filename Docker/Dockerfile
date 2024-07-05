# Create MySQL Image

FROM mysql
LABEL maintainer="zjs32@pitt.edu"

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=BookFinder

COPY sys_funds.sql /docker-entrypoint-initdb.d/
COPY sys_transactions.sql /docker-entrypoint-initdb.d/

EXPOSE 3306