# hackerbay-interview-backend

REST API implementation for hackerbay interview.

This app is built with Express JS.

Docker Repository: https://hub.docker.com/r/jasonpereira074/hackerbay-backend

App deployed at: https://hackerbay-backend-app.herokuapp.com/

API Documentation: https://hackerbay-backend-app.herokuapp.com/docs


## Setup and Installation
### Installation
```
git clone https://github.com/jasonpereira96/hackerbay-interview-backend.git
cd hackerbay-interview-backend
npm install
```

### To start the server
```
npm start
```
Open http://localhost:8080 to access the server.

### To run the test cases
```
npm test
```
### To run the linter
```
npm run lint
```
### To autofix linting issues
```
npm run lintfix
```

## Endpoints
Refer to https://hackerbay-backend-app.herokuapp.com/docs for details.

### /login
Logs in a user. Takes a `username`(required) and `password`(required) as parameters and returns a JSON Web Token which can be used to validate future requests. It expires in 1 hour.

### /patch
Patches a JSON object. Takes 2 parameters, `json`(required) and `patch`(required). It will return the patched JSON object.

### /thumbnail
Resizes an image to 50px x 50px. Takes one parameter, `url`(required) which is the public URL of the image. Returns the resized image.
