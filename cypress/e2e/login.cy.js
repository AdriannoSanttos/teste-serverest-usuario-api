/// <reference types="cypress" />

describe('Login', () => {

  const usuario = {
    nome: 'Usuário QA',
    email: 'fulano@qa.com',
    password: 'teste',
    administrador: 'true'
  }

  before(() => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: usuario
    })
  })

  it('Deve fazer login com sucesso', () => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
        email: usuario.email,
        password: usuario.password
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('message', 'Login realizado com sucesso')
      expect(response.body).to.have.property('authorization').and.to.be.a('string')
      cy.log('Token:', response.body.authorization)
    })
  })

})

