#!/bin/bash

COLOR_RESET=\033[0m
COLOR_GREEN=\033[32m
COLOR_RED=\033[31m
COLOR_BLUE=\033[34m

database_files='postgres_db/postgresql.conf'

# Install packages
echo "Installing packages..."
npm install
echo "Node.js version: $(node -v)" && echo "NPM version: $(npm -v)"

# Run the application
echo "Starting the application..."

# Check if database exists
if [ -d "$database_files" ]; then
  echo "$database_files does exist."
else
  echo "$database_files does not exist."
fi

# Execute the CMD arguments
cd backend

exec npx prisma studio & npm run "$@"