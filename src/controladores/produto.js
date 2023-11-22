const knex = require("../conexao/conexao")
const s3 = require("../utils/awsSdkConfig")

const cadastrarProduto = async (req, res) => {
    const { descricao, valor, quantidade_estoque } = req.body
    if (req.file && !req.file.mimetype.includes('image')) {
        return res.status(400).json({ mensagem: 'O arquivo deve ser uma imagem' })
    }
    try {
        let produto_imagem = ''
        let nome_arquivo = ''

        if (req.file) {
            const arquivo = await s3.upload({
                Bucket: process.env.BUCKET,
                Key: req.file.originalname,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }).promise();

            produto_imagem = arquivo.Location
            nome_arquivo = arquivo.Key
        }

        const produtoRegistrado = await knex('produtos').insert({ descricao: descricao.trim(), valor, quantidade_estoque, produto_imagem, nome_arquivo }).returning(['id', 'descricao', 'valor', 'produto_imagem'])

        return res.status(201).json(produtoRegistrado[0])
    } catch (error) {
        res.status(500).json({ mensagem: 'erro interno do servidor' })
    }

}
const listarProduto = async (_, res) => {
    try {
        const listaDeProdutos = await knex('produtos').orderBy('id', 'asc')
        return res.status(200).json(listaDeProdutos)
    } catch (error) {
        res.status(500).json({ mensagem: 'erro interno do servidor' })
    }

}
const detalharProduto = async (req, res) => {
    const { id } = req.params

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: 'O id informado deve ser um numero inteiro' })
    }

    try {
        const produto = await knex('produtos').where({ id: Number(id) }).first()

        if (!produto) {
            return res.status(404).json({ mensagem: 'produto não encontrado' })
        }

        return res.status(200).json(produto)
    } catch (error) {
        res.status(500).json({ mensagem: 'erro interno do servidor' })
        console.log(error)
    }
}

const deletarProduto = async (req, res) => {
    const { id } = req.params

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: 'O id informado deve ser um numero inteiro' })
    }
    try {
        const produtoExistente = await knex('produtos').where({ id: Number(id) }).first()

        if (!produtoExistente) {
            return res.status(404).json({ mensagem: 'produto não encontrado' })

        }
        if (produtoExistente.produto_imagem) {
            await s3.deleteObject({
                Bucket: process.env.BUCKET,
                Key: produtoExistente.nome_arquivo
            }).promise()

        }
        await knex('produtos').where({ id: Number(id) }).del()
        return res.status(204).send()

    } catch (error) {
        res.status(500).json({ mensagem: 'erro interno do servidor' })
    }
}

module.exports = { cadastrarProduto, listarProduto, detalharProduto, deletarProduto }