/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'
import { faker } from '@faker-js/faker'

describe('Testes da Funcionalidade Produtos', () => {
  let token

  before(() => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
        email: 'fulano@qa.com',
        password: 'teste'
      }
    }).then(response => {
      expect(response.status).to.equal(200)
      token = response.body.authorization
    })
  })

  const gerarProduto = () => ({
    nome: faker.commerce.productName(),
    preco: faker.number.int({ min: 100, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 10, max: 200 })
  })

  it('Deve validar contrato de produtos', () => {
    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.body)
    })
  })

  it('Deve listar os produtos cadastrados', () => {
    cy.request('produtos').then(response => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('produtos')
      expect(response.duration).to.be.lessThan(20)
    })
  })

  it('Deve cadastrar um produto com sucesso', () => {
    const produto = gerarProduto()

    cy.request({
      method: 'POST',
      url: 'produtos',
      headers: { authorization: token },
      body: produto
    }).then(response => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  })

  it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
    const nomeDuplicado = 'Produto EBAC Novo 1'

    cy.request({
      method: 'POST',
      url: 'produtos',
      headers: { authorization: token },
      failOnStatusCode: false,
      body: {
        nome: nomeDuplicado,
        preco: 250,
        descricao: 'Descrição do produto novo',
        quantidade: 180
      }
    }).then(response => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Já existe produto com esse nome')
    })
  })

  it('Deve editar um produto já cadastrado', () => {
    cy.request('produtos').then(response => {
      const id = response.body.produtos[0]._id

      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          nome: 'Produto Editado',
          preco: 100,
          descricao: 'Produto editado',
          quantidade: 100
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  })

  it('Deve editar um produto cadastrado previamente', () => {
    const produto = gerarProduto()

    cy.request({
      method: 'POST',
      url: 'produtos',
      headers: { authorization: token },
      body: produto
    }).then(res => {
      const id = res.body._id

      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          ...produto,
          preco: produto.preco + 50,
          descricao: 'Produto editado via teste'
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  })

  it('Deve deletar um produto previamente cadastrado', () => {
    const produto = gerarProduto()

    cy.request({
      method: 'POST',
      url: 'produtos',
      headers: { authorization: token },
      body: produto
    }).then(res => {
      const id = res.body._id

      cy.request({
        method: 'DELETE',
        url: `produtos/${id}`,
        headers: { authorization: token }
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })
  })
})
