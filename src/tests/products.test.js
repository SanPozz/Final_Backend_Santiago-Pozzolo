import supertest from 'supertest'
import { expect } from 'chai'
import { describe, it } from 'mocha'

import mongoose from 'mongoose'
import { configENV } from '../config/configDotEnv.js'

mongoose.connect(configENV.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))


let token

const requester = supertest('http://localhost:8080')

    describe('Products Testing', async () => { 

        this.timeout(4000)

        before(async () => {
            let user = {
                email: "test@test.com",
                password: "test"
            }

            let login = await requester.post('/api/sessions/login').send(user)
            
            token = login.headers['set-cookie'][0]
        })

        after(async () => {
            await mongoose.connection.connection.collection('products').deleteOne({ code: "testcode"})
        })

        it('GET /api/products', async () => {
            const response = await requester.get('/api/products')

            expect(response.status).to.equal(200)
            expect(response.body).exist
            
        })
    })