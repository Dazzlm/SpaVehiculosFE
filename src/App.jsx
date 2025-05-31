import Mainlayout from "./views/mainlayout/Mainlayout";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import ClienteForm from "./componentes/cliente/ClienteForm";
import ClientesLista from "./componentes/cliente/ClientesLista";
import ClienteDetalle from "./componentes/cliente/ClienteDetalle";
import ClienteEditar from "./componentes/cliente/ClienteEditar";
import Usuarios from "./componentes/usuarios/Usuarios";
import SedesLista from "./componentes/sedes/SedeLista";
import ClienteEliminar from "./componentes/cliente/ClienteEliminar";
import SedeForm from "./componentes/sedes/SedeForm";
import SedeEditar from "./componentes/sedes/SedeEditar";
import SedeDetalle from "./componentes/sedes/SedeDetalle";
import SedeEliminar from "./componentes/sedes/SedeEliminar";
import ListaCiudades from "./componentes/ciudad/CiudadLista";
import CiudadForm from "./componentes/ciudad/CiudadForm";
import CiudadDetalle from "./componentes/ciudad/CiudadDetalle";
import CiudadEditar from "./componentes/ciudad/CiudadEditar";
import CiudadEliminar from "./componentes/ciudad/CiudadEliminar";
import UploadImage from "./componentes/cliente/CargarImagen";
import CrudImagen from "./componentes/cliente/CrudImagen";
import EliminarImagen from "./componentes/cliente/EliminarImagen";
import ActualizarImagen from "./componentes/cliente/ActualizarImagen";
import DescargarImagen from "./componentes/cliente/DescargarImagen";
import './App.css';
import ListaAdministradores from "./componentes/Administrador/administrador"
import AdministradorDetalle from './componentes/Administrador/AdministradorDetalle';
import AdministradorEliminar from './componentes/Administrador/AdministradorEliminar';
import AdministradorEditar from './componentes/Administrador/AdministradorEditar';
import AdministradorCrear from './componentes/Administrador/AdministradorCrear';
import Facturar from "./componentes/Facturar/Facturar.jsx";
import ListaFacturas from "./componentes/list-facturas/ListFacturas";
import FacturaDetalle from "./componentes/factura-detalle/FacturaDetalle";
import CrearServicio from "./views/servicios/CrearServicio";
import ListaServicios from "./views/servicios/ListaServicios";
import EditarServicio from "./views/servicios/EditarServicio";
import CrearReserva from "./views/Reserva/CrearReserva";
import ListaReservas from "./views/Reserva/ListaReserva";
import ActualizarReserva from "./views/Reserva/ActualizarReserva";
import Facturacion from "./views/Facturacion/Facturacion.jsx";

import Login from './componentes/Login/Login.jsx';
import NotFound from "./views/notfound/NotFound.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
     
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Mainlayout />}>
          
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="usuarios/cliente/crear" element={<ClienteForm />} />
          <Route path="usuarios/cliente" element={<ClientesLista />} />
          <Route
            path="/usuarios/cliente/ver/:id"
            element={<ClienteDetalle />}
          />
          <Route
            path="/usuarios/cliente/editar/:id"
            element={<ClienteEditar />}
          />
          <Route
            path="/usuarios/cliente/eliminar/:id"
            element={<ClienteEliminar />}
          />
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
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/facturacion/registrar" element={<Facturar />} />
          <Route path="/facturacion/lista" element={<ListaFacturas />} />
          <Route path="/facturas/ver/:id" element={<FacturaDetalle />} />
          <Route path="/servicios/crear" element={<CrearServicio />} />
          <Route path="/servicios" element={<ListaServicios />} />
          <Route path="/servicios/editar/:id" element={<EditarServicio />} />
          <Route path="/reservas" element={<ListaReservas />} />
          <Route path="/reservas/crear" element={<CrearReserva />} />
          <Route path="/reservas/actualizar/:idReserva" element={<ActualizarReserva />} />
          <Route path='/usuarios/administradores'element ={<ListaAdministradores/>}></Route>
          <Route path='/usuarios/administrador/ver/:id'element={<AdministradorDetalle/>}></Route>
          <Route path='/usuarios/administrador/elminar/:id'element={<AdministradorEliminar/>}></Route>
          <Route path='/usuarios/administrador/editar/:id'element={<AdministradorEditar/>}></Route>
          <Route path='/usuarios/administrador/crear'element={<AdministradorCrear/>}></Route>


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
