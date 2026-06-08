import api from "../../services/api"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

function Perfil() {
    const [allUser, setAllUser] = useState(null)
    const imageRef = useRef()
    const [urlImageUser, setUrlImageUser] = useState()
    const [nameUser, setNameUser] = useState()
    const [emailUser, setEmailUser] = useState()
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
            setEmailUser(user.email)
            setNameUser(user.name)
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
    }, [])

    async function uploadImage() {
        try {
            const arquivoImage = imageRef.current.files[0];
            const formData = new FormData();
            formData.append('file', arquivoImage);
            formData.append('upload_preset', 'w3qge1mo');
            const response = await fetch('https://api.cloudinary.com/v1_1/dpqj8yonj/image/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            // depois de carregar a imagem do input tava usando setUrlImageUser(data.secure_url);
            // mais não dava certo poque se o usuario não mandasse nada(apertava em cancelar) reenvia a foto que estava antes
            //  -- Mandar pro backend --
            // requisição put(url, body, config)
            await api.put(`/edit-user/${id}`, // URL
                { linkURLimage: data.secure_url }, // body backend recebe em req.body
                { headers: { Authorization: `Bearer ${token}` } } // config - recebe em req.headers no backend)
            )
            loadUser()
        } catch (err) {
            alert('Erro ao enviar imagem');
        }
        
    }
    async function editUser() {
        if (nameUser === "" || emailUser === "") {
            return alert("Preecha os campos !!!")
        }
        if (nameUser === allUser.name && emailUser === allUser.email) {
            return alert("Você tem que trocar o Nome ou o Email para fazer a alteração")
        }
        const { data, error } = await api.put(`/edit-user/${id}`, // URL
            {
                name: nameUser,
                email: emailUser
            }, // body backend recebe em req.body
            { headers: { Authorization: `Bearer ${token}` } } // config - recebe em req.headers no backend)
        )
        if (error) {
            return alert("Erro ao fazer alterações")
        }
        setEmailUser(emailUser)
        setNameUser(nameUser)
        alert("Alterações salvas com sucesso !!!")
    }
    function logout() {
        try {
            localStorage.setItem('token', "")
            localStorage.setItem('id', "")
        } catch (error) {
            alert("Erro ao sair. Tente Novamente")
        }
        
    }
    async function deleteUser() {
        let deletar = confirm("Tem certeza que deseja deletar sua conta")
        if (deletar == true) {
            try {
                const { data, error } = await api.delete(`/delete-user/${id}`, // URL
                    { headers: { Authorization: `Bearer ${token}` } } // config - recebe em req.headers no backend)
                )
                alert("Usuário deletado com sucesso")
            } catch (err) {
                console.log(err)
                alert(err)
            }
        }
    }
    
    return (
        <div className="max-w-lg mx-auto mt-4 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold m-1 text-center text-gray-800">Seu Perfil de Usuário</h2>
            <div className="relative mx-auto mt-0 mb-[10px] w-40 h-40">
                <img src={urlImageUser} alt="Adicione sua foto" className="w-full h-full object-cover shadow-md border border-gray-300 rounded-full" />
                <label htmlFor="img-perfil" className="absolute right-1 bottom-1 bg-blue-600 text-white w-11 h-11 rounded-full flex justify-center items-center cursor-pointer shadow-md transition-all text-sm hover:bg-blue-500 hover:scale-110 hover:duration-500" >
                    <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg>
                    </i>
                </label>
                <input ref={imageRef} type="file" id="img-perfil" accept="image/*" className="hidden" onChange={uploadImage} />
            </div>
            <input value={nameUser} onChange={(e) => setNameUser(e.target.value)} type="text" placeholder="Seu Nome" className="w-full mb-1 px-3 py-2 border border-gray-300 rounded-md" />
            <input value={emailUser} onChange={(e) => setEmailUser(e.target.value)} type="email" placeholder="Seu Email" className="w-full mb-1 px-3 py-2 border border-gray-300 rounded-md" />
            <ul className="space-y-2">
                {/*allUser && é como se fosse um if ex: if(allUser){...}  */}
                {allUser && (
                    <li className="bg-gray-100 p-4 rounded-lg">
                        {console.log()}
                        <p className="font-bold">Id: {allUser.id}</p>
                        {/* <p>Nome: {allUser.name}</p>
                        <p>E-mail: {allUser.email}</p> */}
                        <p>Data Cadastro: {new Date(allUser.createdAt).toLocaleDateString('pt-BR')}</p>
                        <p>Último login: {new Date(allUser.lastLogin).toLocaleString('pt-BR', { timeStyle: 'short', dateStyle: 'short' })}</p>
                    </li>
                )}
                
            </ul>
            <button className="w-full bg-blue-500 mt-3 text-white py-2 px-4 rounded-md hover:bg-blue-400" onClick={editUser}>Salvar Alteração</button>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-36 col-span-1 mt-2">
                <Link to="/listar-usuarios" className="text-blue-800 hover:underline">Usuários Cadastrados</Link>
                <Link to="/trocar-senha" className="text-blue-800 hover:underline">Trocar Senha</Link>
            </div>
            <Link to="/login" onClick={logout} className="text-red-400 hover:underline mt-3 block text-center">Logout</Link>
            <Link to="/login" onClick={deleteUser} className="text-red-400 hover:underline mt-3 block text-center">Deletar minha conta</Link>
        </div>

    )

}

export default Perfil