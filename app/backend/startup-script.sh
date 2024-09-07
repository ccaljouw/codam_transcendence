#!/bin/sh

COLOR_RESET=\033[0m
COLOR_GREEN=\033[32m
COLOR_RED=\033[31m
COLOR_BLUE=\033[34m

# Run the application
echo "Starting the application..."
exec npx prisma studio & npx prisma migrate deploy & npx prisma db seed & npm run start:dev