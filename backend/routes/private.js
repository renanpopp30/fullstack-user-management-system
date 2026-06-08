import express from 'express'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/listar', async (req, res) => {
    try {
        const users = await prisma.user.findMany()

        res.status(200).json({ message: 'Usuários cadastrados', users })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Falha no servidor' })
    }

})

router.get('/perfil/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await prisma.user.findUnique({
            where: { id: id },
        })

        res.status(200).json({ message: 'Usuário', user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Falha no servidor' })
    }

})

router.put('/uptade-url-image/:id', async (req, res) => {
    try {
        const id = req.params.id
        const secure_url = req.body
        const linkURLimage = await prisma.user.update({
            where: { id: id},
            data: {linkURLimage: secure_url.linkURLimage}
        })

        res.status(200).json({ message: 'Link da foto do usuário:', linkURLimage })
    } catch (err) {
        res.status(500).json({ message: 'Falha no servidor' })
    }
}) // Não to utilizando essa rota porque agora to usando a edit-user para fazer o ulpload da imagem

router.put('/edit-user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const userInfo = req.body
        const data = {}
        if (userInfo.name) data.name = userInfo.name
        if (userInfo.email) data.email = userInfo.email
        if (userInfo.linkURLimage) data.linkURLimage = userInfo.linkURLimage
        const infoUser = await prisma.user.update({
            where: { id: id},
            data
        })
        res.status(200).json({ message: 'informações do usuário trocadas', infoUser })
    } catch (err) {
        res.status(500).json({ message: 'Falha no servidor' })
    }
})

router.put('/trocar-senha/:id', async (req, res) => {
    try {
        const id = req.params.id
        const userInfo = req.body
        // if (userInfo.novopassword) data.password = userInfo.novopassword
        const user = await prisma.user.findUnique({
            where: { id: id },
        })
        const isMatch = await bcrypt.compare(userInfo.passwordAtual, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Senha inválida' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(userInfo.novopassword, salt)
        const infoUser = await prisma.user.update({
            where: { id: id},
            data: { password: hashPassword }
        })
        res.status(200).json({ message: 'Senha alterada com sucesso !', infoUser })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Falha no servidor' })
    }
})

router.delete('/delete-user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await prisma.user.delete({
            where: { id: id },
        })
        res.status(200).json({ message: 'Usuário deletado com sucesso !', user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Falha no servidor' })
    }
})

export default router