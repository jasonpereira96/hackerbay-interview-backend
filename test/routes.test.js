// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const { generateToken } = require('./utils');

chai.use(chaiHttp);

const UNAUTHORIZED = 401; const OK = 200;

describe('/login route', () => {
    it('it should return the correct token', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const token = generateToken(credentials);
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
    it('it should return Unauthorized', (done) => {
        const data = {
            json: {
                baz: 'qux',
                foo: 'bar',
            },
            patch: [
                { op: 'replace', path: '/baz', value: 'boo' },
                { op: 'add', path: '/hello', value: ['world'] },
                { op: 'remove', path: '/foo' },
            ],
        };

        chai.request(app)
            .post('/patch')
            .send(data)
            .end((error, response) => {
                response.should.have.status(UNAUTHORIZED);
                done();
            });
    });


    it('it should return the correct json', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            json: {
                baz: 'qux',
                foo: 'bar',
            },
            patch: [
                { op: 'replace', path: '/baz', value: 'boo' },
                { op: 'add', path: '/hello', value: ['world'] },
                { op: 'remove', path: '/foo' },
            ],
        };
        const token = generateToken(credentials);

        chai.request(app)
            .post('/patch')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.be.a('object');
                response.body.should.have.property('baz').eql('boo');
                response.body.should.have.property('hello');
                response.body.hello.should.be.a('array');
                response.body.should.not.have.property('foo');
                done();
            });
    });

    it('it should return json is required', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            patch: [
                { op: 'replace', path: '/baz', value: 'boo' },
                { op: 'add', path: '/hello', value: ['world'] },
                { op: 'remove', path: '/foo' },
            ],
        };
        const token = generateToken(credentials);
        chai.request(app)
            .post('/patch')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property('error')
                    .eql('"json" is required');
                done();
            });
    });

    it('it should return patch is required', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            json: {
                baz: 'qux',
                foo: 'bar',
            },
        };
        const token = generateToken(credentials);

        chai.request(app)
            .post('/patch')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property('error')
                    .eql('"patch" is required');
                done();
            });
    });
});

describe('/thumbnail route', () => {
    it('it should return url is required', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {};
        const token = generateToken(credentials);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property('error')
                    .eql('"url" is required');
                done();
            });
    });

    it('it should return url should not be empty', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            url: '',
        };
        const token = generateToken(credentials);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property('error')
                    .eql('"url" is not allowed to be empty');
                done();
            });
    });

    it('it should return url must be a valid uri', (done) => {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            url: 'xyz',
        };
        const token = generateToken(credentials);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property('error')
                    .eql('"url" must be a valid uri');
                done();
            });
    });

    it('it should return the thumbnail', function (done) {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        };
        const token = generateToken(credentials);

        this.timeout(10000);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.not.have.property('error');
                response.should.have.header('content-type', 'image/jpg');
                done();
            });
    });

    it('it should return an error', function (done) {
        const credentials = {
            username: 'jason',
            password: 'test',
        };
        const data = {
            url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp_wrong_url.png',
        };
        const token = generateToken(credentials);

        this.timeout(10000);

        chai.request(app)
            .post('/thumbnail')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((error, response) => {
                response.should.have.status(OK);
                response.body.should.have.property('error')
                    .eql('Something went wrong. Could not resize image');
                done();
            });
    });
});
