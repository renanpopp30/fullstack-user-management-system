import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Cadastro from "./pages/Cadastro"
import Login from "./pages/Login"
import ListarUsuarios from "./pages/Lista"
import Perfil from "./pages/Perfil"
import TrocarSenhaUser from "./pages/TrocarSenhaUser"

function App() {
  return (
    <BrowserRouter>
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <h1 className="text-2xl font-extrabold text-center">Full Stack User Management System</h1>
    </header>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listar-usuarios" element={<ListarUsuarios />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/trocar-senha" element={<TrocarSenhaUser />} />        
      </Routes>
    </BrowserRouter>
  )
}

export default App