const express = require('express')
const { cadastrarUsuario, loginUsuario } = require('./controladores/usuario')
const esquemaUsuario = require('./esquemas/esquemasUsuario')
const validarEsquema = require('./intermediarios/validadorEsquemas')
const esquemaLogin = require('./esquemas/esquemaLogin')
const { cadastrarProduto, listarProduto, detalharProduto, deletarProduto } = require('./controladores/produto')
const validarJwt = require('./intermediarios/validarJwt')
const esquemaProduto = require('./esquemas/esquemaProduto')
const arquivo = require('./intermediarios/multerConfig')
const { cadastrarPedido, listarPedidos } = require('./controladores/pedido')
const esquemaPedido = require('./esquemas/esquemaPedido')

const rota = express()

rota.post('/usuario', validarEsquema(esquemaUsuario), cadastrarUsuario)
rota.post('/login', validarEsquema(esquemaLogin), loginUsuario)

rota.use(validarJwt)

rota.post('/produto', arquivo.single('produto_imagem'), validarEsquema(esquemaProduto), cadastrarProduto)
rota.get('/produto', listarProduto)
rota.get('/produto/:id', detalharProduto)
rota.delete('/produto/:id', deletarProduto)
rota.post('/pedido', validarEsquema(esquemaPedido), cadastrarPedido)
rota.get('/pedido', listarPedidos)

module.exports = rota