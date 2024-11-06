# Transcendence | CODAM Amsterdam

## Introduction
Implementation of a Pong tournament web app, featuring real-time multiplayer games using TypeScript and React.

## Website
[www.strongpong.com](http://www.strongpong.com)

## Features
- Multiplayer Pong game
- Pong game against AI opponent
- Ladder competition wheb payling invite games
- Chat functionality including friend or game invite functionality
- Registration and login
- Login with OAuth system of 42 intranet for Codam students
- Optional two-factor authentication
- Swagger and Jest documentation available for creators

## Installation
note: The app can be used without installation on [www.strongpong.com](http://www.strongpong.com)

- Clone the repository: `git clone https://github.com/ccaljouw/codam_transcendence.git <new folder>`
- Change directory: `cd <new folder>`
- Add environment file: 
add `/app/backend/.env` (add variables according to example below)
```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

DATABASE_URL=`postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}`

#### AUTHENTICATION ###
CLIENT_ID=
SECRET=
GRANT_TYPE=
SCOPE=
STATE=
JWT_SECRET=
```
note: Login with OAuth system of 42 intranet for Codam students will not work unless the correct authentication values in the .env file are provided
- Build and run: `make`

## Known Issues
- Deployment server not configured for https
- Ugly error when logging in with 42 user using standard login method
- Channel invite cannot be rejected

## Credits
This project was created by Albert van Andel, Carlo Wesseling, Jorien Aberkrom and Carien Caljouw as a project for CODAM programming school.