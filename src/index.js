require('dotenv').config()
const express = require('express')
const rota = require('./rotas')

const app = express()

app.use(express.json())

app.use(rota)


app.listen(process.env.PORT, () => console.log("Servidor rodando")) // APAGAR ANTES DE ENTREGAR

