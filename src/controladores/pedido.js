const knex = require("../conexao/conexao")

const cadastrarPedido = async (req, res) => {
    const { data, pedido_produtos } = req.body
    let novaData = new Date()
    if (data) {
        novaData = new Date(data.slice(6, 10), Number(data.slice(3, 5)) - 1, data.slice(0, 2))
    }
    try {
        let soma = 0
        for (const produtoDoPedido of pedido_produtos) {
            const produto = await knex('produtos').where({ id: produtoDoPedido.produto_id }).first()

            if (!produto) {
                return res.status(404).json({ mensagem: `O produto de id ${produtoDoPedido.produto_id} não foi encontrado` })
            }

            if (produtoDoPedido.quantidade_produto > produto.quantidade_estoque) {
                return res.status(400).json({ mensagem: `O produto de id ${produtoDoPedido.produto_id} não possui estoque suficiente. Valor em estoque: ${produto.quantidade_estoque}` })
            }
            soma = soma + produtoDoPedido.quantidade_produto * produto.valor
        }
        const pedidoCadastrado = await knex('pedidos').insert({ data_pedido: novaData, valor_total: soma }).returning('*')

        for (const produtoDoPedido of pedido_produtos) {
            await knex('pedido_produtos').insert({ pedido_id: pedidoCadastrado[0].id, produto_id: produtoDoPedido.produto_id, quantidade_produto: produtoDoPedido.quantidade_produto })

            await knex('produtos').decrement('quantidade_estoque', produtoDoPedido.quantidade_produto).where({ id: produtoDoPedido.produto_id })
        }
        return res.status(201).json({ mensagem: 'O pedido foi cadastrado com sucesso' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: 'erro interno do servidor' })
    }

}

const listarPedidos = async (req, res) => {
    const { a_partir } = req.query;

    let dataInicial = new Date()

    if (a_partir) {
        dataInicial = new Date(a_partir.slice(6, 10), Number(a_partir.slice(3, 5)) - 1, a_partir.slice(0, 2))
    }

    try {
        let pedidos = []
        if (a_partir) {
            pedidos = await knex('pedidos').where('data_pedido', '>=', dataInicial)

        } else {
            pedidos = await knex('pedidos')
        }

        let listaDePedidos = []

        for (const pedido of pedidos) {
            const resultado = await knex('pedidos').join('pedido_produtos', 'pedidos.id', 'pedido_produtos.pedido_id').join('produtos', 'pedido_produtos.produto_id', 'produtos.id').select('pedido_produtos.id', 'pedido_produtos.quantidade_produto', 'produtos.valor as valor_produtos', 'pedido_produtos.pedido_id', 'pedido_produtos.produto_id').where({ pedido_id: pedido.id })

            listaDePedidos.push({ pedido: { id: pedido.id, valor_total: pedido.valor_total, data: pedido.data_pedido }, pedido_produtos: [...resultado] })
        }

        res.status(200).json(listaDePedidos)
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensagem: 'erro interno do servidor' });
    }
};

module.exports = { cadastrarPedido, listarPedidos }