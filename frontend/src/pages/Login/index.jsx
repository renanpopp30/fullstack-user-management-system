import { Link, useNavigate } from "react-router-dom"
import { useRef } from "react"
import api from "../../services/api"
function Login() {
    const emailRef = useRef()
    const passwordlRef = useRef()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        // preventDefault() -> faz não reinicia a tela
        event.preventDefault()
        try {
            // colocar data dentro de {} para ele só trazer o que está dentro de data (token nesse caso), senão ele traz outras informações que nn precisa
            const { data }= await api.post('/login', {
                email: emailRef.current.value,
                password: passwordlRef.current.value
            })
            alert('Login efetuado com sucesso !!')
            localStorage.setItem('token', data.token)
            localStorage.setItem('id', data.id)
            navigate('/perfil')
            
        } catch (err) {
            alert('Senha ou email errados')
        }
        // Valor do input vem dentro desse "caminho" do objeto
        //console.log(emailRef.current.value)
    }

    return (
        <div className="max-w-lg mx-auto mt-24 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold m-6 text-center text-gray-800">Login</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input ref={emailRef} type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <input ref={passwordlRef} type="password" placeholder="Senha" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">Login</button>
            </form>
            <Link to="/" className="text-blue-800 hover:underline mt-4 block text-center">Não possui conta? Criar conta</Link>
        </div>

    )

}

export default Login