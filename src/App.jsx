
import Mainlayout from './views/mainlayout/Mainlayout';
import { BrowserRouter,Routes,Route } from "react-router";
import './App.css';
import ClienteForm from './componentes/cliente/ClienteForm';
import ClientesLista from './componentes/cliente/ClientesLista';
import ClienteDetalle from './componentes/cliente/ClienteDetalle';
import ClienteEditar from './componentes/cliente/ClienteEditar';
import Usuarios from './componentes/usuarios/Usuarios';
import ClienteEliminar from './componentes/cliente/ClienteEliminar';
//<Route index element={<CardGroupButton />} />
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route path="*" element={<h1>No encontrado</h1>} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="usuarios/cliente/crear" element={<ClienteForm />} />
          <Route path="usuarios/cliente" element={<ClientesLista />} />
          <Route path="/usuarios/cliente/ver/:id" element={<ClienteDetalle />} />
          <Route path="/usuarios/cliente/editar/:id" element={<ClienteEditar />} />
          <Route path="/usuarios/cliente/eliminar/:id" element={<ClienteEliminar />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
