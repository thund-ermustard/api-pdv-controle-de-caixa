const joi = require('joi')

const esquemaProduto = joi.object({
    descricao: joi.string().trim().required().messages({
        "string.base": "O campo descricao deve ser uma string",
        "string.empty": "O campo descricao não pode ser vazio",
        "any.required": "O campo descricao é obrigatório"
    }),
    valor: joi.string().required().pattern(/^[0-9]+$/).messages({
        "string.empty": "O campo valor não pode ser vazio",
        "any.required": "O campo valor é obrigatório",
        "string.pattern.base": "O campo valor deve receber apenas numeros"
    }),
    quantidade_estoque: joi.string().required().pattern(/^[0-9]+$/).messages({
        "string.empty": "O campo quantidade_estoque não pode ser vazio",
        "any.required": "O campo quantidade_estoque é obrigatório",
        "string.pattern.base": "O campo quantidade_estoque deve receber apenas numeros"
    })

})

module.exports = esquemaProduto