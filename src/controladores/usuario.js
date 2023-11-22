const knex = require('../conexao/conexao')
const bcrypt = require('bcrypt')
const transportador = require('../email/email')
const jwt = require('jsonwebtoken')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const emailExiste = await knex('usuarios').where({ email }).first()

        if (emailExiste) {
            return res.status(400).json({ mensagem: 'E-mail já cadastrado' })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await transportador.sendMail({
            from: `${process.env.NOME_MAIL} <${process.env.USER_MAIL}>`,
            to: `${nome} <${email}>`,
            subject: "Olá! Seja bem vindo!",
            text: ` Olá, ${nome}!

            
            
            **Bem-vindo ao Time de Vendas do Mercadão do Milhão **
            
            Olá, ${nome}
            
            É com grande satisfação que damos as boas-vindas a você como parte da nossa equipe de vendas no [Nome do Seu Mercado]. Estamos empolgados em tê-lo conosco como um dos nossos valiosos vendedores de PDV!
            
            Nossa missão é proporcionar uma experiência de compra excepcional aos nossos clientes, e sua contribuição desempenha um papel fundamental nisso. Com o nosso software de PDV de última geração, você terá as ferramentas necessárias para facilitar transações rápidas e eficientes, garantindo que cada cliente tenha uma experiência suave e satisfatória.
            
            Estamos aqui para apoiá-lo em sua jornada. Se você tiver alguma dúvida ou precisar de treinamento adicional no software de PDV, nossa equipe de suporte está à disposição para ajudar.
            
            Este é o começo de uma jornada emocionante conosco, e mal podemos esperar para ver você prosperar em seu novo papel. Seja bem-vindo ao nosso time e ao nosso mercado. Estamos ansiosos para trabalhar juntos e alcançar o sucesso.
            
            Se você precisar de alguma assistência ou orientação, não hesite em entrar em contato conosco. Estamos aqui para apoiá-lo em cada passo do caminho.
            
            Bem-vindo e que você tenha muito sucesso em suas vendas!`
        });


        await knex('usuarios').insert({ nome, email, senha: senhaCriptografada })

        res.status(201).json({ mensagem: 'usuario cadastrado com sucesso' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body
    try {
        const usuario = await knex('usuarios').where({ email }).first()
        if (!usuario) {
            return res.status(400).json({ mensagem: 'email ou senha inválidos' })
        }

        const verificacaoDeSenha = await bcrypt.compare(senha, usuario.senha)

        if (!verificacaoDeSenha) {
            return res.status(400).json({ mensagem: 'email ou senha inválidos' })
        }

        const token = jwt.sign({ id: usuario.id }, process.env.TOKEN_PASS, { expiresIn: '8h' })

        const usuarioLogado = {
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
            token: token
        }

        //const { senha: _, ...restanteDasInfo } = usuario

        //return res.status(200).json({ usuario: { ...restanteDasInfo }, token }) ()
        return res.status(200).json(usuarioLogado)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }



}

module.exports = { cadastrarUsuario, loginUsuario }