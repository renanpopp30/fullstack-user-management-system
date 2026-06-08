import express from 'express';
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken"
import { Resend } from 'resend'

const prisma = new PrismaClient()
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const resend = new Resend(process.env.RESEND_API_KEY)

// Cadastro
router.post('/cadastro', async (req, res) => {
    console.log('=== ROTA CADASTRO CHAMADA ===')
    try {
        const user = req.body
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)
        const userDB = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashPassword,
            },

        })
        console.log('Usuário criado:', userDB)
        try {
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'renanpopp30@gmail.com',
                subject: 'Novo usuário cadastrado no Projeto React, Node.js e JWT !!',
                html: `
                <h2>Novo usuário cadastrado no Projeto React, Node.js e JWT</h2>
                <p>Nome: ${userDB.name}</p>
                <p>Email: ${userDB.email}</p>
                `
            })
            console.log("Email enviado:", data)
        } catch (error) {
            console.log("Erro ao mandar email:", error)
        }

        res.status(201).json(userDB)
    } catch (err) {
        console.log('ERRO CADASTRO:')
        console.log(err)
        res.status(500).json({ message: "Erro no servidor tente novamente" })
    }

})

// Login
router.post('/login', async (req, res) => {
    try {
        const userInfo = req.body
        
        const user = await prisma.user.findUnique({
            where: { email: userInfo.email },
        })

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }
    
        const isMatch = await bcrypt.compare(userInfo.password, user.password)
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha inválida' })
        }
        // Último acesso do usuário atualizado
        await prisma.user.update({
            where: { id: user.id},
            data: {lastLogin: new Date()}
        })
        // Gerar o Token JWT
        const token = jwt.sign({ id: user.id}, JWT_SECRET, { expiresIn: '1d'})

        res.status(200).json({ token, id: user.id })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Erro no servidor tente novamente" })
    }

})

export default router