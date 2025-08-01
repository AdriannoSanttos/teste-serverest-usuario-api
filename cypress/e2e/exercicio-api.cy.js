/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
const contrato = require('../contracts/usuario.contract')


describe('Testes da Funcionalidade Usuários', () => {

  let token
  let usuarioId

  beforeEach(() => {
    // Apenas necessário se quiser gerar token globalmente aqui
    // Se quiser gerar dinamicamente apenas nos testes, pode deixar vazio
  })

  it('Deve cadastrar um usuário com sucesso', () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'teste123',
      administrador: 'true'
    }

    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: usuario
    }).should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  })

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'João Teste',
        email: 'joaoteste.com.br', // email inválido
        password: 'teste123',
        administrador: 'false'
      }
    }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body).to.have.property('email')
      expect(response.body.email).to.eq('email deve ser um email válido')
    })
  })

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  })

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.criarUsuarioComToken().then(({ token, id }) => {
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        headers: { Authorization: token },
        body: {
          nome: 'Usuário Editado',
          email: `editado_${Date.now()}@qa.com.br`,
          password: 'novaSenha123',
          administrador: 'false'
        }
      }).then(res => {
        expect(res.status).to.eq(200)
        expect(res.body.message).to.eq('Registro alterado com sucesso')
      })
    })
  })

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.criarUsuarioComToken().then(({ token, id }) => {
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
        headers: { Authorization: token }
      }).then(res => {
        expect(res.status).to.eq(200)
        expect(res.body.message).to.eq('Registro excluído com sucesso')
      })
    })
  })

  // cypress/e2e/usuarios.cy.js

it.only('Deve validar o contrato de usuários', () => {
  cy.request('usuarios').then((response) => {
    contrato.validateAsync(response.body)
  })
})



})

