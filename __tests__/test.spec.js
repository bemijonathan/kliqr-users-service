require('dotenv').config({ path: 'test.env' })

const request = require('supertest');
const app = require('../server');
const { connection, query, InitConnection } = require('../src/db');

beforeAll(async () => {
    await InitConnection()
});

afterAll(async () => {
    await query('DROP TABLE Users')
    connection.end()
})

describe('All tables should be created', () => {
    it('should show tables', async () => {
        const data = await query('DESCRIBE TABLE Users')
        expect(data[0].table).toEqual('Users')
    });
});

describe('That all Correct Api request is correct', () => {

    it('responds with json', function (done) {

        request(app)
            .get('/random')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done);

    });

    it('should return 400 when no header is set', (done) => {
        request(app)
            .get('/api/v1/users/?user')
            .expect(400).then(response => {

                expect(response.body.message).toEqual('missing api key')
                done();
            })
    });
    it('should return 400 for innvalid header ', (done) => {
        request(app)
            .get('/api/v1/users/?user')
            .set('token', 'arqetgmerlkp32#54#%@')
            .expect(400).then(response => {

                expect(response.body.message).toEqual('invalid Api Key ')
                done();
            })
    });

    it('should return 400 for innvalid header ', (done) => {
        request(app)
            .post('/api/v1/users/')
            .set('token', 'YXJxZXRnbWVybGtwMzIjNTQjJUA=')
            .send({
                first_name: "joanthan",
                last_name: "atiene",
                avatar: "https://cdn.dribbble.com/users/230875/screenshots/12078079/media/7ba8ec4a42b529dcbbc695ce0dd07a4a.jpg"
            })
            .expect(200).then(response => {
                expect(response.body.message).toEqual('success')
                done();
            })
    });

    it('should return 200 for an id ', (done) => {
        request(app)
            .get('/api/v1/users/')
            .set('token', 'YXJxZXRnbWVybGtwMzIjNTQjJUA=')
            .expect(200, done)
    });


    it('should return 404 for a not found id ', (done) => {
        request(app)
            .get('/api/v1/users/77')
            .set('token', 'YXJxZXRnbWVybGtwMzIjNTQjJUA=')
            .expect(404, done)
    });

    it('should return 200 when deleting the id ', async (done) => {
        let id = await query('select * from Users')
        request(app)
            .delete('/api/v1/users/' + id[0].id)
            .set('token', 'YXJxZXRnbWVybGtwMzIjNTQjJUA=')
            .expect(200, done)
    });
});