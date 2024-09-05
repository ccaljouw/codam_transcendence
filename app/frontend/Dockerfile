# FROM node:21.6

# ENV PATH /app/node_modules/.bin:$PATH

# WORKDIR /app/frontend

# # Install dependencies and restart project
# ENTRYPOINT ["npm", "run"]
# CMD ["dev"]

#---------
FROM node:21.6

ENV PATH /app/node_modules/.bin:$PATH

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

WORKDIR /app/frontend

ENTRYPOINT ["/wait-for-it.sh","backend:3001",  "--"]
CMD ["npm", "run", "dev"]