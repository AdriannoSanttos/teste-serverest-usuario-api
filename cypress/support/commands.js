import { faker } from '@faker-js/faker'

Cypress.Commands.add('token', (email, senha) => {
  return cy.request({
    method: 'POST',
    url: 'login',
    body: {
      email: email,
      password: senha
    }
  }).then((response) => {
    expect(response.status).to.equal(200)
    return response.body.authorization
  })
})

Cypress.Commands.add('cadastrarProduto', (token, produto, preco, descricao, quantidade) => {
  return cy.request({
    method: 'POST',
    url: 'produtos',
    headers: { authorization: token },
    body: {
      nome: produto,
      preco: preco,
      descricao: descricao,
      quantidade: quantidade
    },
    failOnStatusCode: false
  })
})

// Comando que cria usuário, faz login e retorna token e id
Cypress.Commands.add('criarUsuarioComToken', () => {
  const usuario = {
    nome: `Usuário Teste ${Date.now()}`,
    email: `teste${Date.now()}@exemplo.com`,
    password: 'senha123',
    administrador: 'true'
  }

  return cy.request({
    method: 'POST',
    url: 'usuarios',
    body: usuario
  }).then((response) => {
    expect(response.status).to.eq(201)

    return cy.request({
      method: 'POST',
      url: 'login',
      body: {
        email: usuario.email,
        password: usuario.password
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      return {
        token: res.body.authorization,
        id: response.body._id
      }
    })
  })
})
