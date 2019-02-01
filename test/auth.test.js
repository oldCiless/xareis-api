process.env.NODE_ENV = 'tests';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');

chai.use(chaiHttp);

const mongoose = require('mongoose');
const User = require('../app/models/user.model');

User.remove({}, (err) => {});

describe('Register', () => {
    it('Create new User', (done) => {
        const user = {
            phone: '+79999772031',
            password: 'aezakmi1',
            firstName: 'Konstantin',
            lastName: 'Perov',
        };

        chai.request(app)
            .post('/api/auth/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('user');
                res.body.should.have.property('token');
                res.body.should.have.property('message');
                done();
            });
    });

    it('Create already exist User', (done) => {
        const user = {
            phone: '+79999772031',
            password: 'aezakmi1',
            firstName: 'Konstantin',
            lastName: 'Perov',
        };

        chai.request(app)
            .post('/api/auth/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.be.a('object');
                done();
            });
    });
});
