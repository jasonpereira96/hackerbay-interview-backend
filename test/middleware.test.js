//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const { generateToken } = require('./utils');

chai.use(chaiHttp);

const protectedEndpoints = ['/patch', '/thumbnail'];
const UNAUTHORIZED = 401, OK = 200;

describe('Authorization', () => {
    protectedEndpoints.forEach(endpoint => {
        it('it should return unauthorized', done => {
            chai.request(app)
                .post(endpoint)
                .end((error, response) => {
                    response.should.have.status(UNAUTHORIZED);
                    done();
                });
        });

        it('it should return unauthorized', done => {
            chai.request(app)
                .post(endpoint)
                .set('Bearer', '')
                .end((error, response) => {
                    response.should.have.status(UNAUTHORIZED);
                    done();
                });
        });

        it('it should return unauthorized', done => {
            chai.request(app)
                .post(endpoint)
                .set('Bearer', 'Some random string')
                .end((error, response) => {
                    response.should.have.status(UNAUTHORIZED);
                    done();
                });
        });
    });
});


describe('Validation', () => {
    it('it should require username', done => {
        chai.request(app)
            .post('/login')
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('error').eql('"username" is required');
                done();
            });
    });
    it('Username should not be empty', done => {
        chai.request(app)
            .post('/login')
            .send({
                username: ''
            })
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('error').eql('"username" is not allowed to be empty');
                done();
            });
    });

    it('Password should not be empty', done => {
        chai.request(app)
            .post('/login')
            .send({
                username: 'jason',
                password: ''
            })
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('error').eql('"password" is not allowed to be empty');
                done();
            });
    });

    it('it should require password', done => {
        chai.request(app)
            .post('/login')
            .send({
                username: 'jason'
            })
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('error').eql('"password" is required');
                done();
            });
    });

    it('it should return password pattern does not match', done => {
        let credentials = {
            username: 'jason',
            password: 'test@#$%'
        };
        chai.request(app)
            .post('/login')
            .send(credentials)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('error')
                    .eql('"password" with value "test@#$%" fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/');
                done();
            });
    });

    it('it should return the correct JWT', done => {
        let credentials = {
            username: 'jason',
            password: 'TTTtest123'
        };
        chai.request(app)
            .post('/login')
            .send(credentials)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('token').eql(generateToken(credentials));
                response.body.should.have.property('loggedIn').eql(true);
                done();
            });
    });
});