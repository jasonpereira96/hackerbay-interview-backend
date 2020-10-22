//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const { token } = require('morgan');
const app = require('../app');
const should = chai.should();
const { generateToken } = require('./utils');

chai.use(chaiHttp);

const protectedEndpoints = ['/patch', '/thumbnail'];
const UNAUTHORIZED = 401, OK = 200;

describe('/login route', () => {

    it('it should return the correct token', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let token = generateToken(credentials);
        chai.request(app)
            .post('/login')
            .send(credentials)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('token').eql(token);
                done();
            });
    });
});

describe('/patch route', () => {

    it('it should return Unauthorized', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            json: {
                baz: "qux",
                foo: "bar"
            },
            patch: [
                { op: "replace", path: "/baz", value: "boo" },
                { op: "add", path: "/hello", value: ["world"] },
                { op: "remove", path: "/foo" }
            ]
        };

        chai.request(app)
            .post('/patch')
            .send(data)
            .end((error, response) => {
                response.should.have.status(UNAUTHORIZED);
                done();
            });
    });


    it('it should return the correct json', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            json: {
                baz: "qux",
                foo: "bar"
            },
            patch: [
                { op: "replace", path: "/baz", value: "boo" },
                { op: "add", path: "/hello", value: ["world"] },
                { op: "remove", path: "/foo" }
            ]
        };
        let token = generateToken(credentials);

        chai.request(app)
            .post('/patch')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property("baz").eql("boo");
                response.body.should.have.property("hello");
                response.body.hello.should.be.a("array");
                response.body.should.not.have.property("foo");
                done();
            });
    });

    it('it should return json is required', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            patch: [
                { op: "replace", path: "/baz", value: "boo" },
                { op: "add", path: "/hello", value: ["world"] },
                { op: "remove", path: "/foo" }
            ]
        };
        let token = generateToken(credentials);
        chai.request(app)
            .post('/patch')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property("error").eql('"json" is required');
                done();
            });
    });

    it('it should return patch is required', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            json: {
                baz: "qux",
                foo: "bar"
            }
        };
        let token = generateToken(credentials);

        chai.request(app)
            .post('/patch')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property("error").eql('"patch" is required');
                done();
            });
    });
});

describe('/thumbnail route', () => {
    it('it should return url is required', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {};
        let token = generateToken(credentials);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK)
                response.body.should.have.property("error")
                    .eql('"url" is required');
                done();
            });
    });

    it('it should return url should not be empty', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            url: ''
        };
        let token = generateToken(credentials);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK)
                response.body.should.have.property("error")
                    .eql('"url" is not allowed to be empty');
                done();
            });
    });

    it('it should return url must be a valid uri', done => {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            url: 'xyz'
        };
        let token = generateToken(credentials);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property("error")
                    .eql('"url" must be a valid uri');
                done();
            });
    });

    it('it should return the thumbnail', function (done) {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            url: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'
        };
        let token = generateToken(credentials);

        this.timeout(10000);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.not.have.property("error");
                response.should.have.header('content-type', 'image/jpg');
                done();
            });
    });

    it('it should return an error', function (done) {
        let credentials = {
            username: 'jason',
            password: 'test'
        };
        let data = {
            url: 'https://homepages.cae.wisc.edu/~ece533/images/airplane123.png'
        };
        let token = generateToken(credentials);

        this.timeout(10000);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property("error").eql("Something went wrong. Could not resize image");
                done();
            });
    });
});
