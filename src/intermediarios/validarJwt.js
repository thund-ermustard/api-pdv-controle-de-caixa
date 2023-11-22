const jwt = require('jsonwebtoken')
const knex = require('../conexao/conexao')

const validarJwt = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'nao autorizado' })
    }

    const token = authorization.split(" ")[1]

    try {
        const verificacaoToken = jwt.verify(token, process.env.TOKEN_PASS)

        const usuario = await knex('usuarios').where({ id: verificacaoToken.id })

        if (!usuario) {
            return res.status(401).json({ mensagem: 'nao autorizado' })
        }
        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'nao autorizado' })
    }



}

module.exports = validarJwt