## Info

This API is developed using **express.js** and **MongoDB**.

## Getting started

The first command that you need to execute before run de api is:
### `npm install`

This will install all the necessary dependencies to be able to start the project correctly.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the api in the development mode in [http://localhost:3001](http://localhost:3001)

The architecture of the api is designed to allow diferent versions for future updates or changes. So the base URL used for v1 is:   [http://localhost:3001/api/v1](http://localhost:3001/api/v1)

## Endpoints
### Transactions

GET: **/transactions**

GET: **/transactions/:hash**

POST: **/transactions**

### Accounts

GET: **/accounts**

GET: **/accounts/:hash**

PUT: **/accounts/:hash**


