import { faker } from '@faker-js/faker'

// Cria um usuário com dados dinâmicos
Cypress.Commands.add('criarUsuario', () => {
  const usuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'teste123',
    administrador: 'true'
  }

  return cy.request({
    method: 'POST',
    url: 'usuarios',
    body: usuario
  })
})

// Cria usuário + faz login => retorna token + id
Cypress.Commands.add('criarUsuarioComToken', () => {
  const usuario = {
    nome: `Usuário Teste ${Date.now()}`,
    email: `teste${Date.now()}@qa.com.br`,
    password: 'senha123',
    administrador: 'true'
  }

  return cy.request('POST', 'usuarios', usuario).then((res) => {
    expect(res.status).to.eq(201)

    return cy.request('POST', 'login', {
      email: usuario.email,
      password: usuario.password
    }).then((loginRes) => {
      return {
        token: loginRes.body.authorization,
        id: res.body._id
      }
    })
  })
})

Cypress.Commands.add('editarUsuario', (token, id) => {
  return cy.request({
    method: 'PUT',
    url: `usuarios/${id}`,
    headers: { Authorization: token },
    body: {
      nome: 'Usuário Editado',
      email: `editado_${Date.now()}@qa.com.br`,
      password: 'novaSenha123',
      administrador: 'false'
    }
  })
})

Cypress.Commands.add('deletarUsuario', (token, id) => {
  return cy.request({
    method: 'DELETE',
    url: `usuarios/${id}`,
    headers: { Authorization: token }
  })
})

Cypress.Commands.add('listarUsuarios', () => {
  return cy.request('GET', 'usuarios')
})

Cypress.Commands.add('validarContratoUsuarios', (contrato) => {
  return cy.request('usuarios').then((res) => {
    contrato.validateAsync(res.body)
  })
})
