import { expect } from "chai";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import { configENV } from "../config/configDotEnv.js";
import supertest from "supertest";

mongoose.connect(configENV.MONGO_URL, {
    useNewUrlParser: true,});

let request;

describe('Testing products API', () => { 

    before(async () => {
        request = supertest('http://localhost:8080/api/products');
    })

    it('Get products', async () => {
        const response = await request.get('/');
        expect(response.status).to.equal(200);
    })

    it('Get product by ID', async () => {
        let product_id = '6621a365ae472bdd92c856b4';
        const response = await request.get(`/${product_id}`);
        expect(response.status).to.equal(200);
        expect(response.body._id).to.equal(product_id);
    })

    it('Post product', async () => {
        const product = {
            title: 'test',
            description: 'test',
            code: 'test',
            price: 10,
            status: true,
            stock: 10,
            category: 'test',
            thumbnails: ['test'],
            owner: 'admin'
        }
        const response = await request.post('/').send(product);
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(product.title);
    })

    it('Put product', async () => {
        const product = {
            title: 'test',
            description: 'test',
            code: 'test',
            price: 10,
            status: true,
            stock: 10,
            category: 'test',
            thumbnails: ['test'],
            owner: 'admin'
        }
        const response = await request.put('/6621a365ae472bdd92c856b4').send(product);
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(product.title);
        expect(response.body._id).to.equal('6621a365ae472bdd92c856b4');
        expect(response.body.owner).to.equal('admin');
        expect(response.body.category).to.equal('test');
        expect(response.body.price).to.equal(10);
        expect(response.body.stock).to.equal(10);
        expect(response.body.status).to.equal(true);
    })

    it('Delete product', async () => {
        const response = await request.delete('/6621a365ae472bdd92c856b4');
        expect(response.status).to.equal(200);
        expect(response.body._id).to.equal('6621a365ae472bdd92c856b4');
    })
})