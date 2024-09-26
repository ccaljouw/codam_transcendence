FROM node:21.6

# Set the path to the node_modules
ENV PATH /app/node_modules/.bin:$PATH

# Copy the package.json and lock file and install dependencies
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend application code
COPY . ./

# Copy the wait-for-it script and make it executable
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Start the frontend application
ENTRYPOINT ["/wait-for-it.sh", "deploy"]
