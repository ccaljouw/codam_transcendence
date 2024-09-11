# Base Image
FROM node:21.6

# Copy the project and install dependencies
COPY ./package*.json /
RUN npm install -g npm@latest && npm install

# Set the path to the node_modules
ENV PATH /node_modules/.bin:$PATH

# Set the working directory to backend
WORKDIR /app/backend

# # Generate Prisma Client
# RUN npx prisma generate

# # Build the application
# RUN npm run build

# Expose ports (backend and prisma studio)
EXPOSE 3001
EXPOSE 5555

# Startup
COPY ./startup-script-backend.sh /
RUN chmod +x /startup-script-backend.sh
ENTRYPOINT ["/startup-script-backend.sh"]
CMD ["start"]
