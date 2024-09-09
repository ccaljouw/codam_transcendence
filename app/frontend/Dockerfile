FROM node:21.6

ENV PATH /app/node_modules/.bin:$PATH

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

WORKDIR /app/frontend

ENTRYPOINT ["/wait-for-it.sh"]
CMD ["deploy"]