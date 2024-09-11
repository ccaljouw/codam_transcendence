#!/bin/sh

COLOR_RESET=\033[0m
COLOR_GREEN=\033[32m
COLOR_RED=\033[31m
COLOR_BLUE=\033[34m

# Run the application
echo "Starting the application from script..."
npx prisma generate
# npx run build
npx prisma migrate deploy
npx prisma db push
npx prisma db seed
npx prisma studio &
exec npm run ${1}