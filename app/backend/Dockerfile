FROM node:21.6

WORKDIR /app/backend

ENV PATH /app/node_modules/.bin:$PATH 

# Install dependencies and restart project
ENTRYPOINT ["npm", "run"]
CMD ["setup:dev"]