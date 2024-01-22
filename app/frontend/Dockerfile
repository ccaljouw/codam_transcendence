FROM node:21.6

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app/frontend

# Install dependencies and restart project
ENTRYPOINT ["npm", "run"]
CMD ["dev"]