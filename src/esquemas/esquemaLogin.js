const joi = require('joi')

const esquemaLogin = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "O campo email deve conter um email válido",
        "string.base": "O campo email deve ser uma string",
        "string.empty": "O campo email não pode ser vazio",
        "any.required": "O campo email é obrigatório"
    }),
    senha: joi.string().required().trim().messages({
        "string.empty": "O campo senha não pode ser vazio",
        "any.required": "O campo senha é obrigatório",
        "string.base": "O campo senha deve ser uma string"
    })
})

module.exports = esquemaLogin