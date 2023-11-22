const joi = require('joi')

const esquemaUsuario = joi.object({
    nome: joi.string().required().trim().messages({
        "any.required": "O campo nome é obrigatório",
        "string.base": "O campo nome deve ser uma string",
        "string.empty": "O campo nome não pode ser vazio"
    }),
    email: joi.string().email().required().messages({
        "string.email": "O campo email deve conter um email válido",
        "string.base": "O campo email deve ser uma string",
        "string.empty": "O campo email não pode ser vazio",
        "any.required": "O campo email é obrigatório"
    }),
    senha: joi.string().required().trim().min(8).max(50).messages({
        "string.empty": "O campo senha não pode ser vazio",
        "any.required": "O campo senha é obrigatório",
        "string.base": "O campo senha deve ser uma string",
        "string.min": "O campo senha deve ter no mínimo 8 caracteres",
        "string.max": "O campo senha deve ter no máximo 50 caracteres"
    })
})

module.exports = esquemaUsuario