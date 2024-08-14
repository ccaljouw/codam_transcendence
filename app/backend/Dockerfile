FROM node:21.6

ENV PATH /app/node_modules/.bin:$PATH 

WORKDIR /app

COPY ./startup-script.sh /startup-script.sh
RUN chmod +x /startup-script.sh

ENTRYPOINT ["/startup-script.sh"]

