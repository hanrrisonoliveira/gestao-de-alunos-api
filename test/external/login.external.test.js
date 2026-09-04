import request from 'supertest';
import { expect } from 'chai';
import * as sinon from "sinon"
import authService from '../../src/services/auth.service.js';

describe('Login', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'admin@escola.com', senha: 'admin123' });

        expect(loginResposta.status).to.equal(200);
        expect(loginResposta.body).to.have.property('token');
    })

    it('deve retornar 400 quando a senha não for informada', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'admin@escola.com', senha: '' });

        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body).to.have.property('error', 'Os campos "email" e "senha" são obrigatórios.');

    })

    it('deve retornar 401 quando o usuário estiver correto mas a senha for incorreta', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'admin@escola.com', senha: 'admin1234' });

        expect(loginResposta.status).to.equal(401);
        expect(loginResposta.body).to.have.property('error', 'E-mail ou senha inválidos.');

    })

    it('deve retornar 500 quando acontecer algum problema de conexão com o banco de dados', async () => {
        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('Erro de conexão com o banco de dados'));

        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'admin@escola.com', senha: 'admin1234' });

        console.log(loginResposta.status)
        console.log(loginResposta.body)    
        expect(loginResposta.status).to.equal(500);
        expect(loginResposta.body.error).to.equal('Erro interno do servidor.');

        sinon.restore();
    })
})