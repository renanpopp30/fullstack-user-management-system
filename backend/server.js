import express from 'express';
import publicRoutes from './routes/public.js'
import privateRouter from './routes/private.js'
import auth from './middlewares/auth.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/', publicRoutes)
app.use('/', auth, privateRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT}`)
})