
import Mainlayout from './views/mainlayout/Mainlayout';
import { BrowserRouter,Routes,Route } from "react-router";
import './App.css';
import ClienteForm from './componentes/cliente/ClienteForm';
import ClientesLista from './componentes/cliente/ClientesLista';
import ClienteDetalle from './componentes/cliente/ClienteDetalle';
import ClienteEditar from './componentes/cliente/ClienteEditar';
import Usuarios from './componentes/usuarios/Usuarios';
import SedesLista from './componentes/sedes/SedeLista';
import ClienteEliminar from './componentes/cliente/ClienteEliminar';
import SedeForm from './componentes/sedes/SedeForm';
import SedeEditar from './componentes/sedes/SedeEditar';
import SedeDetalle from './componentes/sedes/SedeDetalle';
import SedeEliminar from './componentes/sedes/SedeEliminar';
import ListaCiudades from './componentes/ciudad/CiudadLista';
import CiudadForm from './componentes/ciudad/CiudadForm';
import CiudadDetalle from './componentes/ciudad/CiudadDetalle';
import CiudadEditar from './componentes/ciudad/CiudadEditar';
import CiudadEliminar from './componentes/ciudad/CiudadEliminar';
import UploadImage from './componentes/cliente/CargarImagen';
import CrudImagen from './componentes/cliente/CrudImagen';
import EliminarImagen from './componentes/cliente/EliminarImagen';
import ActualizarImagen from './componentes/cliente/ActualizarImagen';
import DescargarImagen from './componentes/cliente/DescargarImagen';
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
          <Route path="/sedes" element={<SedesLista />} />
          <Route path="/sedes/crear" element={<SedeForm />} />
          <Route path="/sedes/editar/:id" element={<SedeEditar />} />
          <Route path="/sedes/ver/:id" element={<SedeDetalle />} />
          <Route path="/sedes/eliminar/:id" element={<SedeEliminar />} />
          <Route path="/ciudades" element={<ListaCiudades />} />
          <Route path="/ciudades/crear" element={<CiudadForm />} />
          <Route path="/ciudades/ver/:id" element={<CiudadDetalle />} />
          <Route path="/ciudades/editar/:id" element={<CiudadEditar />} />
          <Route path="/ciudades/eliminar/:id" element={<CiudadEliminar />} />

          <Route path="/imagen" element={<CrudImagen />} />
          <Route path="/imagen/asignar" element={<UploadImage />} />
          <Route path="/imagen/actualizar" element={<ActualizarImagen />} />
          <Route path="/imagen/eliminar" element={<EliminarImagen />} />
          <Route path="/imagen/descargar" element={<DescargarImagen />} />


        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
