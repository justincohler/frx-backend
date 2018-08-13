const User = require('../models/user');
const Prescription = require('../models/prescription');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

global.token = "";
global.user_id = "";
global.prescription_id = "";

before(() => {
    User.remove({}, (err, res) => {});
    Prescription.remove({}, (err, res) => {});
});

after(() => {
    User.remove({}, (err, res) => {});
    Prescription.remove({}, (err, res) => {});
});

// Users
// -----------------------------------------------------------------------------
describe('Users', () => {
    describe('/GET homepage', () => {
        it('should return 404 on homepage', (done) => {
            chai.request(server).get('/').end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
    describe('/POST signup', () => {
        it('should create new user', (done) => {
            chai.request(server).post('/v1/signup').set('Content-type', 'application/json').send({"email": "test@test.com", "password": "test123!"}).end((err, res) => {
                if (err) {
                    console.log(err['error'])
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('user_id');
                global.token = res.body.token;
                global.user_id = res.body.user_id;
                done();
            });
        });
    });

    describe('/POST signin', () => {
        it('should log in user', (done) => {
            chai.request(server).post('/v1/signin').set('Content-type', 'application/json').send({"email": "test@test.com", "password": "test123!"}).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('user_id');
                global.token = res.body.token;
                global.user_id = res.body.user_id;
                done();
            });
        });
    });
});

// Prescriptions
// -----------------------------------------------------------------------------
describe('Prescriptions', () => {
    describe('/GET user prescriptions', () => {
        it('should return an empty set', (done) => {
            chai.request(server).get('/v1/users/' + global.user_id + '/prescriptions').set('Content-type', 'application/json').set('authorization', global.token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.be.empty;
                done();
            });
        });
    });

    describe('/POST user prescription', () => {
        it('should create new user prescription', (done) => {
            chai.request(server).post('/v1/users/' + global.user_id + '/prescriptions').set('Content-type', 'application/json').set('authorization', global.token).send({"patient_id": "abc123", "rx_value": 5, "description": "test", "expiration_dt": new Date()}).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                global.prescription_id = res.body._id;
                done();
            });
        });
    });

    describe('/PATCH fill prescription', () => {
        it('should set the prescription to filled', (done) => {
            chai.request(server).patch('/v1/users/' + global.user_id + '/prescriptions/' + global.prescription_id).set('Content-type', 'application/json').set('authorization', global.token).send({"prescription_id": global.prescription_id, "filled_dt": new Date(), "transaction_id": "abc123"}).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                global.prescription_id = res.body._id;
                done();
            });
        });
    });
});

// SMS
// -----------------------------------------------------------------------------
describe('SMS', () => {
    describe('"SIGNUP" asks followup question', () => {
        it('should ask to save phone number', (done) => {
            chai.request(server).post("/v1/sms").set('content-type', 'application/x-www-form-urlencoded').send({"Body": "SIGNUP", "From": "+15554445555"}).end((err, res) => {
                res.should.have.status(200);
                console.log(res.body.Body);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('"YES" saves phone number', () => {
        it('should save phone number', (done) => {
            chai.request(server).post("/v1/sms").set('content-type', 'application/x-www-form-urlencoded').send({"Body": "YES", "From": "+15554445555"}).end((err, res) => {
                res.should.have.status(200);
                console.log(res.body.Body);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('"NO" does not save number', () => {
        it('should not save phone number', (done) => {
            chai.request(server).post("/v1/sms").set('content-type', 'application/x-www-form-urlencoded').send({"Body": "NO", "From": "+15554445555"}).end((err, res) => {
                res.should.have.status(200);
                console.log(res.body.Body);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('"REQUEST RX" saves a number and creates a discount', () => {
        it('should save number, create discount', (done) => {
            chai.request(server).post("/v1/sms").set('content-type', 'application/x-www-form-urlencoded').send({"Body": "REQUEST RX", "From": "+15554445555"}).end((err, res) => {
                res.should.have.status(200);
                console.log(res.body.Body);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});

// Food
// -----------------------------------------------------------------------------
describe('Foods', () => {
    describe('/GET foods matching "apples"', () => {
        it('should return apple foods', (done) => {
            chai.request(server).get("/v1/nutrition?q=apples").set('Content-type', 'application/json').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
});
