/// <reference types="cypress" />
import contrato from '../contracts/usuario.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.criarUsuario().should((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
    })
  })

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'João Teste',
        email: 'joaoteste.com.br',
        password: 'teste123',
        administrador: 'false'
      }
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.email).to.eq('email deve ser um email válido')
    })
  })

  it('Deve listar usuários cadastrados', () => {
    cy.listarUsuarios().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('usuarios')
    })
  })

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.criarUsuarioComToken().then(({ token, id }) => {
      cy.editarUsuario(token, id).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.message).to.eq('Registro alterado com sucesso')
      })
    })
  })

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.criarUsuarioComToken().then(({ token, id }) => {
      cy.deletarUsuario(token, id).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.message).to.eq('Registro excluído com sucesso')
      })
    })
  })

  it('Deve validar o contrato de usuários', () => {
    cy.validarContratoUsuarios(contrato)
  })

})
