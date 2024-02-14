# TESTING
Jest is the standard testframework for Nestjs and is now also configured for the frontend. 
The package.json in the backend folder contains the jest configuration where a Backend and Frontend project are setup that can be run seperately of together. 

Documentation: https://jestjs.io

Every file should have a .spec counterpart that contains the unit tests that isolate each function by mocking dependencies. 

Tests can be run by triggering the scripts provided in package.json or by calling the defined endpoints.
Testscripts should be run from the relevant folder (backend or frontend).

## The backend provides 7 endpoints for testing:
- test/all
- test/backend
- test/fontend
- test/output
- test/bakcend/report
- test/frondend/report
- test/seed

# Scripts in package.json
## Backend
The backend project is setup to use a node test environment. https://jestjs.io/docs/configuration#testenvironment-string
For the nest modules tests are grouped in the /test folder for each module. The following scripts are available the testscripts create a html file with the test result. This is not a seperate file for backend and frontend and is overwritten eacht time a test command is run:

'$ npm run test:all             
(jest)

'$ npm run test:watch         
(jest --watchAll): watches for file changes when running the tests

'$ npm run test:backend   
(jest --selectProjects backend): creates the folder and content for the coverage report on the backend tests.

'$ npm run test:frontend 
(jest --selectProjects frontend): creates the folder and content for the coverage report on the frontend tests.

## Frontend
The frontend project is setup to use jsdom test environment https://jestjs.io/docs/configuration#testenvironment-string
By adding a @jest-environment docblock at the top of the file, you can specify another environment to be used for all tests in that file

For each route tests can be included in the route folder The following scripts are available:
'$ test           
(jest)

'$ npm run test:ci         
(jest -ci)

## SEEDING
In 'seed.ts' located in the prisma folder (/backend/prisma) you can define data to put in the database.
To put this data in the database you can run the seed command in a running container.
'$ npm run seed
(prisma db seed): this script can only be run when at least the database container is running. 

## INTEGRATION TESTS
Integration tests have not yet been included
