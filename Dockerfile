FROM node:21.6

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies and restart project
ENTRYPOINT ["npm", "run"]
CMD ["setup:dev"]