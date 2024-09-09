# Base Image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy the project and install dependencies
COPY . /app
RUN npm install -g npm@latest && npm install

# Set the path to the node_modules
ENV PATH /app/node_modules/.bin:$PATH

# Set the working directory to backend
WORKDIR /app/backend

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose ports (backend and prisma studio)
EXPOSE 3001
EXPOSE 5555

# Startup
RUN chmod +x /app/startup-script-backend.sh
ENTRYPOINT ["/app/startup-script-backend.sh"]
CMD ["start"]
