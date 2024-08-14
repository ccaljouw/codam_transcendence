#!/bin/bash

# Install packages
echo "Installing packages..."
npm install
echo "Node.js version: $(node -v)" && echo "NPM version: $(npm -v)"

# Run the application
echo "Starting the application..."

# Execute the CMD arguments
cd backend
exec npm run "$@"
