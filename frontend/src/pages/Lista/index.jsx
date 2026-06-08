import api from "../../services/api"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function ListarUsuarios() {
    const [allUsers, setAllUsers] = useState([])
    // useEffect é chamado toda vez que a tela carrega
    useEffect(() => {
        const token = localStorage.getItem('token')
        async function loadUsers() {
            const { data: {users} } = await api.get('/listar', {
                // Minha api recebe o token pelo req.headers.authorization
                headers: { Authorization: `Bearer ${token}` }
            })
            setAllUsers(users)
        }
        
        loadUsers()
    }, [])

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold m-6 text-center text-gray-800">Lista de Usuários</h2>
            <ul className="space-y-2">
                {/*allUsers && é como se fosse um if ex: if(allUsers){...}  */}
                {allUsers && allUsers.length > 0 && allUsers.map((user) => (
                    <li key={user.id} className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-bold">Id: {user.id}</p>
                        <p>Nome: {user.name}</p>
                        <p>E-mail: {user.email}</p>
                    </li>
                ))}
            </ul>
            <Link to="/perfil" className="text-blue-800 hover:underline mt-4 block text-center">Seu Perfil</Link>
        </div>

    )

}

export default ListarUsuarios