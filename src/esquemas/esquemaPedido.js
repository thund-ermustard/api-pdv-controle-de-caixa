const joi = require('joi')

const esquemaPedido = joi.object({
    data: joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).messages({
        'string.pattern.base': 'O campo data deve seguir o formato dd-mm-aaaa',
        'string.empty': 'O campo data não pode ser vazio',
        'string.base': 'O campo data deve ser uma string'
    }),
    pedido_produtos: joi.array().required().min(1).items({
        produto_id: joi.number().positive().integer().required().messages({
            'any.required': 'O campo produto_id é obrigatorio',
            'number.base': 'O campo produto_id deve ser um numero',
            'number.positive': ' O campo produto_id deve ser um numero positivo'
        }),
        quantidade_produto: joi.number().positive().integer().required().messages({
            'any.required': 'O campo quantidade_produto é obrigatorio',
            'number.base': 'O campo quantidade_produto deve ser um numero',
            'number.positive': ' O campo quantidade_produto deve ser um numero positivo'
        })
    }).messages({
        'any.required': 'O campo pedido_produto é obrigatorio',
        'array.min': 'O campo pedido_produtos deve conter ao menos um item',
        'object.base': ' O campo pedido_produtos deve ser do tipo objeto',
        'array.base': 'O campo pedido_produtos deve ser um array'

    })

})

module.exports = esquemaPedido