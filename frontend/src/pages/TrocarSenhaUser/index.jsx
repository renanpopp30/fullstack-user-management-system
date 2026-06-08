import api from "../../services/api"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

function TrocarSenhaUser() {
    const [allUser, setAllUser] = useState(null)
    const [urlImageUser, setUrlImageUser] = useState()
    const [senhaAtual, setSenhaAtual] = useState()
    const [senha1, setSenha1] = useState()
    const [senha2, setSenha2] = useState()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    
    async function loadUser() {
        try {
            const { data: { user } } = await api.get(`/perfil/${id}`, {
                // Minha api recebe o token pelo req.headers.authorization
                headers: { Authorization: `Bearer ${token}` },
            })
            setAllUser(user)
            setUrlImageUser(user.linkURLimage)
            
        } catch (err) {
            console.log(err)
        }
    }
    // useEffect é chamado toda vez que a tela carrega
    // e puxa os dados do usuario
    useEffect(() => {
        if (!token) {
            try {
                alert("Você não está logado")
                navigate('/login')
            } catch (error) {
                alert("Erro ao acessar a página")
                console.log(error)
            }
        }else {
            loadUser()
        }
    }, []) // ver de por token, navigate, loadUser por causa disso:
    // Tenho que deixar o token detro desse array pq
    // Sempre que o valor da variável token mudar, o React roda o bloco de código novamente
    // deixar o navigatee loadUser porque a documentação do React fala para deixar ali nas 
    // dependências toda variavel ou função externa

    async function alterarSenha() {
        console.log(senhaAtual)
        if (senha1 === "" || senha2 === "" || senhaAtual === "") {
            return alert("Preecha os campos !!!")
        }
        if (senha1 != senha2 && senha2 != senha1) {
            return alert("Confirme corretamente sua nova senha")
        }
        const { data, error } = await api.put(`/trocar-senha/${id}`, // URL
            { passwordAtual: senhaAtual, novopassword: senha1 }, // body backend recebe em req.body
            { headers: { Authorization: `Bearer ${token}` } } // config - recebe em req.headers no backend)
        )
        if (error) {
            return alert("Erro ao fazer alteração da senha")
        }
        alert("Senha alterada com sucesso !!!")
    }
    
    return (
        <div className="max-w-lg mx-auto mt-4 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold m-1 text-center text-gray-800">Altere a senha do Seu Perfil</h2>
            <div className="relative mx-auto mt-0 mb-[10px] w-40 h-40">
                <img src={urlImageUser} alt="Adicione sua foto" className="w-full h-full object-cover shadow-md border border-gray-300 rounded-full" />
            </div>
            <ul className="space-y-2">
                {/*allUser && é como se fosse um if ex: if(allUser){...}  */}
                {allUser && (
                    <li className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-bold">Seu E-mail: {allUser.email}</p>
                    </li>
                )}
            </ul>
            <input onChange={(e) => setSenhaAtual(e.target.value)} type="text" placeholder="Digite sua senha atual" className="w-full mt-1 mb-1 px-3 py-2 border border-gray-300 rounded-md" />
            <input onChange={(e) => setSenha1(e.target.value)} type="text" placeholder="Digite sua nova senha" className="w-full mb-1 px-3 py-2 border border-gray-300 rounded-md" />
            <input onChange={(e) => setSenha2(e.target.value)} type="email" placeholder="Confirme sua nova senha" className="w-full mb-1 px-3 py-2 border border-gray-300 rounded-md" />
            <button className="w-full bg-blue-500 mt-3 text-white py-2 px-4 rounded-md hover:bg-blue-400" onClick={alterarSenha}>Alterar Senha</button>
            <Link to="/perfil" className="text-blue-800 hover:underline mt-3 block text-center">Voltar</Link>
        </div>

    )

}

export default TrocarSenhaUser